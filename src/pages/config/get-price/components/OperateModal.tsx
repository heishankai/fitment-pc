import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message } from 'antd';
import {
  ProFormText,
  ProFormSelect,
  DrawerForm,
} from '@ant-design/pro-components';
import { createGetPriceService, editGetPriceService } from '../service';

const OperateModal = (props: any, ref: any) => {
  const { tableFormRef } = props ?? {};

  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');
  const [record, setRecord] = useState<any>(null);

  // 打开弹框方法
  const handleOpenModal = (modalTitle: 'add' | 'edit', record?: any) => {
    if (modalTitle === 'edit') {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }

    setRecord(record);
    setTitle(modalTitle);
    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    const getPriceService =
      title === 'add' ? createGetPriceService : editGetPriceService;

    const { success } = await getPriceService(record?.id, values);

    if (!success) return;

    message.success('操作成功');
    setFalse();
    tableFormRef?.current?.submit();
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  return (
    <DrawerForm
      open={visble}
      title={`${title === 'add' ? '新增' : '编辑'}获取报价`}
      form={form}
      width={600}
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
      <ProFormText
        label="面积"
        name="area"
        rules={[{ required: true, message: '请输入面积' }]}
        placeholder="请输入面积，如：77"
      />

      <ProFormSelect
        label="房屋类型"
        name="houseType"
        rules={[{ required: true, message: '请选择房屋类型' }]}
        options={[
          { label: '新房', value: 'new' },
          { label: '老房', value: 'old' },
        ]}
        fieldProps={{
          onChange: (value) => {
            form.setFieldsValue({
              houseTypeName: value === 'new' ? '新房' : '老房',
            });
          },
        }}
      />

      <ProFormText
        label="房屋类型名称"
        name="houseTypeName"
        rules={[{ required: true, message: '请输入房屋类型名称' }]}
        placeholder="新房或老房"
        disabled
      />

      <ProFormText
        label="位置"
        name="location"
        rules={[{ required: true, message: '请输入位置' }]}
        placeholder="请输入详细地址，如：浙江省杭州市西湖区栖霞岭"
        fieldProps={{
          maxLength: 500,
          showCount: true,
        }}
      />

      <ProFormText
        label="户型"
        name="roomType"
        rules={[{ required: true, message: '请输入户型' }]}
        placeholder="请输入户型，如：3居室"
      />

      <ProFormText
        label="手机号"
        name="phone"
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
        ]}
        placeholder="请输入手机号"
      />
    </DrawerForm>
  );
};

export default forwardRef(OperateModal);
