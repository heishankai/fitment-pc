import React from 'react';
import { useNavigate } from '@umijs/max';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const QuickActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-left: ${theme.spacing.md};
`;

const QuickActionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.08);
  color: ${theme.colors.white};
  cursor: pointer;
  transition: ${theme.transitions.normal};
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
`;

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate('/order/client-order-query');
  };

  const handleStatisticsClick = () => {
    navigate('/home');
  };

  const defaultActions: QuickAction[] = [
    { icon: '📋', title: '快捷订单', onClick: handleOrderClick },
    { icon: '📊', title: '数据统计', onClick: handleStatisticsClick },
  ];

  const finalActions = actions || defaultActions;

  return (
    <QuickActionsContainer>
      {finalActions.map((action, index) => (
        <QuickActionItem
          key={index}
          title={action.title}
          onClick={action.onClick}
        >
          {action.icon}
        </QuickActionItem>
      ))}
    </QuickActionsContainer>
  );
};

export default QuickActions;
