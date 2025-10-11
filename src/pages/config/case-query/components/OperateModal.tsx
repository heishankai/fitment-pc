import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
} from 'react';
import { useBoolean } from 'ahooks';
import { Form, Col, Row, Divider, message } from 'antd';
import {
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormUploadButton,
  DrawerForm,
} from '@ant-design/pro-components';
// utils
import { BASE_URL } from '@/utils/request';
import { transformAddData, transformEditData } from '../utils';
import { createCaseService, editCaseService } from '../service';
// components
import { CitySelect } from '@/components';

const { useWatch } = Form;

const OperateModal = (props: any, ref: any) => {
  const { tableFormRef } = props ?? {};
  const [form] = Form.useForm();
  const [visble, { setTrue, setFalse }] = useBoolean(false);
  const [title, setTitle] = useState<'add' | 'edit'>('add');
  const [record, setRecord] = useState<any>(null);
  const construction_cost = useWatch('construction_cost', form);
  const auxiliary_material_cost = useWatch('auxiliary_material_cost', form);

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
    const caseService = title === 'add' ? createCaseService : editCaseService;

    const { success } = await caseService(record?.id, transformAddData(values));

    if (!success) return;

    message.success('操作成功');
    setFalse();
    tableFormRef?.current?.submit();
  };

  // 房屋总费用
  const house_total_cost = useMemo(() => {
    if (!construction_cost || !auxiliary_material_cost) return 0;
    return Number(construction_cost) + Number(auxiliary_material_cost);
  }, [construction_cost, auxiliary_material_cost]);

  // 暴露子组件方法 和数据
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });
  return (
    <DrawerForm
      open={visble}
      title={`${title === 'add' ? '新增' : '编辑'}装修案例`}
      form={form}
      width="80%"
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
      <Divider orientation="left">基本信息</Divider>
      <Row>
        <Col span={8}>
          <ProFormText
            label="小区名称"
            name="housing_name"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 20,
              showCount: true,
            }}
          />
        </Col>
        <Col span={8}>
          <ProFormRadio.Group
            label="改造类型"
            name="remodel_type"
            rules={[{ required: true }]}
            fieldProps={{
              options: [
                {
                  label: '新房装修',
                  value: 1,
                },
                {
                  label: '旧房改造',
                  value: 2,
                },
              ],
            }}
          />
        </Col>
        <Col span={8}>
          <Form.Item label="城市" name="city" rules={[{ required: true }]}>
            <CitySelect labelInValue />
          </Form.Item>
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="平米数"
            name="square_number"
            rules={[{ required: true }]}
            fieldProps={{ addonAfter: '㎡' }}
          />
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="施工费用"
            name="construction_cost"
            rules={[{ required: true }]}
            fieldProps={{ addonAfter: '元' }}
          />
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="辅材费用"
            name="auxiliary_material_cost"
            rules={[{ required: true }]}
            fieldProps={{ addonAfter: '元' }}
          />
        </Col>
        <Col span={8}>
          <ProFormDigit
            label="房屋总费用"
            name="house_total_cost"
            value={house_total_cost}
            fieldProps={{
              disabled: true,
              placeholder: '根据辅材费+和施工费用计算',
              addonAfter: '元',
            }}
          />
        </Col>
      </Row>
      <Divider orientation="left">施工现场图</Divider>
      <Row>
        <Col span={24}>
          <ProFormUploadButton
            label="施工现场图"
            name="construction_image"
            rules={[{ required: true }]}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
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
      <Divider orientation="left">施工完工图</Divider>
      <Row>
        <Col span={12}>
          <ProFormUploadButton
            label="客厅及走廊"
            name="drawingroom_image"
            rules={[{ required: true }]}
            max={4}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传4张"
          />
        </Col>
        <Col span={12}>
          <ProFormUploadButton
            label="阳台"
            name="balcony_image"
            rules={[{ required: true }]}
            max={2}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传2张"
          />
        </Col>
        <Col span={12}>
          <ProFormUploadButton
            label="主卧"
            name="master_bedroom_image"
            rules={[{ required: true }]}
            max={2}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传2张"
          />
        </Col>
        <Col span={12}>
          <ProFormUploadButton
            label="次卧"
            name="secondary_bedroom_image"
            rules={[{ required: true }]}
            max={3}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传3张"
          />
        </Col>
        <Col span={12}>
          <ProFormUploadButton
            label="卫生间"
            name="bathroom_image"
            rules={[{ required: true }]}
            max={2}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              action: `${BASE_URL}/upload`,
              accept: 'image/*',
            }}
            extra="最多上传2张"
          />
        </Col>
      </Row>
    </DrawerForm>
  );
};

export default forwardRef(OperateModal);
