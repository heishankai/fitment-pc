import React, { forwardRef, useImperativeHandle } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Form, Row, Col, message } from 'antd';
// service
import {
  getAllCraftsmanUsersService,
  createOrderService,
  getAllWechatUsersService,
} from '../service';

const AddOrderModal = (props: any, ref: any) => {
  const [form] = Form.useForm();
  const [visible, { setTrue, setFalse }] = useBoolean(false);

  // 获取所有工匠用户
  const {
    data: craftsmanUsersData,
    loading: craftsmanUsersLoading,
    run: getCraftsmanUsersRun,
  } = useRequest(getAllCraftsmanUsersService, {
    manual: true,
  });

  // 获取所有微信用户
  const {
    data: wechatUsersData,
    loading: wechatUsersLoading,
    run: getWechatUsersRun,
  } = useRequest(getAllWechatUsersService, {
    manual: true,
  });

  // 打开弹框方法
  const handleOpenModal = () => {
    setTrue();
    getCraftsmanUsersRun();
    getWechatUsersRun();
  };

  // 提交方法
  const handleFinish = async (values: any) => {
    const { success } = await createOrderService(values);
    if (success) {
      message.success('创建订单成功');
      setFalse();
      props?.actionRef?.current?.reload();
    }
  };

  // 暴露子组件方法 和数据
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });
  return (
    <DrawerForm
      open={visible}
      title="新增订单"
      form={form}
      width="85%"
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      drawerProps={{
        onClose: setFalse,
        destroyOnClose: true,
        maskClosable: false,
      }}
      onFinish={handleFinish}
    >
      <Row>
        <Col span={12}>
          <ProFormDigit
            label="平米数"
            name="area"
            rules={[{ required: true }]}
            fieldProps={{
              addonAfter: '㎡',
              precision: 0,
              min: 0,
            }}
          />
        </Col>

        <Col span={12}>
          <ProFormSelect
            label="房屋类型"
            name="houseType"
            rules={[{ required: true }]}
            fieldProps={{
              options: [
                { label: '新房', value: 'new' },
                { label: '老房', value: 'old' },
              ],
            }}
          />
        </Col>

        <Col span={12}>
          <ProFormSelect
            label="房屋类型"
            name="roomType"
            rules={[{ required: true }]}
            fieldProps={{
              options: [
                { label: '1居室', value: '1居室' },
                { label: '2居室', value: '2居室' },
                { label: '3居室', value: '3居室' },
                { label: '4居室', value: '4居室' },
                { label: '复式', value: '复式' },
                { label: '别墅', value: '别墅' },
              ],
            }}
          />
        </Col>

        <Col span={12}>
          <ProFormText
            label="详细地址"
            name="location"
            rules={[{ required: true }]}
            fieldProps={{
              maxLength: 200,
            }}
          />
        </Col>

        <Col span={12}>
          <ProFormSelect
            label="选择工匠"
            name="craftsman_user_id"
            rules={[{ required: true, message: '请选择工匠' }]}
            showSearch
            placeholder="请输入工匠手机号"
            fieldProps={{
              loading: craftsmanUsersLoading,
              allowClear: true,
              filterOption: (input, option: any) => {
                // 基于 label 中的手机号进行筛选
                const label = (option?.label as string) || '';
                // 提取手机号部分进行匹配
                const phoneMatch = label.match(/\(([^)]+)\)/);
                if (phoneMatch && phoneMatch[1]) {
                  return phoneMatch[1].includes(input);
                }
                return false;
              },
              optionRender: (option: any) => {
                const craftsman = option?.data?.data ?? {};

                return (
                  <div className="craftsman-option">
                    <strong>{craftsman?.nickname || '未设置昵称'}</strong>
                    <div>
                      <div>
                        {craftsman?.city || '未设置城市'} |{' '}
                        {craftsman?.phone || '未设置手机号'}
                      </div>
                      <div>
                        {craftsman?.skillInfo?.workKindName || '未进行技能认证'}
                      </div>
                    </div>
                  </div>
                );
              },
            }}
            options={(craftsmanUsersData?.data ?? []).map((craftsman: any) => ({
              label: `${craftsman.nickname || '未设置昵称'} (${craftsman.phone})`,
              value: craftsman.id,
              data: craftsman,
            }))}
          />
        </Col>

        <Col span={12}>
          <ProFormSelect
            label="选择微信用户"
            name="wechat_user_id"
            rules={[{ required: true }]}
            showSearch
            placeholder="请输入微信用户手机号"
            fieldProps={{
              loading: wechatUsersLoading,
              filterOption: false,
              fieldNames: { label: 'label', value: 'value' },
              options: (wechatUsersData?.data ?? []).map((wechatUser: any) => ({
                label: `${wechatUser.nickname}-${wechatUser.phone}`,
                value: wechatUser.id,
              })),
            }}
          />
        </Col>
      </Row>
    </DrawerForm>
  );
};

export default forwardRef(AddOrderModal);
