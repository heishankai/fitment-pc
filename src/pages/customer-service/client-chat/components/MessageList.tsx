import React, { useEffect, useRef } from 'react';
import { Empty } from 'antd';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import MessageBubble from './MessageBubble';

const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
`;

interface Message {
  id: number;
  chat_room_id?: number;
  roomId?: number;
  sender_type?: string;
  senderType?: string;
  message_type?: string;
  messageType?: string;
  content: string;
  createdAt: string;
}

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
  currentUserType?: string;
  currentUserAvatar?: string;
  currentUserNickname?: string;
  otherUserAvatar?: string;
  otherUserNickname?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading = false,
  currentUserType = 'service',
  currentUserAvatar,
  currentUserNickname = '客服',
  otherUserAvatar,
  otherUserNickname = '用户',
}) => {
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollBottom, 100);
    }
  }, [messages]);

  if (loading) {
    return (
      <MessageListContainer ref={messagesRef}>
        <Empty description="加载中..." />
      </MessageListContainer>
    );
  }

  if (messages.length === 0) {
    return (
      <MessageListContainer ref={messagesRef}>
        <Empty description="暂无消息" />
      </MessageListContainer>
    );
  }

  return (
    <MessageListContainer ref={messagesRef}>
      {messages.map((message) => {
        const isMe =
          (message.sender_type || message.senderType) === currentUserType;
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isMe={isMe}
            avatar={isMe ? currentUserAvatar : otherUserAvatar}
            nickname={isMe ? currentUserNickname : otherUserNickname}
          />
        );
      })}
    </MessageListContainer>
  );
};

export default MessageList;
