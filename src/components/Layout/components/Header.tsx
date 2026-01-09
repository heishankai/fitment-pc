import React from 'react';
import styled from 'styled-components';
import BrandTitle from '@/components/BrandTitle';
import { theme } from '@/styles/theme';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${theme.gradients.header};
  height: 100%;
  padding: 0 ${theme.spacing.xl};
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 2;
  max-width: 400px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex: 0;
    gap: ${theme.spacing.sm};
  }
`;

interface HeaderProps {
  brandTitle: string;
  onBrandClick: () => void;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  brandTitle,
  onBrandClick,
  center,
  right,
}) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <BrandTitle title={brandTitle} onClick={onBrandClick} />
      </HeaderLeft>
      {center && <HeaderCenter>{center}</HeaderCenter>}
      {right && <HeaderRight>{right}</HeaderRight>}
    </HeaderContainer>
  );
};

export default Header;
