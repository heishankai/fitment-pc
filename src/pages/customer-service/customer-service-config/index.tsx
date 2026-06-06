import React from 'react';
import { useRequest } from 'ahooks';
import {
  PageContainer,
  ProForm,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Card, Form, Image, Space, Typography, message } from 'antd';
import { BASE_URL } from '@/utils/request';
import { handleImageForm } from '@/utils';
import {
  getCustomerServiceConfigService,
  saveCustomerServiceConfigService,
} from './service';

const DEFAULT_WELCOME_TEXT = '欢迎使用智惠装，请问有什么可以帮助您的吗？';

const getUploadImageUrl = (uploadImages: any): string => {
  const item = uploadImages?.[0];
  if (!item) return '';

  return (
    item?.response?.data?.url ||
    item?.response?.url ||
    item?.url ||
    item?.thumbUrl ||
    ''
  );
};

const CustomerServiceConfig = () => {
  const [form] = Form.useForm();

  const { loading } = useRequest(getCustomerServiceConfigService, {
    onSuccess: ({ success, data }) => {
      if (!success) return;
      form.setFieldsValue({
        avatar: data?.avatar ? handleImageForm([data.avatar]) : [],
        welcome_text: data?.welcome_text || DEFAULT_WELCOME_TEXT,
        welcome_image: data?.welcome_image
          ? handleImageForm([data.welcome_image])
          : [],
      });
    },
  });

  const handleFinish = async (values: any) => {
    const avatar = getUploadImageUrl(values.avatar);
    const welcomeImage = getUploadImageUrl(values.welcome_image);
    const welcomeText = values.welcome_text?.trim();

    if (!welcomeText) {
      message.error('请输入欢迎语');
      return false;
    }

    const { success } = await saveCustomerServiceConfigService({
      avatar,
      welcome_text: welcomeText,
      welcome_image: welcomeImage,
    });

    if (!success) return false;
    message.success('保存成功');
    return true;
  };

  return (
    <PageContainer>
      <Card title="客服配置" loading={loading}>
        <ProForm
          form={form}
          layout="vertical"
          submitter={{
            searchConfig: { submitText: '保存配置' },
            resetButtonProps: false,
          }}
          initialValues={{ welcome_text: DEFAULT_WELCOME_TEXT }}
          onFinish={handleFinish}
        >
          <ProFormUploadButton
            name="avatar"
            label="客服头像"
            max={1}
            fieldProps={{
              listType: 'picture-card',
              accept: 'image/*',
              action: `${BASE_URL}/upload`,
            }}
            extra="业主咨询聊天中展示的客服头像"
          />

          <ProFormUploadButton
            name="welcome_image"
            label="欢迎图片"
            max={1}
            fieldProps={{
              listType: 'picture-card',
              accept: 'image/*',
              action: `${BASE_URL}/upload`,
            }}
            extra="用户首次咨询时，跟随欢迎语自动发送的图片"
          />

          <ProFormTextArea
            name="welcome_text"
            label="欢迎语"
            placeholder="请输入用户首次咨询时自动发送的欢迎语"
            rules={[{ required: true, message: '请输入欢迎语' }]}
            fieldProps={{
              maxLength: 500,
              showCount: true,
              rows: 4,
            }}
          />
        </ProForm>

        <Space direction="vertical" size={8}>
          <Typography.Text type="secondary">聊天展示预览</Typography.Text>
          <Space align="start">
            <Form.Item noStyle shouldUpdate>
              {() => {
                const avatar = getUploadImageUrl(form.getFieldValue('avatar'));
                const welcomeImage = getUploadImageUrl(
                  form.getFieldValue('welcome_image'),
                );
                const welcomeText =
                  form.getFieldValue('welcome_text') || DEFAULT_WELCOME_TEXT;
                return (
                  <>
                    {avatar ? (
                      <Image
                        src={avatar}
                        width={42}
                        height={42}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        preview={false}
                      />
                    ) : (
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: '50%',
                          background: '#1677ff',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        客
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: 420,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '14px 14px 14px 4px',
                          background: '#f5f5f5',
                          color: '#333',
                        }}
                      >
                        {welcomeText}
                      </div>
                      {welcomeImage ? (
                        <Image
                          src={welcomeImage}
                          width={180}
                          style={{
                            borderRadius: 8,
                            objectFit: 'cover',
                            background: '#f5f5f5',
                          }}
                        />
                      ) : null}
                    </div>
                  </>
                );
              }}
            </Form.Item>
          </Space>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default CustomerServiceConfig;
