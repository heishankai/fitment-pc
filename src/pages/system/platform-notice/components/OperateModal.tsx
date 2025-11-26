import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, Col, Row, message } from 'antd';
import {
  ProFormText,
  ProFormTextArea,
  ModalForm,
  ProFormRadio,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import {
  createPlatformNoticeService,
  editPlatformNoticeService,
} from '../service';
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';

const OperateModal = (props: any, ref: any) => {
  const { tableFormRef } = props ?? {};

  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');
  const [record, setRecord] = useState<any>(null);

  // 打开弹框方法
  const handleOpenModal = (modalTitle: 'add' | 'edit', record?: any) => {
    if (modalTitle === 'edit') {
      transformEditData(record, form);
    }
    setRecord(record);
    setTitle(modalTitle);
    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    const platformNoticeService =
      title === 'add' ? createPlatformNoticeService : editPlatformNoticeService;

    const { success } = await platformNoticeService(
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
      title={`${title === 'add' ? '新增' : '编辑'}公告`}
      form={form}
      width="40%"
      modalProps={{ onCancel: setFalse, destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{}}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
    >
      <Row>
        <Col span={24}>
          <ProFormText
            label="公告标题"
            name="notice_title"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 50,
              showCount: true,
            }}
          />
        </Col>
        <Col span={24}>
          <ProFormRadio.Group
            label="公告类型"
            name="notice_type"
            rules={[{ required: true }]}
            fieldProps={{
              options: [
                { label: '用户端公告', value: '1' },
                { label: '工匠端公告', value: '2' },
              ],
            }}
          />
        </Col>
        <Col span={24}>
          <ProFormTextArea
            label="公告内容"
            name="notice_content"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 2000,
              showCount: true,
              rows: 6,
            }}
          />
        </Col>
        <Col span={24}>
          <ProFormUploadButton
            label="公告图片"
            name="notice_image"
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
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
