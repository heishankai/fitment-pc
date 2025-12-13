import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import {
  Drawer,
  Table,
  Tag,
  Divider,
  Card,
  Empty,
  Image,
  Button,
  Popconfirm,
  message,
  Spin,
} from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import { payMaterialsService, getMaterialsByOrderId } from '../service';

const MaterialsListModal = ({ tableFormRef }: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [record, setRecord] = useState<any>(null);
  const [materialsList, setMaterialsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 打开弹窗方法
  const handleOpenModal = async (record: any) => {
    setRecord(record);
    setTrue();
    // 加载辅材列表
    if (record?.id) {
      setLoading(true);
      try {
        const { success, data } = await getMaterialsByOrderId(record.id);
        if (success) {
          setMaterialsList(data || []);
        }
      } catch (error) {
        console.error('获取辅材列表失败:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  // 辅材清单支付
  const handleMaterialsPay = async (material: any) => {
    const { id } = record ?? {};

    const { success } = await payMaterialsService({
      order_id: id,
      materials_id: material.id,
    });

    if (success) {
      message.success('确认完成');
      tableFormRef.current?.submit();
      setFalse();
    }
  };

  if (!record) return null;

  // 商品列表表格列定义
  const commodityColumns: ColumnsType<any> = [
    {
      title: '商品ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '商品名称',
      dataIndex: 'commodity_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '封面',
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
      title: '单价',
      dataIndex: 'commodity_price',
      width: 100,
      render: (text: string) => `¥${text}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 80,
    },
    {
      title: '单位',
      dataIndex: 'commodity_unit',
      width: 80,
    },
    {
      title: '小计',
      dataIndex: 'commodity_price',
      width: 100,
      render: (text: string, record: any) => {
        const total = Number(text) * Number(record.quantity);
        return `¥${total.toFixed(2)}`;
      },
    },
  ];

  return (
    <Drawer
      title="辅材清单"
      open={visible}
      onClose={setFalse}
      width="100%"
      maskClosable={false}
    >
      <Spin spinning={loading}>
        {materialsList?.length > 0 ? (
          materialsList.map((item: any, index: number) => (
            <Card key={index} style={{ marginBottom: 24 }}>
              <ProDescriptions
                column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                dataSource={{ ...item, __materialsListIndex: index }}
                columns={[
                  {
                    title: '总价',
                    dataIndex: 'total_price',
                    render: (_: any, entity: any) => `¥${entity.total_price}`,
                  },
                  {
                    title: '是否已支付',
                    dataIndex: 'is_paid',
                    render: (_: any, entity: any) => {
                      if (entity?.is_paid) {
                        return <Tag color="success">已支付</Tag>;
                      }
                      return (
                        <Popconfirm
                          title="确认支付"
                          description={`确定已收到款项吗？`}
                          onConfirm={() => handleMaterialsPay(entity)}
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
              <Divider orientation="left">商品列表</Divider>
              <Table
                columns={commodityColumns}
                dataSource={item.commodity_list || []}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 800 }}
              />
            </Card>
          ))
        ) : (
          <Empty description="暂无辅材清单信息" />
        )}
      </Spin>
    </Drawer>
  );
};

export default forwardRef(MaterialsListModal);
