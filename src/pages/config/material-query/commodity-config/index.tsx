import React, { useRef } from 'react';
import {
  ProTable,
  ProFormInstance,
  ActionType,
} from '@ant-design/pro-components';
import { Space, Button, Popconfirm, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// utils
import { getProTableConfig } from '@/utils/proTable';
// service
import { getCommodityListService, deleteCommodityService } from './service';
// components
import OperateModal from './components/OperateModal';
import CategorySelect from '@/components/CategorySelect';

const CommodityConfig = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>();

  // 删除商品
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteCommodityService(id);
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
            return await getCommodityListService(params);
          },
        })}
        rowKey="id"
        scroll={{ x: 900 }}
        headerTitle={
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => operateModalRef.current.handleOpenModal('add')}
            >
              新增商品
            </Button>
          </Space>
        }
        columns={[
          // search字段
          {
            title: '所属类目',
            dataIndex: 'category_id',
            hideInTable: true,
            valueType: 'select',
            renderFormItem: () => <CategorySelect />,
          },
          {
            title: '商品名称',
            dataIndex: 'commodity_name',
            hideInTable: true,
          },
          // table字段
          {
            title: '所属类目',
            dataIndex: 'category_name',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '商品名称',
            dataIndex: 'commodity_name',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '商品价格',
            dataIndex: 'commodity_price',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '商品描述',
            dataIndex: 'commodity_description',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },

          {
            title: '服务保障',
            dataIndex: 'service_guarantee',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '商品封面',
            dataIndex: 'commodity_cover',
            hideInSearch: true,
            width: 100,
            valueType: 'image',
            ellipsis: true,
            fieldProps: {
              width: 50,
              height: 50,
            },
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
            width: 180,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              return (
                <Space>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() =>
                      operateModalRef.current.handleOpenModal('edit', record)
                    }
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除"
                    description={`确定要删除商品吗？`}
                    onConfirm={() => handleDelete(record?.id)}
                  >
                    <Button type="link" icon={<DeleteOutlined />}>
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

export default CommodityConfig;
