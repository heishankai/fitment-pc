import React from 'react';
import { Button, Input, Upload } from 'antd';
import { SendOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const InputBox = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.xl};
  background: ${theme.colors.white};
  border-top: 1px solid #eee;
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.04);
`;

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onImageUpload: UploadProps['customRequest'];
  sending?: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onImageUpload,
  sending = false,
  disabled = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <InputBox>
      <Upload
        customRequest={onImageUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button
          type="text"
          icon={<PictureOutlined style={{ fontSize: '20px' }} />}
          disabled={sending || disabled}
          style={{
            fontSize: '20px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        />
      </Upload>
      <Input.TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入消息..."
        autoSize={{ minRows: 1, maxRows: 4 }}
        onPressEnter={handleKeyPress}
        disabled={disabled}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={onSend}
        disabled={!value.trim() || sending || disabled}
        loading={sending}
      >
        发送
      </Button>
    </InputBox>
  );
};

export default ChatInput;
