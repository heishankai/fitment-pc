import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import styled from 'styled-components';
import { Drawer, Space, Button, Popconfirm, Divider, message } from 'antd';
import { ProTable, ProDescriptions } from '@ant-design/pro-components';
// services
import {
  getOrderByIdService,
  payPriceItemService,
  payPlatformServiceFeeService,
} from '../service';
import { PayCircleOutlined, UserOutlined } from '@ant-design/icons';
import BatchAssignCraftsmanModal from './BatchAssignCraftsmanModal';

const DrawerBody = styled(Drawer)`
  .ant-drawer-body {
    padding: 12px;
  }
`;

const WorkPriceModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [rowData, setRowData] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 分配工匠弹窗
  const [
    assignModalVisible,
    { setTrue: setAssignModalTrue, setFalse: setAssignModalFalse },
  ] = useBoolean(false);

  const {
    data: workPriceData,
    loading: workPriceLoading,
    run: getWorkPriceRun,
    refresh: workPriceRefresh,
  } = useRequest(getOrderByIdService, { manual: true });

  const { order_type, parent_work_price_groups, total_service_fee_is_paid } =
    workPriceData?.data ?? {};

  // 打开弹窗方法
  const handleOpenModal = (rowData: any) => {
    setTrue();
    setSelectedRowKeys([]);
    setRowData(rowData);
    getWorkPriceRun(rowData?.id);
  };

  // 支付单个工价
  const handleWorkPricePay = async (record: any) => {
    const { id } = record ?? {};
    const { success } = await payPriceItemService(id);

    if (success) {
      message.success('确认完成');
      workPriceRefresh();
    }
  };

  // 打开分配工匠弹窗
  const handleOpenAssignModal = () => {
    if (!selectedRowKeys?.length) {
      message.warning('请先选择要分配的行');
      return;
    }
    setAssignModalTrue();
  };

  // 批量分配工匠成功回调
  const handleAssignSuccess = () => {
    setSelectedRowKeys([]);
    workPriceRefresh();
  };

  // 支付平台服务费
  const handlePlatformServiceFeePay = async (record: any) => {
    const { id } = record ?? {};

    const { success } = await payPlatformServiceFeeService(id);

    if (success) {
      message.success('确认完成');
      workPriceRefresh();
    }
  };

  // 计算最终总价（工价合计 + 工长工费 + 平台服务费）
  const calculateFinalTotal = (orderInfo: any): number => {
    // 工价合计
    const totalPrice = parseFloat(String(orderInfo?.total_price || 0)) || 0;
    // 工长工费
    const gangmasterCost =
      parseFloat(String(orderInfo?.gangmaster_cost || 0)) || 0;
    // 平台服务费
    const platformServiceFee =
      parseFloat(String(orderInfo?.total_service_fee || 0)) || 0;

    return totalPrice + gangmasterCost + platformServiceFee;
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  return (
    <>
      <DrawerBody
        title="工价详情"
        open={visible}
        onClose={setFalse}
        width="100%"
        maskClosable={false}
        style={{ padding: 0 }}
        loading={workPriceLoading}
      >
        <Divider orientation="left">工价汇总</Divider>
        <ProDescriptions
          bordered
          column={3}
          dataSource={{
            ...workPriceData?.data,
            calculateFinalTotal: calculateFinalTotal(workPriceData?.data),
          }}
          columns={[
            {
              title: '订单类型',
              dataIndex: 'order_type',
              valueEnum: {
                gangmaster: { text: '工长单' },
                craftsman: { text: '工匠单' },
              },
            },
            {
              title: '是否全部支付',
              dataIndex: 'is_paid',
              valueEnum: {
                true: { text: '是', status: 'Success' },
                false: { text: '否', status: 'Processing' },
              },
            },
            {
              title: '是否全部验收',
              dataIndex: 'total_is_accepted',
              valueEnum: {
                true: { text: '是', status: 'Success' },
                false: { text: '否', status: 'Processing' },
              },
            },
            {
              title: '工价总费用',
              dataIndex: 'total_price',
              valueType: 'money',
            },
            {
              title: '工长工费',
              dataIndex: 'gangmaster_cost',
              valueType: 'money',
              hideInTable: order_type !== 'gangmaster',
            },
            {
              title: '平台服务费',
              dataIndex: 'total_service_fee',
              valueType: 'money',
            },
            {
              title: '平台服务费是否支付',
              dataIndex: 'total_service_fee_is_paid',
              render: (_: any, record: any) => {
                if (total_service_fee_is_paid) {
                  return <span style={{ color: '#52c41a' }}>是</span>;
                }
                return (
                  <Popconfirm
                    title="确认支付"
                    description={`确定已收到款项吗？`}
                    onConfirm={() => handlePlatformServiceFeePay(record)}
                  >
                    <Button
                      type="primary"
                      icon={<PayCircleOutlined />}
                      size="small"
                    >
                      支付平台服务费
                    </Button>
                  </Popconfirm>
                );
              },
            },
            {
              title: '总计',
              dataIndex: 'calculateFinalTotal',
              valueType: 'money',
            },
          ]}
        />
        <Divider orientation="left">工价列表</Divider>
        <ProTable
          rowKey="id"
          pagination={false}
          scroll={{ x: 900 }}
          search={false}
          options={false}
          headerTitle={false}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => {
              setSelectedRowKeys(keys);
            },
          }}
          toolBarRender={() => [
            <Button
              key="assign"
              type="primary"
              icon={<UserOutlined />}
              onClick={handleOpenAssignModal}
              disabled={selectedRowKeys?.length === 0}
            >
              分配工匠
            </Button>,
          ]}
          dataSource={parent_work_price_groups ?? []}
          columns={[
            {
              title: '工价标题',
              dataIndex: 'work_title',
              width: 120,
              ellipsis: true,
            },
            {
              title: '工价单价',
              dataIndex: 'work_price',
              width: 120,
              ellipsis: true,
              valueType: 'money',
            },
            {
              title: '工价数量',
              dataIndex: 'quantity',
              width: 120,
              ellipsis: true,
            },
            {
              title: '工种名称',
              dataIndex: 'work_kind_name',
              width: 120,
              ellipsis: true,
            },
            {
              title: '单位名称',
              dataIndex: 'labour_cost_name',
              width: 120,
              ellipsis: true,
            },
            {
              title: '是否设置最低价格',
              dataIndex: 'is_set_minimum_price',
              width: 150,
              valueEnum: {
                '1': { text: '是' },
                '0': { text: '否' },
              },
            },
            {
              title: '最低价格',
              dataIndex: 'minimum_price',
              width: 120,
              ellipsis: true,
              valueType: 'money',
            },
            {
              title: '结算金额',
              dataIndex: 'settlement_amount',
              width: 120,
              ellipsis: true,
              valueType: 'money',
            },
            {
              title: '是否验收',
              dataIndex: 'is_accepted',
              width: 100,
              valueEnum: {
                true: { text: '已验收', status: 'Success' },
                false: { text: '未验收', status: 'Processing' },
              },
            },
            {
              title: '是否支付',
              dataIndex: 'is_paid',
              width: 100,
              fixed: 'right',
              valueEnum: {
                true: { text: '已支付', status: 'Success' },
                false: { text: '未支付', status: 'Processing' },
              },
            },
            {
              title: '当前工匠id',
              dataIndex: 'assigned_craftsman_id',
              width: 100,
              fixed: 'right',
            },
            {
              title: '操作',
              valueType: 'option',
              width: 150,
              fixed: 'right',
              align: 'left',
              render: (_: any, record: any) => {
                return (
                  <Space>
                    <Popconfirm
                      title="确认支付"
                      description={`确定已收到款项吗？`}
                      onConfirm={() => handleWorkPricePay(record)}
                    >
                      <Button
                        type="primary"
                        icon={<PayCircleOutlined />}
                        size="small"
                        disabled={record?.is_paid}
                      >
                        支付工费
                      </Button>
                    </Popconfirm>
                  </Space>
                );
              },
            },
          ]}
        />
      </DrawerBody>
      {/* 分配工匠弹窗 */}
      <BatchAssignCraftsmanModal
        visible={assignModalVisible}
        onCancel={setAssignModalFalse}
        onSuccess={handleAssignSuccess}
        parentOrderId={rowData?.id}
        selectedWorkPriceIds={selectedRowKeys?.map((key: any) => Number(key))}
      />
    </>
  );
};

export default forwardRef(WorkPriceModal);
