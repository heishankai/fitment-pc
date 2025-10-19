import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ModalForm,
} from '@ant-design/pro-components';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';
// servicea
import { createCategoryService, editCategoryService } from '../service';

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
    const categoryService =
      title === 'add' ? createCategoryService : editCategoryService;

    const { success } = await categoryService(
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
      title={`${title === 'add' ? '新增' : '编辑'}类目`}
      form={form}
      width="50%"
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      modalProps={{
        onCancel: setFalse,
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={handleFinish}
    >
      <ProFormText
        label="类目名称"
        name="category_name"
        rules={[{ required: true }]}
        fieldProps={{
          maxLength: 20,
          showCount: true,
        }}
      />
      <ProFormUploadButton
        label="类目图片"
        name="category_image"
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
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
