import React, {
  forwardRef,
  useMemo,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { useBoolean, useRequest } from 'ahooks';
import styled from 'styled-components';
import { Drawer, Space, Button, Popconfirm, Divider, message, Tag } from 'antd';
import {
  ProTable,
  ProDescriptions,
  type ProColumns,
} from '@ant-design/pro-components';
// services
import {
  getOrderByIdService,
  payPriceItemService,
  batchPayPriceItemsService,
  acceptSingleWorkPriceService,
  batchAcceptWorkPriceItemsService,
  payPlatformServiceFeeService,
  payGangmasterCostService,
} from '../service';
import {
  CheckCircleOutlined,
  PayCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
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

  const formatMoney = (value: any) => {
    const amount = Number(value) || 0;
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const groupedWorkPrices = useMemo(() => {
    const groups = new Map<string, any>();

    (parent_work_price_groups ?? []).forEach((item: any) => {
      const workKindName = item?.work_kind_name || '未分类工种';
      const workKindCode = item?.work_kind_code || workKindName;
      const groupKey = `${workKindCode}-${workKindName}`;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          key: groupKey,
          workKindName,
          workKindCode,
          items: [],
          totalSettlementAmount: 0,
        });
      }

      const group = groups.get(groupKey);
      group.items.push(item);
      group.totalSettlementAmount += Number(item?.settlement_amount) || 0;
    });

    return Array.from(groups.values());
  }, [parent_work_price_groups]);

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

  // 批量支付工价 - 只更新选中数据状态
  const handleBatchWorkPricePay = async () => {
    const selectedIds = selectedRowKeys.map((key: any) => Number(key));
    const selectedItems = (parent_work_price_groups ?? []).filter((item: any) =>
      selectedIds.includes(item.id),
    );
    const unpaidIds = selectedItems
      .filter((item: any) => !item?.is_paid)
      .map((item: any) => item.id);

    if (!unpaidIds.length) {
      message.warning('请选择未支付的工价');
      return;
    }

    const { success } = await batchPayPriceItemsService({
      work_price_item_ids: unpaidIds,
    });

    if (success) {
      message.success('批量支付完成');
      setSelectedRowKeys([]);
      setWorkPriceState((prev: any) => ({
        ...prev,
        parent_work_price_groups: prev.parent_work_price_groups.map(
          (item: any) =>
            unpaidIds.includes(item.id) ? { ...item, is_paid: true } : item,
        ),
      }));
    }
  };

  const updateAcceptedState = (acceptedIds: number[]) => {
    setWorkPriceState((prev: any) => {
      const nextWorkPriceGroups = prev.parent_work_price_groups.map(
        (item: any) =>
          acceptedIds.includes(item.id) ? { ...item, is_accepted: true } : item,
      );

      return {
        ...prev,
        parent_work_price_groups: nextWorkPriceGroups,
        total_is_accepted: nextWorkPriceGroups.every(
          (item: any) => item.is_accepted === true,
        ),
      };
    });
  };

  // 验收单个工价
  const handleWorkPriceAccept = async (record: any) => {
    const { id } = record ?? {};
    const { success } = await acceptSingleWorkPriceService({
      work_price_item_id: id,
    });

    if (success) {
      message.success('验收完成');
      updateAcceptedState([id]);
    }
  };

  // 批量验收工价
  const handleBatchWorkPriceAccept = async () => {
    const selectedIds = selectedRowKeys.map((key: any) => Number(key));
    const selectedItems = (parent_work_price_groups ?? []).filter((item: any) =>
      selectedIds.includes(item.id),
    );
    const acceptableIds = selectedItems
      .filter((item: any) => item?.is_paid === true && !item?.is_accepted)
      .map((item: any) => item.id);

    if (!acceptableIds.length) {
      message.warning('请选择已支付且未验收的工价');
      return;
    }

    const { success } = await batchAcceptWorkPriceItemsService({
      work_price_item_ids: acceptableIds,
    });

    if (success) {
      message.success('批量验收完成');
      setSelectedRowKeys([]);
      updateAcceptedState(acceptableIds);
    }
  };

  // 打开分配工匠弹窗
  const handleOpenAssignModal = () => {
    if (!selectedRowKeys?.length) {
      message.warning('请先选择要分配的工价');
      return;
    }

    const selectedIds = selectedRowKeys.map((key: any) => Number(key));
    const hasAssignedItem = (parent_work_price_groups ?? []).some(
      (item: any) =>
        selectedIds.includes(item.id) && item?.assigned_craftsman_id !== null,
    );
    if (hasAssignedItem) {
      message.warning('已分配工匠的工价不能重复分配');
      return;
    }

    const hasUnpaidItem = (parent_work_price_groups ?? []).some(
      (item: any) => selectedIds.includes(item.id) && item?.is_paid !== true,
    );
    if (hasUnpaidItem) {
      message.warning('请先支付工费后再分配工匠');
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

  const workPriceColumns: ProColumns<any>[] = [
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
          <Space direction="vertical">
            <Tag color="processing">{nickname}</Tag>
            <Tag color="processing">{phone}</Tag>
          </Space>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
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
            <Popconfirm
              title="确认验收"
              description="确定要验收该工价吗？"
              onConfirm={() => handleWorkPriceAccept(record)}
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                size="small"
                disabled={!record?.is_paid || record?.is_accepted}
              >
                验收
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

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
        <Space style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={handleOpenAssignModal}
            disabled={selectedRowKeys?.length === 0}
          >
            分配工匠
          </Button>
          <Popconfirm
            title="确认批量支付"
            description="确定已收到选中工价的款项吗？"
            onConfirm={handleBatchWorkPricePay}
          >
            <Button
              type="primary"
              icon={<PayCircleOutlined />}
              disabled={selectedRowKeys?.length === 0}
            >
              批量支付工费
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确认批量验收"
            description="确定要验收选中的已支付工价吗？"
            onConfirm={handleBatchWorkPriceAccept}
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              disabled={selectedRowKeys?.length === 0}
            >
              批量验收
            </Button>
          </Popconfirm>
        </Space>
        {groupedWorkPrices.map((group) => {
          const groupRowKeys = group.items.map((item: any) => item.id);

          return (
            <ProTable
              key={group.key}
              rowKey="id"
              pagination={false}
              scroll={{ x: 900 }}
              search={false}
              options={false}
              style={{ marginBottom: 16 }}
              headerTitle={`${group.workKindName}（${group.items.length}项，合计 ¥${formatMoney(
                group.totalSettlementAmount,
              )}）`}
              rowSelection={{
                selectedRowKeys: selectedRowKeys.filter((key) =>
                  groupRowKeys.includes(key),
                ),
                onChange: (keys) => {
                  setSelectedRowKeys((prevKeys) => [
                    ...prevKeys.filter((key) => !groupRowKeys.includes(key)),
                    ...keys,
                  ]);
                },
              }}
              dataSource={group.items}
              columns={workPriceColumns}
            />
          );
        })}
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
