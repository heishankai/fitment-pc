import { useRef, useEffect } from 'react';
import { message } from 'antd';

interface UseWebSocketProps {
  onNewMessage: (message: any) => void;
}

export const useWebSocket = ({ onNewMessage }: UseWebSocketProps) => {
  const socketRef = useRef<any>(null);

  const getToken = () =>
    document.cookie
      .split(';')
      .find((c) => c.trim().startsWith('token='))
      ?.split('=')[1] || '';

  const connect = async () => {
    const token = getToken();
    const baseURL = process.env.API_BASE_URL || '';

    if (!token) {
      message.error('缺少token');
      return;
    }

    if (!(window as any).io) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.onload = resolve;
        script.onerror = () => reject(new Error('Socket.io 库加载失败'));
        document.head.appendChild(script);
      }).catch(() => {
        message.error('WebSocket库加载失败，请检查网络连接');
        return;
      });
    }

    // 判断是否需要配置 path
    const isHttps = window.location.protocol === 'https:';
    const isNotLocalhost =
      !window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1');
    const needsPath = baseURL.includes('/api') || (isHttps && isNotLocalhost);

    // 获取 WebSocket URL（去掉 /api 后缀）
    const wsUrl = baseURL
      ? baseURL.replace(/\/api$/, '')
      : 'http://localhost:3000';

    const wsFullUrl = `${wsUrl}/chat`;

    // Socket.io 连接配置
    const socketOptions: any = {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    };

    // 生产环境需要配置 path
    if (needsPath) {
      socketOptions.path = '/api/socket.io/';
    }

    console.log('🔗 WebSocket 连接信息:', {
      url: wsFullUrl,
      path: socketOptions.path,
      needsPath,
      baseURL,
      wsUrl,
      isHttps,
      isNotLocalhost,
      hostname: window.location.hostname,
    });

    socketRef.current = (window as any).io(wsFullUrl, socketOptions);

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket已连接', {
        id: socketRef.current?.id,
        transport: socketRef.current?.io?.engine?.transport?.name,
      });
    });

    socketRef.current.on('connect_error', (err: any) => {
      console.error('❌ WebSocket连接失败:', {
        message: err?.message,
        type: err?.type,
        description: err?.description,
        url: wsFullUrl,
        error: err,
      });

      let errorMsg = '连接失败';
      const errorMessage = err?.message || err?.toString() || '';

      if (errorMessage.includes('timeout') || errorMessage.includes('超时')) {
        errorMsg = '连接超时，请检查网络或服务器状态';
      } else if (
        errorMessage.includes('401') ||
        errorMessage.includes('Unauthorized')
      ) {
        errorMsg = '认证失败，请重新登录';
      } else if (
        errorMessage.includes('404') ||
        errorMessage.includes('Not Found')
      ) {
        errorMsg = '聊天服务未找到，请检查服务器配置';
      } else if (
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('拒绝连接')
      ) {
        errorMsg = '无法连接到服务器，请确认服务器是否运行';
      } else if (
        errorMessage.includes('xhr poll error') ||
        errorMessage.includes('polling error')
      ) {
        errorMsg = '网络连接异常，请检查网络设置';
      }

      message.error(errorMsg);
    });

    socketRef.current.on('disconnect', (reason: string) => {
      console.warn('⚠️ WebSocket断开连接:', reason);
      if (reason === 'io server disconnect') {
        message.warning('连接已断开，请重新登录');
      }
    });

    socketRef.current.on('reconnect', (attemptNumber: number) => {
      console.log(`🔄 WebSocket重连成功 (第${attemptNumber}次尝试)`);
    });

    socketRef.current.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`🔄 WebSocket重连尝试 (第${attemptNumber}次)`);
    });

    socketRef.current.on('reconnect_error', (error: any) => {
      console.error('❌ WebSocket重连失败:', error);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('❌ WebSocket重连失败，已达到最大重试次数');
      message.error('连接失败，请刷新页面重试');
    });

    socketRef.current.on('new-message', (data: any) => {
      const msg = {
        ...data,
        sender_type: data.sender_type || data.senderType,
        message_type: data.message_type || data.messageType || 'text',
        createdAt: data.createdAt || data.created_at,
      };
      onNewMessage(msg);
    });
  };

  const sendMessage = (
    roomId: number,
    content: string,
    messageType = 'text',
  ) => {
    socketRef.current?.emit('send-message', {
      roomId,
      content,
      messageType,
    });
  };

  const joinRoom = (roomId: number) => {
    socketRef.current?.emit('join-room', { roomId });
  };

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    joinRoom,
  };
};
