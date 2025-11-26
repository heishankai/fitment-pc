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
    const wsUrl = baseURL.replace(/\/api$/, '') || 'http://localhost:3000';

    if (!token) {
      message.error('缺少token');
      return;
    }

    if (!(window as any).io) {
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.7.2/socket.io.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    socketRef.current = (window as any).io(`${wsUrl}/craftsman-chat`, {
      auth: { token },
      query: { token },
      transports: ['websocket'],
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
