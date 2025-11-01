import React, { useCallback, useMemo } from 'react';
import { ProConfigProvider, ProLayout } from '@ant-design/pro-components';
import { ConfigProvider } from 'antd';
import { Outlet, useNavigate } from '@umijs/max';
// components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import QuickActions from './components/QuickActions';
import HeaderActions from './components/HeaderActions';
import UserMenu from './components/UserMenu';
// utils
import storage from '@/utils/storage';

const BRAND_TITLE = '叮当智装';
const SIDER_WIDTH = 240;
const LAYOUT_ID = 'test-pro-layout';

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

  const handleHomeClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Memoized header render
  const headerRender = useCallback(
    () => (
      <Header
        brandTitle={BRAND_TITLE}
        onBrandClick={handleHomeClick}
        center={
          <>
            <SearchBar />
            <QuickActions />
          </>
        }
        right={
          <>
            <HeaderActions />
            <UserMenu userInfo={userInfo} />
          </>
        }
      />
    ),
    [BRAND_TITLE, handleHomeClick, userInfo],
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
