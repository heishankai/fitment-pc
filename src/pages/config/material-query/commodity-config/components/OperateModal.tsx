import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Row, Col, Divider } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ProFormDigit,
  ProFormTextArea,
  ProFormList,
  DrawerForm,
} from '@ant-design/pro-components';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';
// service
import { createCommodityService, editCommodityService } from '../service';
// components
import CategorySelect from '@/components/CategorySelect';

const OperateModal = (props: any, ref: any) => {
  const { actionRef } = props ?? {};

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
    actionRef?.current?.reload();
  };

  // 暴露子组件方法 和数据
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });
  return (
    <DrawerForm
      open={visble}
      title={`${title === 'add' ? '新增' : '编辑'}商品`}
      form={form}
      width="100%"
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      drawerProps={{
        onClose: setFalse,
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={handleFinish}
      initialValues={{ sort: 0 }}
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
        <Col span={12}>
          <ProFormText
            label="单位"
            name="commodity_unit"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 10,
              showCount: true,
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            label="排序"
            name="sort"
            fieldProps={{
              min: 0,
              precision: 0,
              placeholder: '值越大越靠前，不填默认为0',
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
              maxLength: 800,
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
            // rules={[{ required: true }]}
            fieldProps={{
              maxLength: 800,
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
      <Divider orientation="left">商品详情</Divider>
      <Row>
        <Col span={24}>
          <ProFormList
            label=""
            name="commodity_details"
            wrapperCol={{ span: 24 }}
            min={1}
            initialValue={[{}]}
            itemRender={({ listDom, action }) => (
              <Row style={{ marginBlockEnd: 8 }}>
                <Col span={23}>{listDom}</Col>
                <Col span={1}>{action}</Col>
              </Row>
            )}
          >
            <Row gutter={16}>
              <Col span={8}>
                <ProFormText
                  label="商品标题"
                  name="title"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  fieldProps={{
                    maxLength: 50,
                    showCount: true,
                  }}
                />
              </Col>
              <Col span={8}>
                <ProFormTextArea
                  label="说明"
                  name="desc"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  fieldProps={{
                    maxLength: 800,
                    showCount: true,
                    rows: 5,
                    style: { resize: 'none' },
                  }}
                />
              </Col>
              <Col span={8}>
                <ProFormUploadButton
                  label="商品图片"
                  name="image"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
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
            </Row>
          </ProFormList>
        </Col>
      </Row>
    </DrawerForm>
  );
};

export default forwardRef(OperateModal);
