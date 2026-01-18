import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Upload } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ProFormTextArea,
  ModalForm,
} from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { BASE_URL } from '@/utils/request';
import {
  extractImageUrl,
  handleImageForm,
  composeImageWithText,
} from '@/utils';
import { createActivityService, editActivityService } from '../service';

interface OperateModalProps {
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  onSuccess?: () => void;
}

const OperateModal = (props: OperateModalProps, ref: any) => {
  const { actionRef, onSuccess } = props ?? {};

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
        image: recordData.image ? handleImageForm([recordData.image]) : [],
        title: recordData.title || '',
        description: recordData.description || '',
        linkText: recordData.linkText || '',
        linkUrl: recordData.linkUrl || '',
      });
    } else {
      form.resetFields();
    }

    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    try {
      const imageUrl = extractImageUrl(values.image)?.[0];

      if (!imageUrl) {
        message.error('请上传活动图片');
        return false;
      }

      const activityService =
        title === 'add' ? createActivityService : editActivityService;
      const { success } = await activityService(record?.id, {
        image: imageUrl,
        title: values.title || '',
        description: values.description || '',
        linkText: values.linkText || '',
        linkUrl: values.linkUrl || '',
      });

      if (!success) return false;

      message.success('操作成功');
      setFalse();
      if (onSuccess) {
        onSuccess();
      } else if (actionRef?.current) {
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
      title={`${title === 'add' ? '新增' : '编辑'}活动`}
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
      <ProFormText
        name="image_title"
        label="图片左下角标题"
        placeholder="图片左下角标题"
        fieldProps={{
          maxLength: 200,
          showCount: true,
          onChange: () => {
            form.setFieldsValue({ image: undefined });
          },
        }}
      />

      <ProFormTextArea
        name="image_description"
        label="图片左下角描述"
        placeholder="图片左下角描述"
        fieldProps={{
          rows: 4,
          maxLength: 1000,
          showCount: true,
          onChange: () => {
            form.setFieldsValue({ image: undefined });
          },
        }}
      />

      <ProFormUploadButton
        name="image"
        label="活动图片"
        max={1}
        rules={[{ required: true, message: '请上传活动图片' }]}
        fieldProps={{
          listType: 'picture-card',
          accept: 'image/*',
          action: `${BASE_URL}/upload`,
          beforeUpload: async (file) => {
            const titleValue = form.getFieldValue('image_title');
            const descValue = form.getFieldValue('image_description') || '';

            if (!titleValue) {
              message.error('请先填写标题');
              return Upload.LIST_IGNORE;
            }

            try {
              const processedFile = await composeImageWithText(
                file,
                titleValue,
                descValue,
              );
              // 确保返回的是 File 对象
              if (processedFile instanceof File) {
                return processedFile;
              }
              message.error('图片处理失败：返回的文件格式不正确');
              return Upload.LIST_IGNORE;
            } catch (error: any) {
              console.error('图片处理错误:', error);
              message.error(error?.message || '图片处理失败');
              return Upload.LIST_IGNORE;
            }
          },
        }}
        extra="上传后会自动添加标题和描述文字到图片上"
      />

      <ProFormText
        name="title"
        label="活动标题"
        placeholder="活动标题"
        rules={[{ required: true, message: '请输入活动标题' }]}
        fieldProps={{
          maxLength: 50,
          showCount: true,
        }}
      />

      <ProFormTextArea
        name="description"
        label="活动描述"
        placeholder="活动描述"
        rules={[{ required: true, message: '请输入活动描述' }]}
        fieldProps={{
          rows: 4,
          maxLength: 1000,
          showCount: true,
        }}
      />

      <ProFormText
        name="linkText"
        label="链接按钮"
        placeholder="请输入链接按钮文本"
        rules={[{ required: true, message: '请输入链接按钮文本' }]}
        fieldProps={{
          maxLength: 100,
          showCount: true,
        }}
      />

      <ProFormText
        name="linkUrl"
        label="链接URL"
        placeholder="请输入链接URL，如：https://example.com"
        rules={[{ required: true, message: '请输入链接URL' }]}
        fieldProps={{
          maxLength: 500,
          showCount: true,
        }}
        extra="请输入小程序的页面url"
      />
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
