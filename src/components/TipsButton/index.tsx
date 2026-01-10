import React from 'react';
import { Badge, BadgeProps } from 'antd';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const TipsButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: ${theme.colors.white};
  cursor: pointer;
  transition: ${theme.transitions.normal};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

interface TipsButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
  badge: BadgeProps;
}

const TipsButton: React.FC<TipsButtonProps> = ({
  children,
  onClick,
  title,
  badge,
  ...rest
}) => {
  return (
    <Badge
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...badge}
    >
      <TipsButtonContainer onClick={onClick} title={title} {...rest}>
        {children}
      </TipsButtonContainer>
    </Badge>
  );
};

export default TipsButton;
