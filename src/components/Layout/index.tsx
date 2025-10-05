import React, { useCallback, useMemo } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { ConfigProvider, Dropdown } from 'antd';
import { Outlet, useNavigate } from '@umijs/max';
import styled from 'styled-components';
// components
import BrandTitle from '@/components/BrandTitle';
// utils
import storage from '@/utils/storage';
import { clearLoginData } from '@/utils';

// Constants
const BRAND_TITLE = '叮当智装';
const SIDER_WIDTH = 240;
const LAYOUT_ID = 'test-pro-layout';

// Theme
const theme = {
  colors: {
    primary: '#1890ff',
    secondary: '#00cec9',
    white: '#ffffff',
    text: '#ffffff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
};

// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.secondary} 100%
  );
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 ${theme.spacing.xl} 0 ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
  position: relative;
  z-index: 1;
`;

const UserDropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.1);
  color: ${theme.colors.text};
  transition: ${theme.transitions.normal};
  user-select: none;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: ${theme.spacing.sm};
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: ${theme.transitions.fast};

  ${UserDropdownTrigger}:hover & {
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

const UserName = styled.span`
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

// Types
interface UserInfo {
  avatar: string;
  username: string;
}

const Layout: React.FC = () => {
  const navigate = useNavigate();

  // Get user info with error handling
  const userInfo: UserInfo = useMemo(() => {
    try {
      return storage.get('ddzz_userInfo') || { avatar: '', username: '用户' };
    } catch (error) {
      console.error('Failed to get user info:', error);
      return { avatar: '', username: '用户' };
    }
  }, []);

  const { avatar, username } = userInfo;

  // Memoized handlers
  const handleLogout = useCallback(() => {
    try {
      clearLoginData();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate]);

  const handleHomeClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Memoized dropdown menu items
  const dropdownItems = useMemo(
    () => [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
    [handleLogout],
  );

  // Memoized header render
  const headerRender = useCallback(
    () => (
      <HeaderContainer>
        <div>
          <BrandTitle
            title={BRAND_TITLE}
            onClick={handleHomeClick}
            variant="header"
          />
        </div>
        <div>
          <Dropdown menu={{ items: dropdownItems }}>
            <UserDropdownTrigger>
              <UserAvatar src={avatar} alt={username} />
              <UserName>{username}</UserName>
            </UserDropdownTrigger>
          </Dropdown>
        </div>
      </HeaderContainer>
    ),
    [BRAND_TITLE, handleHomeClick, dropdownItems, avatar, username],
  );

  // Memoized config provider
  const getTargetContainer = useCallback(() => {
    return document.getElementById(LAYOUT_ID) || document.body;
  }, []);

  return (
    <ProConfigProvider hashed={false}>
      <ConfigProvider getTargetContainer={getTargetContainer}>
        <ProLayout
          siderWidth={SIDER_WIDTH}
          headerRender={headerRender}
          fixSiderbar
          splitMenus
          layout="mix"
        >
          <Outlet />
        </ProLayout>
      </ConfigProvider>
    </ProConfigProvider>
  );
};

export default Layout;
