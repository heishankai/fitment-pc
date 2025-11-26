import React, { useState } from 'react';
import { Avatar } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const ChatHeaderContainer = styled.div`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  background: ${theme.colors.white};
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ChatHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;

  .name {
    font-weight: 500;
    font-size: 16px;
    color: #333;
  }

  .status-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #999;
  }
`;

const PhoneInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
`;

const PhoneIcon = styled.span`
  cursor: pointer;
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  transition: ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.secondary};
    transform: scale(1.1);
  }
`;

const PhoneText = styled.span`
  user-select: all;
  font-family: 'Monaco', 'Menlo', monospace;
`;

interface ChatHeaderProps {
  avatar?: string;
  nickname?: string;
  status?: string;
  phone?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  avatar,
  nickname = '工匠',
  status = '在线',
  phone,
}) => {
  const [showPhone, setShowPhone] = useState(false);

  const togglePhoneVisibility = () => {
    setShowPhone(!showPhone);
  };

  // 生成加密的电话号码显示（中间用*号代替）
  const getMaskedPhone = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    const length = phoneNumber.length;
    if (length <= 7) {
      // 如果号码很短，只显示前后各1位
      return phoneNumber[0] + '*'.repeat(length - 2) + phoneNumber[length - 1];
    }
    // 显示前3位和后4位，中间用*号
    const start = phoneNumber.slice(0, 3);
    const end = phoneNumber.slice(-4);
    const middle = '*'.repeat(length - 7);
    return `${start}${middle}${end}`;
  };

  return (
    <ChatHeaderContainer>
      <Avatar src={avatar} size={40}>
        {nickname?.[0] || '工'}
      </Avatar>
      <ChatHeaderText>
        <div className="name">{nickname}</div>
        <div className="status-line">
          <span>{status}</span>
          {phone && (
            <PhoneInfo>
              <PhoneText>{showPhone ? phone : getMaskedPhone(phone)}</PhoneText>
              <PhoneIcon
                onClick={togglePhoneVisibility}
                title={showPhone ? '隐藏电话' : '查看完整电话'}
              >
                {showPhone ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </PhoneIcon>
            </PhoneInfo>
          )}
        </div>
      </ChatHeaderText>
    </ChatHeaderContainer>
  );
};

export default ChatHeader;
