// 通用样式组件
import styled from 'styled-components';
import { theme } from './theme';

// 卡片容器
export const Card = styled.div`
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  background: white;
  padding: ${theme.spacing.xl};
  transition: ${theme.transitions.normal};

  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

// 渐变卡片
export const GradientCard = styled.div<{ gradient: string }>`
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  background: ${(props) => props.gradient};
  color: white;
  overflow: hidden;
  position: relative;
  padding: ${theme.spacing.xl};
  cursor: pointer;
  transition: ${theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.xl};
  }
`;

// 容器
export const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.xl};
`;

// 分隔线
export const StyledDivider = styled.div`
  margin: ${theme.spacing.xxl} 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
`;
