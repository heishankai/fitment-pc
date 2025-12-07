import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import {
  Drawer,
  Table,
  Tag,
  Divider,
  Card,
  Empty,
  Button,
  Popconfirm,
  message,
} from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { payService } from '../service';
import { mainPriceListColumns, subPriceListColumns } from '../utils';
const WorkPriceModal = ({ tableFormRef }: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [record, setRecord] = useState<any>(null);

  // 打开弹窗方法
  const handleOpenModal = (record: any) => {
    setRecord(record);
    setTrue();
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  // 子工价支付
  const handleSubPay = async (index: number) => {
    const { id } = record ?? {};

    const { success } = await payService({
      order_id: id,
      pay_type: 'sub_work_prices',
      subItem: index,
    });

    if (success) {
      message.success('确认完成');
      tableFormRef.current?.submit();
      setFalse();
    }
  };

  // 主工价支付
  const handleMainPay = async () => {
    const { id } = record ?? {};

    const { success } = await payService({
      order_id: id,
      pay_type: 'work_prices',
    });

    if (success) {
      message.success('确认完成');
      tableFormRef.current?.submit();
      setFalse();
    }
  };

  if (!record) return null;

  const workPrices = record?.work_prices || [];
  const subWorkPrices = record?.sub_work_prices || [];

  return (
    <Drawer
      title="工价详情"
      open={visible}
      onClose={setFalse}
      width="100%"
      maskClosable={false}
    >
      {/* 主工价 */}
      {workPrices?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Divider orientation="left">主工价</Divider>
          {(workPrices || [])?.map((item: any, index: number) => (
            <Card key={index} style={{ marginBottom: 24 }}>
              <ProDescriptions
                column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={item}
                columns={[
                  {
                    title: '面积',
                    dataIndex: 'area',
                    render: (_: any, entity: any) => `${entity.area}㎡`,
                  },
                  {
                    title: '工种',
                    dataIndex: 'craftsman_user_work_kind_name',
                  },
                  {
                    title: '工长费用',
                    dataIndex: 'gangmaster_cost',
                  },
                  {
                    title: '施工费用',
                    dataIndex: 'total_price',
                  },
                  {
                    title: '平台服务费',
                    dataIndex: 'total_service_fee',
                    render: (_: any, entity: any) =>
                      `¥${entity.total_service_fee}`,
                  },
                  {
                    title: '上门服务费数量',
                    dataIndex: 'visiting_service_num',
                  },
                  {
                    title: '是否已支付',
                    dataIndex: 'is_paid',
                    render: (_: any, entity: any) => {
                      if (entity?.is_paid) {
                        return <Tag color="success">是</Tag>;
                      }
                      return (
                        <Popconfirm
                          title="确认支付"
                          description={`确定已收到款项吗？`}
                          onConfirm={() => handleMainPay()}
                        >
                          <Button type="primary">确认收到款项</Button>
                        </Popconfirm>
                      );
                    },
                  },
                  {
                    title: '总验收状态',
                    dataIndex: 'total_is_accepted',
                    render: (_: any, entity: any) => (
                      <Tag
                        color={entity.total_is_accepted ? 'success' : 'default'}
                      >
                        {entity.total_is_accepted ? '已验收' : '未验收'}
                      </Tag>
                    ),
                  },
                ]}
                style={{ marginBottom: 16 }}
              />
              <Table
                columns={mainPriceListColumns}
                dataSource={item.prices_list || []}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 1400 }}
              />
            </Card>
          ))}
        </div>
      )}

      {/* 子工价 */}
      {subWorkPrices?.length > 0 && (
        <div>
          <Divider orientation="left">子工价（不包含工长费用）</Divider>
          {(subWorkPrices || [])?.map((item: any, index: number) => (
            <Card key={index} style={{ marginBottom: 24 }}>
              <ProDescriptions
                column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={{ ...item, __subWorkPriceIndex: index }}
                columns={[
                  {
                    title: '面积',
                    dataIndex: 'area',
                    render: (_: any, entity: any) => `${entity.area}㎡`,
                  },
                  {
                    title: '工种',
                    dataIndex: 'craftsman_user_work_kind_name',
                  },
                  {
                    title: '施工费用',
                    dataIndex: 'total_price',
                  },
                  {
                    title: '平台服务费',
                    dataIndex: 'total_service_fee',
                    render: (_: any, entity: any) =>
                      `¥${entity.total_service_fee}`,
                  },
                  {
                    title: '上门服务费数量',
                    dataIndex: 'visiting_service_num',
                    render: (_: any, entity: any) =>
                      `${entity.visiting_service_num}（子工价单为0）`,
                  },
                  {
                    title: '是否已支付',
                    dataIndex: 'is_paid',
                    render: (_: any, entity: any) => {
                      if (entity?.is_paid) {
                        return <Tag color="success">是</Tag>;
                      }
                      return (
                        <Popconfirm
                          title="确认支付"
                          description={`确定已收到款项吗？`}
                          onConfirm={() =>
                            handleSubPay(entity?.__subWorkPriceIndex)
                          }
                        >
                          <Button type="primary">确认收到款项</Button>
                        </Popconfirm>
                      );
                    },
                  },
                  {
                    title: '总验收状态',
                    dataIndex: 'total_is_accepted',
                    render: (_: any, entity: any) => (
                      <Tag
                        color={entity.total_is_accepted ? 'success' : 'default'}
                      >
                        {entity.total_is_accepted ? '已验收' : '未验收'}
                      </Tag>
                    ),
                  },
                ]}
                style={{ marginBottom: 16 }}
              />
              <Table
                columns={subPriceListColumns}
                dataSource={item.prices_list || []}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 1200 }}
              />
            </Card>
          ))}
        </div>
      )}

      {workPrices.length === 0 && subWorkPrices.length === 0 && (
        <Empty description="暂无工价信息" />
      )}
    </Drawer>
  );
};

export default forwardRef(WorkPriceModal);
