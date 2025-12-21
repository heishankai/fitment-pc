import React, { forwardRef, useImperativeHandle } from 'react';
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
import { PayCircleOutlined } from '@ant-design/icons';
// services
import {
  getMaterialsByOrderId,
  confirmMaterialPaymentService,
} from '../service';

const DrawerBody = styled(Drawer)`
  .ant-drawer-body {
    padding: 12px;
  }
`;

const MaterialsListModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);

  const {
    data: materialsData,
    loading: materialsLoading,
    run: getMaterialsRun,
    refresh: materialsRefresh,
  } = useRequest(getMaterialsByOrderId, { manual: true });

  const { commodity_list = [], total_price = 0 } = materialsData?.data ?? {};

  // 打开弹窗方法
  const handleOpenModal = (rowData: any) => {
    setTrue();
    getMaterialsRun(rowData?.id);
  };

  // 支付单个辅材
  const handleMaterialPay = async (record: any) => {
    const { id } = record ?? {};
    const { success } = await confirmMaterialPaymentService(id);

    if (success) {
      message.success('确认完成');
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
        dataSource={commodity_list}
        columns={[
          {
            title: '商品封面',
            dataIndex: 'commodity_cover',
            width: 100,
            render: (covers: string[]) => {
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
