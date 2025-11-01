import React from 'react';
import { Avatar } from 'antd';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import dayjs from 'dayjs';

const MessageRow = styled.div<{ isMe?: boolean }>`
  display: flex;
  justify-content: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 8px;
`;

const AvatarWrapper = styled.div<{ isMe?: boolean }>`
  flex-shrink: 0;
  order: ${({ isMe }) => (isMe ? 2 : 0)};
`;

const MessageBubbleContainer = styled.div<{ isMe?: boolean }>`
  padding: 12px 16px;
  border-radius: ${({ isMe }) =>
    isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  background: ${({ isMe }) =>
    isMe
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
      : theme.colors.white};
  color: ${({ isMe }) => (isMe ? theme.colors.white : '#333')};
  box-shadow: ${({ isMe }) =>
    isMe
      ? `0 2px 8px ${theme.colors.primary}4D`
      : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
`;

const ImageWrapper = styled.div<{ isMe?: boolean }>`
  border-radius: ${({ isMe }) =>
    isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  overflow: hidden;
  box-shadow: ${({ isMe }) =>
    isMe
      ? `0 2px 8px ${theme.colors.primary}4D`
      : '0 2px 8px rgba(0, 0, 0, 0.08)'};
`;

const ImageBubble = styled.img`
  max-width: 200px;
  max-height: 300px;
  display: block;
  cursor: pointer;
`;

const MessageWrapper = styled.div<{ isMe?: boolean }>`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: ${({ isMe }) => (isMe ? 'flex-end' : 'flex-start')};
`;

const TimeText = styled.div<{ isMe?: boolean }>`
  font-size: 11px;
  color: #999;
  margin-top: 6px;
  padding: ${({ isMe }) => (isMe ? '0 4px 0 0' : '0 0 0 4px')};
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

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  avatar?: string;
  nickname?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  avatar,
  nickname = '用户',
}) => {
  const msgType = message.message_type || message.messageType || 'text';
  const formatTime = (t: string) => {
    const d = dayjs(t);
    const now = dayjs();
    return now.diff(d, 'day') === 0
      ? d.format('HH:mm')
      : now.diff(d, 'day') === 1
        ? `昨天 ${d.format('HH:mm')}`
        : d.format('MM-DD HH:mm');
  };

  return (
    <MessageRow isMe={isMe}>
      <AvatarWrapper isMe={isMe}>
        <Avatar src={avatar} size={36}>
          {nickname?.[0] || 'U'}
        </Avatar>
      </AvatarWrapper>
      <MessageWrapper isMe={isMe}>
        {msgType === 'image' ? (
          <ImageWrapper isMe={isMe}>
            <ImageBubble
              src={message.content}
              onClick={() => window.open(message.content, '_blank')}
              alt="聊天图片"
            />
          </ImageWrapper>
        ) : (
          <MessageBubbleContainer isMe={isMe}>
            {message.content}
          </MessageBubbleContainer>
        )}
        <TimeText isMe={isMe}>{formatTime(message.createdAt)}</TimeText>
      </MessageWrapper>
    </MessageRow>
  );
};

export default MessageBubble;
