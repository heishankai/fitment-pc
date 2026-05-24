import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Modal, Form, Select, message, Divider } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import {
  EnvironmentOutlined,
  HomeOutlined,
  UserOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { getAllCraftsmanUsersService, assignOrderService } from '../service';

const AssignOrderModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [record, setRecord] = useState<any>(null);
  const [form] = Form.useForm();

  // 获取所有工匠用户
  const { data: craftsmanUsersData, loading: craftsmanUsersLoading } =
    useRequest(getAllCraftsmanUsersService, {
      ready: visible, // 只在弹窗打开时请求
    });

  // 指派订单
  const { run: assignOrder, loading: assignLoading } = useRequest(
    assignOrderService,
    {
      manual: true,
      onSuccess: () => {
        message.success('指派成功');
        setFalse();
        form.resetFields();
        // 触发父组件刷新列表
        props.onSuccess?.();
      },
      onError: (error: any) => {
        message.error(error?.message || '指派失败');
      },
    },
  );

  // 打开弹窗方法
  const handleOpenModal = (record: any) => {
    setRecord(record);
    setTrue();
  };

  // 关闭弹窗
  const handleCancel = () => {
    setFalse();
    form.resetFields();
    setRecord(null);
  };

  // 提交指派
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await assignOrder({
        orderId: record.id,
        craftsmanUserId: values.craftsmanUserId,
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  // 工匠选项
  const craftsmanOptions =
    craftsmanUsersData?.data?.map((craftsman: any) => ({
      label: `${craftsman.nickname || '未设置昵称'} (${craftsman.phone})`,
      value: craftsman.id,
      craftsman,
    })) || [];

  const wechatUser = record?.wechat_user;
  const addressInfo =
    record?.address || record?.detailAddress || record?.address_detail || '';
  const fullAddress = [
    record?.province,
    record?.city,
    record?.district,
    addressInfo,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Modal
      title={
        <span>
          <UserAddOutlined style={{ marginRight: 8 }} />
          指派订单给工匠
        </span>
      }
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={assignLoading}
      width={800}
      destroyOnClose
    >
      {record && (
        <div>
          {/* 订单信息 */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                marginBottom: 12,
                fontSize: 16,
                fontWeight: 600,
                color: '#1890ff',
              }}
            >
              <HomeOutlined style={{ marginRight: 8 }} />
              订单信息
            </div>
            <ProDescriptions
              column={2}
              size="small"
              dataSource={record}
              columns={[
                {
                  title: '订单ID',
                  dataIndex: 'id',
                  copyable: true,
                },
                {
                  title: '工种',
                  dataIndex: 'work_kind_name',
                },
                {
                  title: '城市',
                  dataIndex: 'city',
                },
                {
                  title: '面积',
                  dataIndex: 'area',
                },
                {
                  title: '房屋类型',
                  dataIndex: 'houseType',
                  valueEnum: {
                    new: { text: '新房', status: 'Success' },
                    old: { text: '老房', status: 'Default' },
                  },
                },
                {
                  title: '户型',
                  dataIndex: 'roomType',
                },
                {
                  title: '创建时间',
                  dataIndex: 'createdAt',
                  valueType: 'dateTime',
                  proFieldProps: {
                    format: 'YYYY-MM-DD HH:mm:ss',
                  },
                  span: 2,
                },
              ]}
            />
          </div>

          {/* 用户信息及地址 */}
          {wechatUser && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#1890ff',
                }}
              >
                <UserOutlined style={{ marginRight: 8 }} />
                业主信息
              </div>
              <ProDescriptions
                column={2}
                size="small"
                dataSource={wechatUser}
                columns={[
                  {
                    title: '昵称',
                    dataIndex: 'nickname',
                  },
                  {
                    title: '手机号',
                    dataIndex: 'phone',
                    copyable: true,
                  },
                  {
                    title: '城市',
                    dataIndex: 'city',
                    render: () => record?.city || '-',
                  },
                  {
                    title: '详细地址',
                    dataIndex: 'address',
                    span: 2,
                    render: (_: any, entity: any) => {
                      const userAddress = [
                        record?.province || entity?.province,
                        record?.city || entity?.city,
                        record?.district || entity?.district,
                        entity?.address ||
                          entity?.detailAddress ||
                          entity?.address_detail ||
                          addressInfo,
                      ]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <span>
                          <EnvironmentOutlined
                            style={{ marginRight: 4, color: '#ff4d4f' }}
                          />
                          {userAddress || '未填写地址'}
                        </span>
                      );
                    },
                  },
                ]}
              />
            </div>
          )}

          {/* 如果没有用户信息，但订单有地址信息 */}
          {!wechatUser && fullAddress && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#1890ff',
                }}
              >
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                详细地址
              </div>
              <div
                style={{
                  padding: 12,
                  background: '#f5f5f5',
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                }}
              >
                <EnvironmentOutlined
                  style={{ marginRight: 4, color: '#ff4d4f' }}
                />
                {fullAddress}
              </div>
            </div>
          )}

          <Divider />

          {/* 选择工匠 */}
          <Form form={form} layout="vertical" initialValues={{}}>
            <Form.Item
              label="选择工匠"
              name="craftsmanUserId"
              rules={[{ required: true, message: '请选择工匠' }]}
            >
              <Select
                showSearch
                placeholder="请搜索工匠手机号"
                loading={craftsmanUsersLoading}
                allowClear
                filterOption={(input, option) => {
                  // 基于 label 中的手机号进行筛选
                  const label = (option?.label as string) || '';
                  // 提取手机号部分进行匹配
                  const phoneMatch = label.match(/\(([^)]+)\)/);
                  if (phoneMatch && phoneMatch[1]) {
                    return phoneMatch[1].includes(input);
                  }
                  return false;
                }}
                options={craftsmanOptions}
                optionRender={(option) => {
                  const craftsman = option.data.craftsman;
                  return (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 500, marginBottom: 6 }}>
                        {craftsman.nickname || '未设置昵称'}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#8c8c8c',
                          lineHeight: '20px',
                        }}
                      >
                        <div>
                          {craftsman.city || '未设置城市'} |{' '}
                          {craftsman.phone || '未设置手机号'}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          {craftsman.skillInfo?.work_kind_name ||
                            '未进行技能认证'}
                        </div>
                      </div>
                    </div>
                  );
                }}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default forwardRef(AssignOrderModal);
