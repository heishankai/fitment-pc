import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ProFormDigit,
  ModalForm,
} from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { BASE_URL } from '@/utils/request';
import { extractImageUrl, handleImageForm } from '@/utils';
import { createWelcomeService, editWelcomeService } from '../service';

interface OperateModalProps {
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}

const OperateModal = (props: OperateModalProps, ref: any) => {
  const { actionRef } = props ?? {};

  const [form] = Form.useForm();
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');
  const [record, setRecord] = useState<any>(null);

  // 打开弹框方法
  const handleOpenModal = (modalTitle: 'add' | 'edit', recordData?: any) => {
    setTitle(modalTitle);
    setRecord(recordData);

    if (modalTitle === 'edit' && recordData) {
      form.setFieldsValue({
        logo: recordData.logo ? handleImageForm([recordData.logo]) : [],
        background_image: recordData.background_image
          ? handleImageForm([recordData.background_image])
          : [],
        title: recordData.title || '',
        subtitle: recordData.subtitle || '',
        count_down: recordData.count_down || '',
        copyright: recordData.copyright || '',
      });
    } else {
      form.resetFields();
    }

    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    try {
      const logoUrl = extractImageUrl(values.logo)?.[0];
      const backgroundImageUrl = extractImageUrl(values.background_image)?.[0];

      if (!logoUrl) {
        message.error('请上传Logo');
        return false;
      }

      if (!backgroundImageUrl) {
        message.error('请上传背景图片');
        return false;
      }

      const welcomeService =
        title === 'add' ? createWelcomeService : editWelcomeService;
      const { success } = await welcomeService(record?.id, {
        logo: logoUrl,
        background_image: backgroundImageUrl,
        title: values.title || '',
        subtitle: values.subtitle || '',
        count_down:
          values.count_down !== undefined && values.count_down !== null
            ? values.count_down
            : '',
        copyright: values.copyright || '',
      });

      if (!success) return false;

      message.success('操作成功');
      setFalse();
      if (actionRef?.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error: any) {
      message.error(error?.message || '操作失败');
      return false;
    }
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  return (
    <ModalForm
      open={visible}
      title={`${title === 'add' ? '新增' : '编辑'}欢迎页配置`}
      form={form}
      width={600}
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
      <ProFormUploadButton
        name="logo"
        label="Logo"
        max={1}
        rules={[{ required: true, message: '请上传Logo' }]}
        fieldProps={{
          listType: 'picture-card',
          accept: 'image/*',
          action: `${BASE_URL}/upload`,
        }}
      />

      <ProFormUploadButton
        name="background_image"
        label="背景图片"
        max={1}
        rules={[{ required: true, message: '请上传背景图片' }]}
        fieldProps={{
          listType: 'picture-card',
          accept: 'image/*',
          action: `${BASE_URL}/upload`,
        }}
      />

      <ProFormText
        name="title"
        label="标题"
        placeholder="请输入标题"
        fieldProps={{
          maxLength: 100,
          showCount: true,
        }}
      />

      <ProFormText
        name="subtitle"
        label="副标题"
        placeholder="请输入副标题"
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
      />

      <ProFormDigit
        name="count_down"
        label="倒计时"
        placeholder="请输入倒计时（秒）"
        fieldProps={{
          min: 0,
          precision: 0,
        }}
        extra="倒计时时间，单位为秒"
      />

      <ProFormText
        name="copyright"
        label="版权信息"
        placeholder="请输入版权信息"
        fieldProps={{
          maxLength: 200,
          showCount: true,
        }}
      />
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
