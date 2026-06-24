import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Form, message, Row, Col, Divider } from 'antd';
import {
  ProFormText,
  ProFormUploadButton,
  ProFormDigit,
  ProFormTextArea,
  DrawerForm,
  ProFormList,
  ProFormSelect,
  ProFormRadio,
} from '@ant-design/pro-components';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';
// servicea
import {
  createWorkTypeService,
  editWorkTypeService,
  getAllWorkKindService,
  getAllLabourCostsService,
} from '../service';

const OperateModal = (props: any, ref: any) => {
  const { actionRef } = props ?? {};

  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');
  const [record, setRecord] = useState<any>(null);
  const is_set_minimum_price = Form.useWatch('is_set_minimum_price', form);

  const { data: workKindOptions, loading: workKindLoading } = useRequest(
    getAllWorkKindService,
  );

  const { data: labourCostOptions, loading: labourCostLoading } = useRequest(
    getAllLabourCostsService,
  );

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
    const workTypeService =
      title === 'add' ? createWorkTypeService : editWorkTypeService;

    const { success } = await workTypeService(
      record?.id,
      transformAddData(values),
    );

    if (!success) return;

    message.success('操作成功');
    setFalse();
    actionRef?.current?.reload();
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
      title={`${title === 'add' ? '新增' : '编辑'}工价`}
      form={form}
      width="100%"
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      drawerProps={{
        onClose: setFalse,
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={handleFinish}
      initialValues={{ sort: 0 }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <ProFormSelect
            label="工种"
            name="work_kind"
            rules={[{ required: true }]}
            fieldProps={{
              labelInValue: true,
              showSearch: true,
              loading: workKindLoading,
              fieldNames: { label: 'work_kind_name', value: 'work_kind_code' },
            }}
            options={workKindOptions?.data ?? []}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="工价名称"
            name="work_title"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 50,
              showCount: true,
              placeholder: '如：工长、水电工、木工、油漆工等',
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormSelect
            label="单位"
            name="labour_cost"
            rules={[{ required: true }]}
            fieldProps={{
              showSearch: true,
              labelInValue: true,
              loading: labourCostLoading,
              fieldNames: { label: 'labour_cost_name', value: 'id' },
            }}
            options={labourCostOptions?.data ?? []}
          />
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="价格"
            name="work_price"
            rules={[{ required: true }]}
            fieldProps={{
              addonAfter: '元',
              precision: 2,
              min: 0,
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="排序"
            name="sort"
            fieldProps={{
              min: 0,
              precision: 0,
              placeholder: '值越大越靠前，不填默认为0',
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormText
            label="编码"
            name="code"
            fieldProps={{
              maxLength: 20,
              showCount: true,
              placeholder: '唯一标识，不可重复',
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormRadio.Group
            label="是否设置最低价"
            name="is_set_minimum_price"
            fieldProps={{
              defaultValue: '0',
              options: [
                { label: '是', value: '1' },
                { label: '否', value: '0' },
              ],
              onChange: () => form.setFieldsValue({ minimum_price: undefined }),
            }}
          />
        </Col>
        {is_set_minimum_price === '1' && (
          <Col span={8}>
            <ProFormDigit
              label="最低价格"
              name="minimum_price"
              rules={[{ required: true }]}
              fieldProps={{ addonAfter: '元' }}
            />
          </Col>
        )}
      </Row>

      {/* 文本说明 */}
      <Row gutter={16}>
        <Col span={8}>
          <ProFormTextArea
            label="计价说明"
            name="pricing_description"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 800,
              showCount: true,
              rows: 5,
              style: { resize: 'none' },
              placeholder: '请输入计价说明（800字以内）',
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormTextArea
            label="服务范围"
            name="service_scope"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 800,
              showCount: true,
              rows: 5,
              style: { resize: 'none' },
              placeholder: '请输入服务范围（800字以内）',
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormTextArea
            label="工价描述"
            name="description"
            // rules={[{ required: true }]}
            fieldProps={{
              maxLength: 50,
              showCount: true,
              placeholder:
                '例如：采用标准施工工艺，确保墙面平整光滑。适用于新房装修或旧房墙面翻新，包含基础的墙面处理和标准的底漆面漆涂刷',
              rows: 5,
              style: { resize: 'none' },
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
      </Row>
      <Divider orientation="left">验收标准</Divider>
      <Row>
        <Col span={24}>
          <ProFormList
            label=""
            name="service_details"
            wrapperCol={{ span: 24 }}
            min={1}
            initialValue={[{}]}
            itemRender={({ listDom, action }) => (
              <Row style={{ marginBlockEnd: 8 }}>
                <Col span={23}>{listDom}</Col>
                <Col span={1}>{action}</Col>
              </Row>
            )}
          >
            <Row gutter={16}>
              <Col span={8}>
                <ProFormTextArea
                  label="验收说明"
                  name="service_desc"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  fieldProps={{
                    maxLength: 800,
                    showCount: true,
                    rows: 5,
                    style: { resize: 'none' },
                  }}
                />
              </Col>
              <Col span={8}>
                <ProFormUploadButton
                  label="验收照片"
                  name="service_image"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
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
              </Col>
            </Row>
          </ProFormList>
        </Col>
      </Row>
    </DrawerForm>
  );
};

export default forwardRef(OperateModal);
