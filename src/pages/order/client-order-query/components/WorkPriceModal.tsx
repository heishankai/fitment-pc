import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { useBoolean, useRequest } from 'ahooks';
import styled from 'styled-components';
import { Drawer, Space, Button, Popconfirm, Divider, message } from 'antd';
import { ProTable, ProDescriptions } from '@ant-design/pro-components';
// services
import {
  getOrderByIdService,
  payPriceItemService,
  payPlatformServiceFeeService,
  payGangmasterCostService,
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
  const [workPriceState, setWorkPriceState] = useState<any>(null);

  // 分配工匠弹窗
  const [
    assignModalVisible,
    { setTrue: setAssignModalTrue, setFalse: setAssignModalFalse },
  ] = useBoolean(false);

  const {
    data: workPriceData,
    loading: workPriceLoading,
    run: getWorkPriceRun,
  } = useRequest(getOrderByIdService, { manual: true });

  // 初始化或更新状态
  useEffect(() => {
    if (workPriceData?.data) {
      setWorkPriceState(workPriceData.data);
    }
  }, [workPriceData?.data]);

  const {
    order_type,
    parent_work_price_groups,
    total_service_fee_is_paid,
    gangmaster_cost_is_paid,
    is_assigned,
  } = workPriceState ?? {};

  // 打开弹窗方法
  const handleOpenModal = (rowData: any) => {
    setTrue();
    setSelectedRowKeys([]);
    setRowData(rowData);
    getWorkPriceRun(rowData?.id);
  };

  // 支付单个工价 - 只更新单条数据状态
  const handleWorkPricePay = async (record: any) => {
    const { id } = record ?? {};
    const { success } = await payPriceItemService(id);

    if (success) {
      message.success('确认完成');
      // 直接更新状态
      setWorkPriceState((prev: any) => ({
        ...prev,
        parent_work_price_groups: prev.parent_work_price_groups.map(
          (item: any) => (item.id === id ? { ...item, is_paid: true } : item),
        ),
      }));
    }
  };

  // 打开分配工匠弹窗
  const handleOpenAssignModal = () => {
    if (!selectedRowKeys?.length) {
      message.warning('请先选择要分配的工价');
      return;
    }
    setAssignModalTrue();
  };

  // 批量分配工匠成功回调
  const handleAssignSuccess = (selectedIds: any, craftsmanInfo: any) => {
    setSelectedRowKeys([]);
    // 直接更新状态，不刷新
    setWorkPriceState((prev: any) => ({
      ...prev,
      parent_work_price_groups: prev.parent_work_price_groups.map(
        (item: any) =>
          selectedIds.includes(item.id)
            ? {
                ...item,
                assigned_craftsman_id: craftsmanInfo?.id,
                assigned_craftsman: {
                  nickname: craftsmanInfo?.nickname,
                  phone: craftsmanInfo?.phone,
                },
              }
            : item,
      ),
    }));
  };

  // 支付平台服务费 - 只更新状态
  const handlePlatformServiceFeePay = async (record: any) => {
    const { id } = record ?? {};

    const { success } = await payPlatformServiceFeeService(id);

    if (success) {
      message.success('确认完成');
      // 直接更新状态
      setWorkPriceState((prev: any) => ({
        ...prev,
        total_service_fee_is_paid: true,
      }));
    }
  };

  // 支付工长工费 - 只更新状态
  const handleGangmasterCostPay = async () => {
    const orderId = rowData?.id;
    if (!orderId) return;

    const { success } = await payGangmasterCostService(orderId);

    if (success) {
      message.success('工长工费支付成功');
      setWorkPriceState((prev: any) => ({
        ...prev,
        gangmaster_cost_is_paid: true,
      }));
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
            ...workPriceState,
            calculateFinalTotal: calculateFinalTotal(workPriceState),
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
              hideInDescriptions: order_type !== 'gangmaster',
            },
            {
              title: '工长工费是否支付',
              dataIndex: 'gangmaster_cost_is_paid',
              hideInDescriptions: order_type !== 'gangmaster',
              render: () => {
                if (gangmaster_cost_is_paid) {
                  return <span style={{ color: '#52c41a' }}>是</span>;
                }
                return (
                  <Popconfirm
                    title="确认支付"
                    description="确定工长工费已收到款项吗？"
                    onConfirm={handleGangmasterCostPay}
                  >
                    <Button
                      type="primary"
                      icon={<PayCircleOutlined />}
                      size="small"
                    >
                      支付工长工费
                    </Button>
                  </Popconfirm>
                );
              },
            },
            {
              title: '平台服务费',
              dataIndex: 'total_service_fee',
              valueType: 'money',
            },
            {
              title: '平台服务费是否支付',
              dataIndex: 'total_service_fee_is_paid',
              hideInDescriptions: is_assigned === true,
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
            getCheckboxProps: (record: any) => ({
              // eslint-disable-next-line
              disabled: record?.assigned_craftsman_id != null, // 已分配工匠的行不允许勾选
            }),
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
              title: '已分配工匠',
              dataIndex: 'assigned_craftsman_id',
              width: 130,
              fixed: 'right',
              render: (_: any, record: any) => {
                if (!record?.assigned_craftsman_id) return '否';
                const { nickname, phone } = record?.assigned_craftsman ?? {};
                return (
                  <div>
                    <p>{nickname}</p>
                    <p>{phone}</p>
                  </div>
                );
              },
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
