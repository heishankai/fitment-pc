import React from 'react';
import { useRequest } from 'ahooks';
import {
  PageContainer,
  ProForm,
  ProFormList,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, Form, Row, Col, message } from 'antd';
import {
  saveSmsNotifyConfigService,
  getSmsNotifyConfigService,
} from './service';

import { NOTIFY_SCENES } from './const';

const SmsNotifyConfig = () => {
  const [form] = Form.useForm();

  const { loading } = useRequest(getSmsNotifyConfigService, {
    onSuccess: ({ success, data }) => success && form.setFieldsValue(data),
  });

  const handleFinish = async (values: any) => {
    console.log(values, 'values');
    const { success } = await saveSmsNotifyConfigService(values);
    if (!success) return;
    message.success('保存成功');
  };

  return (
    <PageContainer>
      <Card title="通知场景与号码" loading={loading}>
        <ProForm
          form={form}
          layout="vertical"
          submitter={{
            searchConfig: { submitText: '保存配置' },
            resetButtonProps: false,
          }}
          onFinish={handleFinish}
        >
          <ul>
            {NOTIFY_SCENES.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>

          <Row>
            <Col span={24}>
              <ProFormList
                initialValue={[{ phone: '' }]}
                min={1}
                name="phones"
                label="接收通知的手机号："
                creatorButtonProps={{ creatorButtonText: '添加号码' }}
                copyIconProps={false}
                itemRender={({ listDom, action }) => (
                  <Row gutter={16} style={{ marginBottom: 8 }} align="middle">
                    <Col flex="auto">{listDom}</Col>
                    <Col flex="none">{action}</Col>
                  </Row>
                )}
              >
                <ProFormText
                  name="phone"
                  placeholder="请输入手机号"
                  fieldProps={{ maxLength: 11, minLength: 11 }}
                  rules={[
                    {
                      required: true,
                      message: '请输入正确手机号',
                      pattern: /^1[3-9]\d{9}$/,
                    },
                  ]}
                />
              </ProFormList>
            </Col>
          </Row>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default SmsNotifyConfig;
