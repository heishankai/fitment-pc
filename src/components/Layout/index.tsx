import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { ConfigProvider, Dropdown } from 'antd';
import { Outlet, useNavigate } from '@umijs/max';
// components
import BrandTitle from '@/components/BrandTitle';
// utils
import storage from '@/utils/storage';
import { clearLoginData } from '@/utils';

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
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #1890ff 0%, #00cec9 100%)',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0px 24px 0px 14px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <BrandTitle
                  title="叮当智装"
                  onClick={() => navigate('/')}
                  variant="header"
                />
                <div style={{ marginLeft: 'auto' }}>
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <img
                        src={avatar}
                        alt={username}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          marginRight: '8px',
                        }}
                      />
                      <span style={{ color: 'white', fontWeight: '500' }}>
                        {username}
                      </span>
                    </div>
                  </Dropdown>
                </div>
              </div>
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
