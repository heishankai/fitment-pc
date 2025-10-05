import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { ConfigProvider, Dropdown } from 'antd';
import { Outlet, useNavigate } from '@umijs/max';
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
          headerTitleRender={() => {
            return <div onClick={() => navigate('/')}>叮当智装</div>;
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
