import React, { useMemo } from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

// 类型定义
type TrendType = 'up' | 'down';

interface CardData {
  title: string;
  value: number;
  prefix: React.ReactNode;
  suffix: string;
  trend: TrendType;
  color: string;
  bgGradient: string;
}

// 常量定义
const TREND_COLORS = {
  up: '#52c41a',
  down: '#ff4d4f',
} as const;

const TREND_ICONS = {
  up: ArrowUpOutlined,
  down: ArrowDownOutlined,
} as const;

// Styled Components
const StyledCard = styled.div<{ bgGradient: string }>`
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: none;
  background: ${(props) => props.bgGradient};
  color: white;
  overflow: hidden;
  position: relative;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  .anticon {
    font-size: 24px;
    color: white;
  }
`;

const TrendWrapper = styled.div`
  text-align: right;
`;

// 通用样式
const getTrendColor = (trend: TrendType) => TREND_COLORS[trend];

const TrendIndicator = styled.div<{ trend: TrendType }>`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => `${getTrendColor(props.trend)}4D`};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.4);
    box-shadow: 0 2px 8px ${(props) => `${getTrendColor(props.trend)}33`};
  }

  .anticon {
    color: ${(props) => getTrendColor(props.trend)};
    font-size: 12px;
    font-weight: bold;
    transition: all 0.2s ease;
  }
`;

const TrendText = styled.span<{ trend: TrendType }>`
  color: ${(props) => getTrendColor(props.trend)};
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
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
  margin-top: 8px;
  line-height: 1.2;
`;

const DecorativeCircle = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  ${(props) =>
    props.position === 'top'
      ? 'top: -20px; right: -20px;'
      : 'bottom: -30px; left: -30px;'}
  width: ${(props) => (props.position === 'top' ? '80px' : '100px')};
  height: ${(props) => (props.position === 'top' ? '80px' : '100px')};
  border-radius: 50%;
  background: ${(props) =>
    props.position === 'top'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0.05)'};
  z-index: 1;
`;

// 卡片数据配置
const CARD_DATA: CardData[] = [
  {
    title: '今日新增用户',
    value: 93,
    prefix: <UserOutlined />,
    suffix: '+12%',
    trend: 'up',
    color: '#52c41a',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    title: '今日交易额',
    value: 812800,
    prefix: <DollarOutlined />,
    suffix: '+8.2%',
    trend: 'up',
    color: '#1890ff',
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    title: '今日新增订单',
    value: 1128,
    prefix: <ShoppingCartOutlined />,
    suffix: '-2.1%',
    trend: 'down',
    color: '#fa8c16',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
];

// 趋势图标组件
const TrendIcon: React.FC<{ trend: TrendType }> = ({ trend }) => {
  const IconComponent = TREND_ICONS[trend];
  return <IconComponent />;
};

// 单个卡片组件
const CardItem: React.FC<{ data: CardData; index: number }> = ({
  data,
  index,
}) => {
  return (
    <Col xs={24} sm={12} lg={8} key={index}>
      <StyledCard bgGradient={data.bgGradient}>
        <CardContent>
          <CardHeader>
            <IconWrapper>{data.prefix}</IconWrapper>
            <TrendWrapper>
              <TrendIndicator trend={data.trend}>
                <TrendIcon trend={data.trend} />
                <TrendText trend={data.trend}>{data.suffix}</TrendText>
              </TrendIndicator>
            </TrendWrapper>
          </CardHeader>

          <div>
            <CardTitle>{data.title}</CardTitle>
            <CardValue>{data.value.toLocaleString()}</CardValue>
          </div>
        </CardContent>

        <DecorativeCircle position="top" />
        <DecorativeCircle position="bottom" />
      </StyledCard>
    </Col>
  );
};

const CollectCard: React.FC = () => {
  const cardData = useMemo(() => CARD_DATA, []);

  return (
    <Row gutter={[24, 24]}>
      {cardData.map((item, index) => (
        <CardItem key={`card-${index}`} data={item} index={index} />
      ))}
    </Row>
  );
};

export default CollectCard;
