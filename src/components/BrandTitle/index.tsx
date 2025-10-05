import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Space, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 动画定义
const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

// 样式组件
const TitleContainer = styled(Space)<{ $variant?: string }>`
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 12px;
  background: ${(props) =>
    props.$variant === 'header'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(0, 206, 201, 0.1) 100%)'};
  border: ${(props) =>
    props.$variant === 'header'
      ? '1px solid rgba(255, 255, 255, 0.3)'
      : '1px solid rgba(24, 144, 255, 0.2)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
  width: 240px;
  justify-content: flex-start;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: ${(props) =>
      props.$variant === 'header'
        ? '0 8px 25px rgba(255, 255, 255, 0.2)'
        : '0 8px 25px rgba(24, 144, 255, 0.15)'};
    background: ${(props) =>
      props.$variant === 'header'
        ? 'rgba(255, 255, 255, 0.25)'
        : 'linear-gradient(135deg, rgba(24, 144, 255, 0.15) 0%, rgba(0, 206, 201, 0.15) 100%)'};
  }
`;

const ShimmerEffect = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: ${shimmer} 3s infinite;

  ${TitleContainer}:hover & {
    animation: ${shimmer} 0.6s ease;
    transform: translateX(100%);
  }
`;

const IconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff 0%, #00cec9 100%);
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
`;

const Icon = styled(HomeOutlined)`
  color: white;
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const IconHalo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(24, 144, 255, 0.3) 0%,
    transparent 70%
  );
  animation: ${pulse} 2s infinite;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TitleText = styled(Title)<{ $variant?: string }>`
  margin: 0 !important;
  background: ${(props) =>
    props.$variant === 'header'
      ? 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)'
      : 'linear-gradient(135deg, #1890ff 0%, #00cec9 100%)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: 1px;
  text-shadow: ${(props) =>
    props.$variant === 'header'
      ? '0 2px 4px rgba(255, 255, 255, 0.3)'
      : '0 2px 4px rgba(24, 144, 255, 0.2)'};
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

// 组件接口
interface BrandTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'layout' | 'page' | 'header';
}

const BrandTitle: React.FC<BrandTitleProps> = ({
  title,
  subtitle,
  icon,
  onClick,
  variant = 'layout',
}) => {
  const isPageVariant = variant === 'page';

  return (
    <TitleContainer align="center" onClick={onClick} $variant={variant}>
      <ShimmerEffect />

      <ContentContainer>
        {isPageVariant ? (
          <IconContainer>
            {icon || <Icon />}
            <IconHalo />
          </IconContainer>
        ) : (
          icon || <Icon />
        )}

        <div>
          <TitleText
            level={isPageVariant ? 3 : undefined}
            style={{ fontSize: isPageVariant ? '24px' : '20px' }}
            $variant={variant}
          >
            {title}
          </TitleText>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </div>
      </ContentContainer>
    </TitleContainer>
  );
};

export default BrandTitle;
