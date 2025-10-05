import React from 'react';
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

// Styled Components
const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #1890ff 0%, #00cec9 100%);
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0px 24px 0px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserDropdownContainer = styled.div`
  margin-left: auto;
`;

const UserDropdownTrigger = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
`;

const UserName = styled.span`
  color: white;
  font-weight: 500;
`;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { avatar, username } = storage.get('ddzz_userInfo');
  console.log(avatar);

  return (
    <ProConfigProvider hashed={false}>
      <ConfigProvider
        getTargetContainer={() => {
          return document.getElementById('test-pro-layout') || document.body;
        }}
      >
        <ProLayout
          siderWidth={240}
          headerTitleRender={() => {
            return (
              <BrandTitle
                title="叮当智装"
                onClick={() => navigate('/')}
                variant="layout"
              />
            );
          }}
          headerRender={() => {
            return (
              <HeaderContainer>
                <BrandTitle
                  title="叮当智装"
                  onClick={() => navigate('/')}
                  variant="header"
                />
                <UserDropdownContainer>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'logout',
                          icon: <LogoutOutlined />,
                          label: '退出登录',
                          onClick: () => {
                            clearLoginData();
                            navigate('/login');
                          },
                        },
                      ],
                    }}
                  >
                    <UserDropdownTrigger>
                      <UserAvatar src={avatar} alt={username} />
                      <UserName>{username}</UserName>
                    </UserDropdownTrigger>
                  </Dropdown>
                </UserDropdownContainer>
              </HeaderContainer>
            );
          }}
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
