import React from 'react';
import { useNavigate } from '@umijs/max';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const ActionButton = styled.div`
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
  overflow: hidden;

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
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      width: 100%;
      height: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${theme.colors.success};
  position: absolute;
  top: 8px;
  right: 8px;
  border: 2px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
    }
  }
`;

interface Action {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  showStatus?: boolean;
}

interface HeaderActionsProps {
  actions?: Action[];
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ actions }) => {
  const navigate = useNavigate();

  const handleNoticeClick = () => {
    navigate('/system/platform-notice');
  };

  const defaultActions: Action[] = [
    { icon: '🔔', title: '通知', showStatus: true, onClick: handleNoticeClick },
  ];

  const finalActions = actions || defaultActions;

  return (
    <>
      {finalActions.map((action, index) => (
        <ActionButton key={index} title={action.title} onClick={action.onClick}>
          {action.showStatus && <StatusIndicator />}
          {action.icon}
        </ActionButton>
      ))}
    </>
  );
};

export default HeaderActions;
