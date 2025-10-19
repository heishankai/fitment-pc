import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Row, Col, Divider } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ProFormDigit,
  ProFormTextArea,
  DrawerForm,
  ProFormList,
} from '@ant-design/pro-components';
// components
import { CitySelect } from '@/components';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';
// servicea
import {
  createCraftsmanQueryService,
  editCraftsmanQueryService,
} from '../service';
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
    }

    setRecord(record);
    setTitle(modalTitle);
    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    const craftsmanQueryService =
      title === 'add' ? createCraftsmanQueryService : editCraftsmanQueryService;

    const { success } = await craftsmanQueryService(
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
    <DrawerForm
      open={visble}
      title={`${title === 'add' ? '新增' : '编辑'}工匠`}
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
      initialValues={{}}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            label="工匠名称"
            name="craftsman_name"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 20,
              showCount: true,
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            label="年龄"
            name="craftsman_age"
            rules={[{ required: true }]}
            fieldProps={{
              min: 18,
              max: 100,
              precision: 0,
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            label="手机号码"
            name="craftsman_phone"
            rules={[{ required: true }]}
            fieldProps={{
              precision: 0,
            }}
          />
        </Col>
        <Col span={12}>
          <Form.Item label="城市" name="city" rules={[{ required: true }]}>
            <CitySelect labelInValue />
          </Form.Item>
        </Col>
      </Row>

      {/* 文本说明 */}
      <Row gutter={16}>
        <Col span={12}>
          <ProFormTextArea
            label="技能描述"
            name="craftsman_skill"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 50,
              showCount: true,
              rows: 5,
              style: { resize: 'none' },
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormTextArea
            label="个人简介"
            name="craftsman_intro"
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
            label="个人荣誉说明"
            name="craftsman_honor"
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
            label="过往工作说明"
            name="craftsman_work_intro"
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

      {/* 图片上传 */}
      <Row gutter={16}>
        <Col span={12}>
          <ProFormUploadButton
            label="形象照"
            name="craftsman_image"
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
            label="个人荣誉照片"
            name="craftsman_honor_images"
            rules={[{ required: true }]}
            max={3}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传3张"
          />
        </Col>
        <Col span={12}>
          <ProFormUploadButton
            label="技能证书"
            name="craftsman_skill_certificate"
            rules={[{ required: true }]}
            max={5}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传5张"
          />
        </Col>
      </Row>
      <Divider orientation="left">客户好评说明</Divider>
      <Row>
        <Col span={24}>
          <ProFormList
            label=""
            name="craftsman_customer_comments"
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
              <Col span={12}>
                <ProFormTextArea
                  label="说明描述"
                  name="comment_desc"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
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
                <ProFormUploadButton
                  label="说明照片"
                  name="comment_images"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  rules={[{ required: true }]}
                  max={3}
                  fieldProps={{
                    name: 'file',
                    listType: 'picture-card',
                    action: `${BASE_URL}/upload`,
                    accept: 'image/*',
                  }}
                  extra="最多上传3张"
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
