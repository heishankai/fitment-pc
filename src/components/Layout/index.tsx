import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { ConfigProvider, Dropdown, theme } from 'antd';
import { Outlet, useNavigate } from '@umijs/max';
// utils
import storage from '@/utils/storage';
import { clearLoginData } from '@/utils';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { avatar, username } = storage.get('ddzz_userInfo');
  const { token } = theme.useToken();
  console.log(avatar);

  return (
    <ProConfigProvider hashed={false}>
      <ConfigProvider
        getTargetContainer={() => {
          return document.getElementById('test-pro-layout') || document.body;
        }}
      >
        <ProLayout
          headerTitleRender={() => {
            return (
              <div
                onClick={() => navigate('/')}
                style={{
                  color: token.colorPrimary,
                  fontWeight: '600',
                  fontSize: 24,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textShadow: '0 1px 2px rgba(0, 206, 201, 0.1)',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.textShadow =
                    '0 2px 4px rgba(0, 206, 201, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.textShadow =
                    '0 1px 2px rgba(0, 206, 201, 0.1)';
                }}
              >
                叮当智装
              </div>
            );
          }}
          fixSiderbar
          splitMenus
          layout="mix"
          avatarProps={{
            src: avatar,
            size: 'small',
            title: username,
            render: (props, dom) => {
              return (
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
                  {dom}
                </Dropdown>
              );
            },
          }}
        >
          <Outlet />
        </ProLayout>
      </ConfigProvider>
    </ProConfigProvider>
  );
};

export default Layout;
