import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { notification } from 'antd';
import { BASE_URL } from '@/utils/request';

interface GetPriceNotification {
  id: number;
  area: string;
  houseType: string;
  houseTypeName: string;
  location: string;
  roomType: string;
  phone: string;
  createdAt: string;
}

interface UseGetPriceNotificationProps {
  onNewNotification?: (notification: GetPriceNotification) => void;
}

export const useGetPriceNotification = ({
  onNewNotification,
}: UseGetPriceNotificationProps = {}) => {
  const [notifications, setNotifications] = useState<GetPriceNotification[]>(
    [],
  );
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = () => {
      const token = Cookies.get('token');
      if (!token) {
        console.warn('未找到 token，无法连接 WebSocket');
        return;
      }

      try {
        const baseURL = BASE_URL || '';
        const wsUrl = baseURL
          ? baseURL.replace(/\/api$/, '')
          : 'http://localhost:3000';
        const wsFullUrl = `${wsUrl}/get-price-notification`;

        const isHttps = window.location.protocol === 'https:';
        const isNotLocalhost =
          !window.location.hostname.includes('localhost') &&
          !window.location.hostname.includes('127.0.0.1');
        const needsPath =
          baseURL.includes('/api') || (isHttps && isNotLocalhost);

        const socketOptions: any = {
          transports: ['websocket', 'polling'],
          auth: { token },
          query: { token },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        };

        if (needsPath) {
          socketOptions.path = '/api/socket.io/';
        }

        socketRef.current = (window as any).io(wsFullUrl, socketOptions);

        socketRef.current.on('connect', () => {
          console.log('获取报价通知 WebSocket 连接成功');
          setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
          console.log('获取报价通知 WebSocket 断开连接');
          setIsConnected(false);
        });

        socketRef.current.on('new-get-price', (data: GetPriceNotification) => {
          setNotifications((prev) => [data, ...prev]);

          // 右侧弹出通知
          notification.info({
            message: '新的获取报价请求',
            description: `${data.location} · ${data.houseTypeName} · ${data.area}㎡ · ${data.phone}`,
            placement: 'topRight',
            duration: 5,
            onClick: () => {
              if (window.location.pathname !== '/config/get-price') {
                window.location.href = '/config/get-price';
              }
            },
          });

          if (onNewNotification) {
            onNewNotification(data);
          }
        });

        socketRef.current.on('connect_error', (error: any) => {
          console.error('WebSocket 连接错误:', error);
          setIsConnected(false);
        });
      } catch (error) {
        console.error('初始化 WebSocket 失败:', error);
      }
    };

    const initSocket = () => {
      if ((window as any).io) {
        connectSocket();
      } else {
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
  }, [onNewNotification]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    isConnected,
    clearNotifications,
    removeNotification,
  };
};
