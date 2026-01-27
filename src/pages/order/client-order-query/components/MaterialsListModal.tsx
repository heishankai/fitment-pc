import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { useBoolean, useRequest } from 'ahooks';
import styled from 'styled-components';
import {
  Drawer,
  Space,
  Button,
  Popconfirm,
  Divider,
  message,
  Image,
} from 'antd';
import { ProTable, ProDescriptions } from '@ant-design/pro-components';
import { PayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
// services
import {
  getMaterialsByOrderId,
  confirmMaterialPaymentService,
  allConfirmMaterialPaymentService,
  allConfirmMaterialAcceptService,
} from '../service';

const DrawerBody = styled(Drawer)`
  .ant-drawer-body {
    padding: 12px;
  }
`;

const MaterialsListModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [rowData, setRowData] = useState<any>({});
  const [materialsState, setMaterialsState] = useState<any>(null);

  const {
    data: materialsData,
    loading: materialsLoading,
    run: getMaterialsRun,
    refresh: materialsRefresh,
  } = useRequest(getMaterialsByOrderId, { manual: true });

  // 初始化或更新状态
  useEffect(() => {
    if (materialsData?.data) {
      setMaterialsState(materialsData.data);
    }
  }, [materialsData?.data]);

  const { commodity_list = [], total_price = 0 } = materialsState ?? {};

  // 打开弹窗方法
  const handleOpenModal = (row: any) => {
    setTrue();
    getMaterialsRun(row?.id);
    setRowData({ ...row });
  };

  // 支付单个辅材 - 只更新单条数据状态
  const handleMaterialPay = async (record: any) => {
    const { id } = record ?? {};
    const { success } = await confirmMaterialPaymentService(id);

    if (success) {
      message.success('确认完成');
      // ✨ 直接更新状态，无需刷新整个列表
      setMaterialsState((prev: any) => ({
        ...prev,
        commodity_list: prev.commodity_list.map((item: any) =>
          item.id === id ? { ...item, is_paid: true } : item,
        ),
      }));
    }
  };

  // 一键支付 - 刷新所有数据
  const handleCheckAllMaterials = async () => {
    const { success } = await allConfirmMaterialPaymentService({
      orderId: rowData?.id,
    });

    if (success) {
      message.success('确认完成');
      // 一键支付时刷新整个列表，获取最新数据
      materialsRefresh();
    }
  };

  // 一键验收 - 刷新所有数据
  const handleCheckAllMaterialsAccept = async () => {
    const { success } = await allConfirmMaterialAcceptService(rowData?.id);
    if (success) {
      message.success('验收完成');
      materialsRefresh();
    }
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  return (
    <DrawerBody
      title="辅材详情"
      open={visible}
      onClose={setFalse}
      width="100%"
      maskClosable={false}
      style={{ padding: 0 }}
      loading={materialsLoading}
    >
      <Divider orientation="left">辅材汇总</Divider>
      <ProDescriptions
        bordered
        column={3}
        dataSource={{
          total_price,
        }}
        columns={[
          {
            title: '辅材总费用',
            dataIndex: 'total_price',
            valueType: 'money',
          },
        ]}
      />
      <Divider orientation="left">辅材列表</Divider>
      <ProTable
        rowKey="id"
        pagination={false}
        scroll={{ x: 1200 }}
        search={false}
        options={false}
        headerTitle={false}
        toolBarRender={() => [
          <Space key="checkAllMaterials">
            <Popconfirm
              title="确认支付"
              description={`确定已收到款项吗？`}
              onConfirm={handleCheckAllMaterials}
            >
              <Button type="primary" icon={<PayCircleOutlined />}>
                一键支付
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确认验收"
              description={`确定要全部验收吗？`}
              onConfirm={handleCheckAllMaterialsAccept}
            >
              <Button type="primary" icon={<CheckCircleOutlined />}>
                一键验收
              </Button>
            </Popconfirm>
          </Space>,
        ]}
        dataSource={commodity_list}
        columns={[
          {
            title: '商品封面',
            dataIndex: 'commodity_cover',
            width: 100,
            render: (covers: any) => {
              if (!covers || covers.length === 0) return '-';
              return (
                <Image
                  src={covers[0]}
                  alt="商品封面"
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover' }}
                  preview={{
                    mask: '预览',
                  }}
                />
              );
            },
          },
          {
            title: '商品名称',
            dataIndex: 'commodity_name',
            width: 150,
            ellipsis: true,
          },
          {
            title: '商品单价',
            dataIndex: 'commodity_price',
            width: 120,
            valueType: 'money',
          },
          {
            title: '数量',
            dataIndex: 'quantity',
            width: 100,
          },
          {
            title: '单位',
            dataIndex: 'commodity_unit',
            width: 100,
          },
          {
            title: '结算金额',
            dataIndex: 'settlement_amount',
            width: 120,
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
                    onConfirm={() => handleMaterialPay(record)}
                  >
                    <Button
                      type="primary"
                      icon={<PayCircleOutlined />}
                      size="small"
                      disabled={record?.is_paid}
                    >
                      支付
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
    </DrawerBody>
  );
};

export default forwardRef(MaterialsListModal);
