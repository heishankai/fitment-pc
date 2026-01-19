import { useEffect, useState, useRef } from 'react';
import { useRequest } from 'ahooks';
import Cookies from 'js-cookie';
import {
  getNotificationList,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type AdminNotification,
} from '../../service';
import { notification } from 'antd';
import { BASE_URL } from '@/utils/request';

export const useAdminNotification = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<any>(null);

  // 获取通知列表
  const {
    loading: notificationsLoading,
    run: fetchNotifications,
    refresh: refreshNotifications,
  } = useRequest(
    (params?: { notificationType?: string; isRead?: boolean }) =>
      getNotificationList(params),
    {
      manual: true,
      onSuccess: (response) => {
        const notificationsList = Array.isArray(response?.data)
          ? response.data
          : [];
        setNotifications(notificationsList);
      },
      onError: () => {
        setNotifications([]);
      },
    },
  );

  const [unreadCount, setUnreadCount] = useState(0);

  // 获取未读数量
  const { run: fetchUnreadCount, refresh: refreshUnreadCount } = useRequest(
    (notificationType?: string) => getUnreadCount(notificationType),
    {
      manual: true,
      onSuccess: (response) => {
        const count = response?.data?.count ?? 0;
        setUnreadCount(count);
      },
    },
  );

  // 标记通知为已读
  const { run: markAsReadRun } = useRequest(
    (notificationId: number) => markNotificationAsRead(notificationId),
    {
      manual: true,
      onSuccess: (_, [notificationId]) => {
        // 更新本地状态
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n,
          ),
        );
        // 刷新未读数量
        refreshUnreadCount();
      },
    },
  );

  // 标记所有通知为已读
  const { run: markAllAsReadRun } = useRequest(
    (notificationType?: string) => markAllNotificationsAsRead(notificationType),
    {
      manual: true,
      onSuccess: (_, [notificationType]) => {
        // 更新本地状态：只更新对应类型的通知
        setNotifications((prev) =>
          prev.map((n) => {
            if (notificationType && n.notification_type !== notificationType) {
              return n;
            }
            return { ...n, is_read: true };
          }),
        );
        // 刷新未读数量
        refreshUnreadCount();
      },
    },
  );

  // 封装方法以保持 API 一致
  const markAsRead = async (notificationId: number) => {
    markAsReadRun(notificationId);
  };

  const markAllAsRead = async (notificationType?: string) => {
    markAllAsReadRun(notificationType);
  };

  // 移除通知（本地移除）
  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // WebSocket 连接
  useEffect(() => {
    const connectSocket = () => {
      const token = Cookies.get('token');
      if (!token) {
        console.warn('未找到 token，无法连接 WebSocket');
        return;
      }

      try {
        // 构建 WebSocket URL
        const baseURL = BASE_URL || '';
        const wsUrl = baseURL
          ? baseURL.replace(/\/api$/, '')
          : 'http://localhost:3000';
        const wsFullUrl = `${wsUrl}/admin-notification`;

        // 判断是否需要配置 path
        const isHttps = window.location.protocol === 'https:';
        const isNotLocalhost =
          !window.location.hostname.includes('localhost') &&
          !window.location.hostname.includes('127.0.0.1');
        const needsPath =
          baseURL.includes('/api') || (isHttps && isNotLocalhost);

        const socketOptions: any = {
          transports: ['websocket', 'polling'],
          auth: {
            token: token,
          },
          query: {
            token: token,
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        };

        if (needsPath) {
          socketOptions.path = '/api/socket.io/';
        }

        socketRef.current = (window as any).io(wsFullUrl, socketOptions);

        socketRef.current.on('connect', () => {
          console.log('管理员通知 WebSocket 连接成功');
          setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
          console.log('管理员通知 WebSocket 断开连接');
          setIsConnected(false);
        });

        // 监听新通知
        socketRef.current.on('new-notification', (data: AdminNotification) => {
          console.log('收到新通知:', data);
          setNotifications((prev) => {
            // 检查是否已存在，避免重复
            const exists = prev.some((n) => n.id === data.id);
            if (exists) {
              return prev.map((n) => (n.id === data.id ? data : n));
            }
            // 新通知添加到列表顶部
            return [data, ...prev];
          });

          // 如果通知未读，更新未读数量并显示提示
          if (!data.is_read) {
            setUnreadCount((prev) => prev + 1);
            notification.info({
              message: data?.title,
              description: data?.content,
            });
          }
        });

        // 监听未读数量更新
        socketRef.current.on(
          'unread-count-update',
          (data: { count: number; notificationType?: string }) => {
            console.log('未读数量更新:', data);
            setUnreadCount(data.count);
            // 同时刷新通知列表
            refreshNotifications();
          },
        );

        // 监听已读状态更新
        socketRef.current.on(
          'notification-read-update',
          (data: { notificationId: number; isRead: boolean }) => {
            console.log('通知已读状态更新:', data);
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === data.notificationId
                  ? { ...n, is_read: data.isRead }
                  : n,
              ),
            );
          },
        );

        socketRef.current.on('connect_error', (error: any) => {
          console.error('WebSocket 连接错误:', error);
          setIsConnected(false);
        });
      } catch (error) {
        console.error('初始化 WebSocket 失败:', error);
      }
    };

    // 确保 socket.io 已加载
    const initSocket = () => {
      if ((window as any).io) {
        connectSocket();
      } else {
        // 动态加载 socket.io
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.async = true;
        script.onload = () => {
          connectSocket();
        };
        document.head.appendChild(script);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // 初始化加载（只在首次加载时获取一次）
  useEffect(() => {
    fetchNotifications({ isRead: false }); // 默认只加载未读通知
    fetchUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    isConnected,
    fetchNotifications: (notificationType?: string, isRead?: boolean) =>
      fetchNotifications({ notificationType, isRead }),
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
};
