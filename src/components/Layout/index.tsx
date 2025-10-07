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
    primary: '#00cec9',
    secondary: '#00b4d8',
    tertiary: '#0077b6',
    white: '#ffffff',
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
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
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
    ${theme.colors.secondary} 50%,
    ${theme.colors.tertiary} 100%
  );
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
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex: 1;
  justify-content: flex-end;
`;

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
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #52c41a;
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

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 16px 0 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  color: ${theme.colors.white};
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: ${theme.transitions.normal};
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  pointer-events: none;
  transition: color 0.3s ease;

  ${SearchInput}:focus + & {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const QuickActions = styled.div`
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
  border-radius: 8px;
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

const UserDropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.08);
  color: ${theme.colors.white};
  transition: ${theme.transitions.normal};
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: ${theme.spacing.md};
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  ${UserDropdownTrigger}:hover & {
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const UserName = styled.span`
  color: ${theme.colors.white};
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.3px;
`;

const MobileMenuButton = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
    color: ${theme.colors.white};
    cursor: pointer;
    transition: ${theme.transitions.normal};
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-right: ${theme.spacing.sm};

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
  }
`;

// 响应式设计
const ResponsiveHeaderContainer = styled(HeaderContainer)`
  @media (max-width: 1200px) {
    padding: 0 ${theme.spacing.lg};
  }

  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md};

    ${HeaderCenter} {
      display: none;
    }

    ${HeaderLeft} {
      flex: 1;
    }

    ${HeaderRight} {
      flex: 0;
      gap: ${theme.spacing.sm};
    }
  }

  @media (max-width: 480px) {
    ${ActionButton} {
      width: 36px;
      height: 36px;
    }

    ${UserDropdownTrigger} {
      padding: ${theme.spacing.xs} ${theme.spacing.sm};
    }

    ${UserAvatar} {
      width: 28px;
      height: 28px;
      margin-right: ${theme.spacing.sm};
    }

    ${UserName} {
      font-size: 13px;
      max-width: 80px;
    }
  }
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
      <ResponsiveHeaderContainer>
        <HeaderLeft>
          <MobileMenuButton title="菜单">☰</MobileMenuButton>
          <BrandTitle title={BRAND_TITLE} onClick={handleHomeClick} />
        </HeaderLeft>

        <HeaderCenter>
          <SearchContainer>
            <SearchInput placeholder="搜索功能、订单、用户..." type="text" />
            <SearchIcon>🔍</SearchIcon>
          </SearchContainer>

          <QuickActions>
            <QuickActionItem title="快捷订单">📋</QuickActionItem>
            <QuickActionItem title="数据统计">📊</QuickActionItem>
            <QuickActionItem title="帮助中心">❓</QuickActionItem>
          </QuickActions>
        </HeaderCenter>

        <HeaderRight>
          <ActionButton title="通知">
            <StatusIndicator />
            🔔
          </ActionButton>

          <ActionButton title="设置">⚙️</ActionButton>

          <Dropdown menu={{ items: dropdownItems }}>
            <UserDropdownTrigger>
              <UserAvatar src={avatar} alt={username} />
              <UserName>{username}</UserName>
            </UserDropdownTrigger>
          </Dropdown>
        </HeaderRight>
      </ResponsiveHeaderContainer>
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
