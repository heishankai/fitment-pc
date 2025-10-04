import { useState } from 'react';
import { useRequest } from 'ahooks';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Tabs, theme } from 'antd';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { loginService, getUserInfoService } from './service';
import storage from '@/utils/storage';

type LoginType = 'phone' | 'account';

const LoginContainer = styled.div`
  background-color: white;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
`;

const StyledLoginFormPage = styled(LoginFormPage)`
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const ActivityButton = styled(Button)`
  border-radius: 20px;
  width: 120px;
`;

const activityConfigStyle = (token: any) => {
  return {
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
    color: token.colorTextHeading,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    backdropFilter: 'blur(4px)',
  };
};

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const { token: styleToken } = theme.useToken();

  const { run: login, loading } = useRequest(loginService, {
    manual: true,
    onSuccess: async ({ success, data }) => {
      if (!success) return;

      // 设置token
      const { token } = data;
      Cookies.set('token', token, { expires: 1 });

      // 获取用户信息
      const { data: userInfo } = await getUserInfoService();
      storage.set('ddzz_userInfo', userInfo);

      location.href = '/';
    },
  });

  const handleConfirmSubmit = async (values: any) => {
    login(values);
  };

  return (
    <LoginContainer>
      <StyledLoginFormPage
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="叮当智装"
        onFinish={handleConfirmSubmit}
        loading={loading}
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        activityConfig={{
          style: activityConfigStyle(styleToken),
          title: '活动标题，可配置图片',
          subTitle: '活动介绍说明文字',
          action: (
            <ActivityButton
              size="large"
              style={{
                background: styleToken.colorBgElevated,
                color: styleToken.colorPrimary,
              }}
            >
              去看看
            </ActivityButton>
          ),
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          items={[{ key: 'account', label: '账号密码登录' }]}
        />
        {loginType === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: (
                  <UserOutlined style={{ color: styleToken.colorText }} />
                ),
              }}
              placeholder="请输入用户名"
              rules={[{ required: true }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: (
                  <LockOutlined style={{ color: styleToken.colorText }} />
                ),
              }}
              placeholder="请输入密码"
              rules={[{ required: true }]}
            />
          </>
        )}
      </StyledLoginFormPage>
    </LoginContainer>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Login />
    </ProConfigProvider>
  );
};
