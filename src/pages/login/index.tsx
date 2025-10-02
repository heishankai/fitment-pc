import storage from '@/utils/storage';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, message, Tabs, theme } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

type LoginType = 'phone' | 'account';

const LoginContainer = styled.div`
  background-color: white;
  height: 100vh;
  overflow: hidden; /* 防止页面滚动 */
  position: fixed; /* 固定定位 */
  width: 100%;
  top: 0;
  left: 0;
`;

const StyledLoginFormPage = styled(LoginFormPage)`
  background-attachment: fixed; /* 固定背景图 */
  background-size: cover; /* 覆盖整个容器 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat; /* 不重复 */
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

  // 登录
  const handleConfirmSubmit = async (values: any) => {
    console.log(values, 'values');
    message.success('登录成功');
    storage.set('token', values);
    location.href = '/';
  };

  return (
    <LoginContainer>
      <StyledLoginFormPage
        // backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="叮当智装"
        onFinish={handleConfirmSubmit}
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
        >
          <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
        </Tabs>
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
