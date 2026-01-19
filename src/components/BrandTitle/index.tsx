import React from 'react';
import styled from 'styled-components';

// 样式组件
const TitleContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
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
      <TitleText>{title}</TitleText>
    </TitleContainer>
  );
};

export default BrandTitle;
