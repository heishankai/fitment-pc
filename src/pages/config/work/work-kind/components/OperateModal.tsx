import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message } from 'antd';
import { ProFormText, ModalForm } from '@ant-design/pro-components';
// servicea
import { createWorkKindService, editWorkKindService } from '../service';

const OperateModal = (props: any, ref: any) => {
  const { tableFormRef } = props ?? {};

  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');
  const [record, setRecord] = useState<any>(null);

  // 打开弹框方法
  const handleOpenModal = (modalTitle: 'add' | 'edit', record?: any) => {
    form.setFieldsValue({ ...record });
    setRecord(record);
    setTitle(modalTitle);
    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    const workKindService =
      title === 'add' ? createWorkKindService : editWorkKindService;

    const { success } = await workKindService(record?.id, values);

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
      title={`${title === 'add' ? '新增' : '编辑'}工种`}
      form={form}
      width="50%"
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      modalProps={{ onCancel: setFalse, destroyOnClose: true }}
      onFinish={handleFinish}
    >
      <ProFormText
        label="工种名称"
        name="work_kind_name"
        rules={[{ required: true }]}
        fieldProps={{
          maxLength: 50,
          showCount: true,
        }}
      />
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
