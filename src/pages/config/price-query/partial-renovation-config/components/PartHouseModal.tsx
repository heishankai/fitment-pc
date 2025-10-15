import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { Form, Row, Col, Card, message } from 'antd';
import {
  DrawerForm,
  ProFormList,
  ProFormText,
  ProFormUploadButton,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useBoolean } from 'ahooks';
import type { DrawerTitleType } from '@/types';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../../utils';
import {
  createPartialRenovationConfigService,
  editPartialRenovationConfigService,
} from '../service';

const { useWatch } = Form;

const PartHouseModal = (props: any, ref: any) => {
  const { tableFormRef } = props ?? {};

  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<DrawerTitleType>('add');
  const [record, setRecord] = useState<any>(null);

  const categoryName = useWatch('category_name', form);

  // 打开弹框方法
  const handleOpenModal = (modalTitle: DrawerTitleType, row?: any) => {
    if (modalTitle === 'edit') {
      transformEditData(row, form);
    }
    setRecord(row);
    setTitle(modalTitle);
    setTrue();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    console.log(values, 'values');
    console.log(transformAddData(values), 'transformed values');

    const partialRenovationConfigService =
      title === 'add'
        ? createPartialRenovationConfigService
        : editPartialRenovationConfigService;

    const { success } = await partialRenovationConfigService(
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
      title={`${title === 'add' ? '新增' : '编辑'}局部改造配置`}
      form={form}
      width="100%"
      layout="horizontal"
      labelCol={{ span: 7 }}
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
        <Col span={8}>
          <ProFormText
            label="分类名称"
            name="category_name"
            rules={[{ required: true, message: '请输入分类名称' }]}
            fieldProps={{
              placeholder: '如：卫生间改造、厨房改造等',
            }}
          />
        </Col>
      </Row>
      <ProFormList
        name="work_configs"
        label=""
        wrapperCol={{ span: 24 }}
        min={1}
        initialValue={[{}]}
        itemRender={({ listDom, action }, { index }) => {
          return (
            <Card
              hoverable
              extra={action}
              title={`${categoryName ? categoryName + ' - ' : '分类名称'}${index + 1}`}
              style={{ marginBlockEnd: 8 }}
            >
              {listDom}
            </Card>
          );
        }}
      >
        {/* 基本信息 */}
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              label="工种标题"
              name="work_title"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              rules={[{ required: true, message: '请输入工种标题' }]}
              fieldProps={{
                maxLength: 50,
                showCount: true,
                placeholder: '如：局部改造工长服务）',
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormDigit
              label="价格"
              name="price"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              rules={[{ required: true, message: '请输入价格' }]}
              fieldProps={{
                addonAfter: '元',
                precision: 2,
                min: 0,
                placeholder: '请输入价格',
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
              rules={[{ required: true, message: '请输入计价说明' }]}
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
              rules={[{ required: true, message: '请输入服务范围' }]}
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
              label="展示图片"
              name="display_images"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              rules={[{ required: true, message: '请上传展示图片' }]}
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
      </ProFormList>
    </DrawerForm>
  );
};

export default forwardRef(PartHouseModal);
