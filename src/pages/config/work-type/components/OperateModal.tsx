import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Row, Col } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ProFormDigit,
  ProFormTextArea,
  DrawerForm,
} from '@ant-design/pro-components';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';
// servicea
import { createWorkTypeService, editWorkTypeService } from '../service';

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
    const workTypeService =
      title === 'add' ? createWorkTypeService : editWorkTypeService;

    const { success } = await workTypeService(
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
      title={`${title === 'add' ? '新增' : '编辑'}工种`}
      form={form}
      width="76%"
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
            label="工种名称"
            name="work_title"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 50,
              showCount: true,
              placeholder: '如：工长、水电工、木工、油漆工等',
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            label="工种价格"
            name="work_price"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true }]}
            fieldProps={{
              addonAfter: '元',
              precision: 2,
              min: 0,
            }}
          />
        </Col>
      </Row>

      {/* 文本说明 */}
      <Row gutter={16}>
        <Col span={12}>
          <ProFormTextArea
            label="计价说明"
            name="pricing_description"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 200,
              showCount: true,
              rows: 5,
              style: { resize: 'none' },
              placeholder: '请输入计价说明（200字以内）',
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormTextArea
            label="服务范围"
            name="service_scope"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 200,
              showCount: true,
              rows: 5,
              style: { resize: 'none' },
              placeholder: '请输入服务范围（200字以内）',
            }}
          />
        </Col>
      </Row>

      {/* 图片上传 */}
      <Row gutter={16}>
        <Col span={12}>
          <ProFormUploadButton
            label="主图"
            name="display_images"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true, message: '请上传主图' }]}
            max={3}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传3张（第一张会作为封面图）"
          />
        </Col>
        <Col span={12}>
          <ProFormUploadButton
            label="服务详情"
            name="service_details"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            rules={[{ required: true, message: '请上传服务详情图片' }]}
            max={10}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传10张服务详情图片"
          />
        </Col>
      </Row>
    </DrawerForm>
  );
};

export default forwardRef(OperateModal);
