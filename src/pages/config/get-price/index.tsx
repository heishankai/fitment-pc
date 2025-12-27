import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Space, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
// components
import OperateModal from './components/OperateModal';
// service
import { getGetPriceListService, deleteGetPriceService } from './service';

const GetPrice = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>(null);

  // 删除获取报价
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteGetPriceService(id);
    if (success) {
      message.success('删除成功');
      tableFormRef.current?.submit();
    }
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        {...getProTableConfig({
          request: async (params) => {
            return await getGetPriceListService(params);
          },
        })}
        manualRequest={false}
        rowKey="id"
        scroll={{ x: 1200 }}
        columns={[
          // search字段
          {
            title: '城市',
            dataIndex: 'city',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '房屋类型',
            dataIndex: 'houseType',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
              new: '新房',
              old: '老房',
            },
          },
          // table字段
          {
            title: '面积',
            dataIndex: 'area',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '房屋类型',
            dataIndex: 'houseTypeName',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '位置',
            dataIndex: 'location',
            hideInSearch: true,
            width: 250,
            ellipsis: true,
          },
          {
            title: '户型',
            dataIndex: 'roomType',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
            copyable: true,
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            hideInSearch: true,
            width: 180,
            ellipsis: true,
            valueType: 'dateTime',
            proFieldProps: {
              format: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
            hideInSearch: true,
            width: 180,
            ellipsis: true,
            valueType: 'dateTime',
            proFieldProps: {
              format: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          {
            title: '操作',
            valueType: 'option',
            width: 150,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              return (
                <Space>
                  <Popconfirm
                    title="确认删除吗？"
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      style={{ padding: 0 }}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
      <OperateModal ref={operateModalRef} tableFormRef={tableFormRef} />
    </PageContainer>
  );
};

export default GetPrice;
