import React from 'react';
import styled from 'styled-components';
import { HomeOutlined } from '@ant-design/icons';

// 样式组件
const TitleContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  user-select: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.15);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const TitleText = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 24px;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

// 组件接口
interface BrandTitleProps {
  title: string;
  onClick?: () => void;
}

const BrandTitle: React.FC<BrandTitleProps> = ({ title, onClick }) => {
  return (
    <TitleContainer onClick={onClick}>
      <IconContainer>
        <HomeOutlined />
      </IconContainer>
      <TitleText>{title}</TitleText>
    </TitleContainer>
  );
};

export default BrandTitle;
