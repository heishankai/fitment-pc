import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Form, Col, Row } from 'antd';

const OperateModal = (props: any, ref: any) => {
  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');

  // 打开弹框方法
  const handleOpenModal = (modalTitle: 'add' | 'edit') => {
    setTitle(modalTitle);
    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    console.log(values);
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
      title={`${title === 'add' ? '新增' : '编辑'}`}
      form={form}
      width="60%"
      layout="horizontal"
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      modalProps={{ onCancel: setFalse, destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{}}
    >
      <Row>
        <Col span={12}>
          <ProFormText
            label="供应商"
            name="activityName"
            rules={[{ required: true }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
