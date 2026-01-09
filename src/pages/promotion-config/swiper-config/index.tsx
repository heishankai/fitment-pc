import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRequest } from 'ahooks';
import { Row, Col, Divider, Button, message } from 'antd';
import { ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import { BASE_URL } from '@/utils/request';
import { extractImageUrl, handleImageForm } from '@/utils';
// service
import {
  createSwiperService,
  editSwiperService,
  getSwiperListService,
} from './service';

const Footer = styled.footer`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  background: #f0f2f5;
`;

const SwiperConfig = () => {
  const [form] = ProForm.useForm();
  const [record, setRecord] = useState<any>({});

  const { loading, run } = useRequest(getSwiperListService, {
    manual: true,
    onSuccess: ({ success, data }) => {
      if (!success) return;
      if (data?.id) {
        setRecord(data);
      }
      form.setFieldsValue({
        swiper_image: handleImageForm(data?.swiper_image),
      });
    },
  });

  // 保存
  const handleFinish = async () => {
    const values = await form.validateFields();

    const swiperService = record?.id ? editSwiperService : createSwiperService;

    const { success } = await swiperService(record?.id, {
      swiper_image: extractImageUrl(values?.swiper_image),
    });

    if (!success) return;
    message.success('保存成功');
    run();
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <ProForm
      form={form}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{}}
      submitter={false}
      loading={loading}
    >
      <Divider orientation="left">轮播图管理</Divider>
      <Row>
        <Col span={24}>
          <ProFormUploadButton
            label="轮播图"
            name="swiper_image"
            rules={[{ required: true }]}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            max={8}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传8张"
          />
        </Col>
      </Row>
      <Footer>
        <Button type="primary" onClick={handleFinish}>
          保存
        </Button>
      </Footer>
    </ProForm>
  );
};

export default SwiperConfig;
