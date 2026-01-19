import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Upload } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ModalForm,
} from '@ant-design/pro-components';
import type { ActionType } from '@ant-design/pro-components';
import { BASE_URL } from '@/utils/request';
import { extractImageUrl, composeImageWithText } from '@/utils';
import { createSwiperService, editSwiperService } from '../service';

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
        title: recordData.title || '',
        description: recordData.description || '',
        image: recordData.swiper_image
          ? [{ url: recordData.swiper_image }]
          : [],
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
        message.error('请上传轮播图');
        return false;
      }

      const swiperService =
        title === 'add' ? createSwiperService : editSwiperService;
      const { success } = await swiperService(record?.id, {
        swiper_image: imageUrl,
        title: values.title,
        description: values.description,
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
      title={`${title === 'add' ? '新增' : '编辑'}轮播图`}
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
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
        placeholder="图片左下角标题"
        fieldProps={{
          maxLength: 50,
          showCount: true,
        }}
      />

      <ProFormText
        name="description"
        label="描述"
        placeholder="图片左下角描述"
        fieldProps={{
          maxLength: 100,
          showCount: true,
        }}
      />

      <ProFormUploadButton
        name="image"
        label="轮播图"
        max={1}
        rules={[{ required: true, message: '请上传轮播图' }]}
        fieldProps={{
          listType: 'picture-card',
          accept: 'image/*',
          action: `${BASE_URL}/upload`,
          beforeUpload: async (file) => {
            const titleValue = form.getFieldValue('title');
            const descValue = form.getFieldValue('description') || '';

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
    </ModalForm>
  );
};

export default forwardRef(OperateModal);
