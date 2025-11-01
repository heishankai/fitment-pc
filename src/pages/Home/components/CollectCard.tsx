import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { GradientCard } from '@/styles/styled';
import { theme } from '@/styles/theme';

// 类型定义
type TrendType = 'up' | 'down';

interface CardData {
  title: string;
  value: number;
  icon: React.ComponentType;
  suffix: string;
  trend: TrendType;
  gradient: string;
}

// 常量
const TREND_CONFIG = {
  up: { color: theme.colors.success, Icon: ArrowUpOutlined },
  down: { color: theme.colors.error, Icon: ArrowDownOutlined },
} as const;

// 卡片数据
const CARD_DATA: CardData[] = [
  {
    title: '今日新增用户',
    value: 93,
    icon: UserOutlined,
    suffix: '+12%',
    trend: 'up',
    gradient: theme.gradients.primary,
  },
  {
    title: '今日交易额',
    value: 812800,
    icon: DollarOutlined,
    suffix: '+8.2%',
    trend: 'up',
    gradient: theme.gradients.secondary,
  },
  {
    title: '今日新增订单',
    value: 1128,
    icon: ShoppingCartOutlined,
    suffix: '-2.1%',
    trend: 'down',
    gradient: theme.gradients.danger,
  },
];

// Styled Components
const CardContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const IconWrapper = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  .anticon {
    font-size: 24px;
    color: white;
  }
`;

const TrendIndicator = styled.div<{ trend: TrendType }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ trend }) => `${TREND_CONFIG[trend].color}4D`};
  transition: ${theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }

  .anticon {
    color: ${({ trend }) => TREND_CONFIG[trend].color};
    font-size: 12px;
  }

  span {
    color: ${({ trend }) => TREND_CONFIG[trend].color};
    font-size: 12px;
    font-weight: 600;
  }
`;

const CardTitle = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-top: ${theme.spacing.sm};
  line-height: 1.2;
`;

const DecorativeCircle = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  ${({ position }) =>
    position === 'top'
      ? 'top: -20px; right: -20px;'
      : 'bottom: -30px; left: -30px;'}
  width: ${({ position }) => (position === 'top' ? '80px' : '100px')};
  height: ${({ position }) => (position === 'top' ? '80px' : '100px')};
  border-radius: 50%;
  background: ${({ position }) =>
    position === 'top'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.05)'};
  z-index: 1;
`;

// 单个卡片组件
const StatCard: React.FC<{ data: CardData }> = ({ data }) => {
  const TrendIcon = TREND_CONFIG[data.trend].Icon;

  return (
    <Col xs={24} sm={12} lg={8}>
      <GradientCard gradient={data.gradient}>
        <CardContent>
          <CardHeader>
            <IconWrapper>
              <data.icon />
            </IconWrapper>
            <TrendIndicator trend={data.trend}>
              <TrendIcon />
              <span>{data.suffix}</span>
            </TrendIndicator>
          </CardHeader>
          <div>
            <CardTitle>{data.title}</CardTitle>
            <CardValue>{data.value.toLocaleString()}</CardValue>
          </div>
        </CardContent>
        <DecorativeCircle position="top" />
        <DecorativeCircle position="bottom" />
      </GradientCard>
    </Col>
  );
};

const CollectCard: React.FC = () => {
  return (
    <Row gutter={[24, 24]}>
      {CARD_DATA.map((item, index) => (
        <StatCard key={index} data={item} />
      ))}
    </Row>
  );
};

export default CollectCard;
