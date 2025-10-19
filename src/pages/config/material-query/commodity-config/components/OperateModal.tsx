import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Row, Col } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ModalForm,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';
// service
import { createCommodityService, editCommodityService } from '../service';
// components
import CategorySelect from '@/components/CategorySelect';

const OperateModal = (props: any, ref: any) => {
  const { tableFormRef } = props ?? {};

  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');
  const [record, setRecord] = useState<any>(null);

  // 打开弹框方法
  const handleOpenModal = (modalTitle: 'add' | 'edit', record?: any) => {
    console.log(record);

    if (modalTitle === 'edit') {
      transformEditData(record, form);
      setRecord(record);
    }

    setTitle(modalTitle);
    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    const commodityService =
      title === 'add' ? createCommodityService : editCommodityService;

    console.log(transformAddData(values), 'transformAddData(values)');

    const { success } = await commodityService(
      record?.id,
      transformAddData(values),
    );

    if (!success) return;

    message.success('操作成功');
    setFalse();
    tableFormRef?.current?.submit();
  };

  // 暴露子组件方法 和数据
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });
  return (
    <ModalForm
      open={visble}
      title={`${title === 'add' ? '新增' : '编辑'}商品`}
      form={form}
      width="72%"
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      modalProps={{
        onCancel: setFalse,
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={handleFinish}
    >
      <Row>
        <Col span={12}>
          <Form.Item
            label="所属类目"
            name="category"
            rules={[{ required: true }]}
          >
            <CategorySelect labelInValue />
          </Form.Item>
        </Col>
        <Col span={12}>
          <ProFormText
            label="商品名称"
            name="commodity_name"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 100,
              showCount: true,
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            label="商品价格"
            name="commodity_price"
            rules={[{ required: true }]}
            fieldProps={{
              addonAfter: '元',
              precision: 2,
              min: 0,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormTextArea
            label="商品描述"
            name="commodity_description"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 200,
              showCount: true,
              rows: 5,
              style: { resize: 'none' },
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormTextArea
            label="服务保障"
            name="service_guarantee"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 200,
              showCount: true,
              rows: 5,
              style: { resize: 'none' },
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormUploadButton
            label="商品封面"
            name="commodity_cover"
            rules={[{ required: true }]}
            max={1}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传1张"
          />
        </Col>
        <Col span={12}>
          <ProFormUploadButton
            label="商品主图"
            name="commodity_images"
            rules={[{ required: true }]}
            max={4}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传4张"
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <ProFormUploadButton
            label="商品详情图"
            name="commodity_detail_images"
            rules={[{ required: true }]}
            max={10}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传10张"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
