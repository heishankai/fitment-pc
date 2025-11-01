import React, { useMemo, useCallback } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { clearLoginData } from '@/utils';
import { useNavigate } from '@umijs/max';

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

  @media (max-width: 480px) {
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
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

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    margin-right: ${theme.spacing.sm};
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

  @media (max-width: 480px) {
    font-size: 13px;
    max-width: 80px;
  }
`;

interface UserInfo {
  avatar: string;
  username: string;
}

interface UserMenuProps {
  userInfo: UserInfo;
}

const UserMenu: React.FC<UserMenuProps> = ({ userInfo }) => {
  const navigate = useNavigate();
  const { avatar, username } = userInfo;

  const handleLogout = useCallback(() => {
    try {
      clearLoginData();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate]);

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

  return (
    <Dropdown menu={{ items: dropdownItems }}>
      <UserDropdownTrigger>
        <UserAvatar src={avatar} alt={username} />
        <UserName>{username}</UserName>
      </UserDropdownTrigger>
    </Dropdown>
  );
};

export default UserMenu;
