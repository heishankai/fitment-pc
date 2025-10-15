import React, { useRef } from 'react';
import {
  PageContainer,
  ProTable,
  ProFormInstance,
  ActionType,
} from '@ant-design/pro-components';
import { Space, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
// components
import WholeHouseModal from './components/WholeHouseModal';
// utils
import { getProTableConfig } from '@/utils/proTable';
// service
import {
  getWholeHouseConfigListService,
  deleteWholeHouseConfigService,
} from './service';

const Table = () => {
  const wholeHouseModalRef = useRef<any>(null);
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  // 删除案例
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteWholeHouseConfigService(id);
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
            return await getWholeHouseConfigListService(params);
          },
        })}
        rowKey="id"
        scroll={{ x: 1200 }}
        headerTitle={
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => wholeHouseModalRef.current.handleOpenModal('add')}
            >
              新增全屋装修配置
            </Button>
          </Space>
        }
        columns={[
          // search字段
          {
            title: '分类名称',
            dataIndex: 'category_name',
            hideInTable: true,
          },
          // table字段
          {
            title: '分类名称',
            dataIndex: 'category_name',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '工种标题',
            dataIndex: 'work_configs',
            hideInSearch: true,
            width: 200,
            ellipsis: true,
            render: (text: any, record: any) => {
              const workConfigs = record.work_configs;
              if (!workConfigs || workConfigs.length === 0) {
                return '-';
              }
              return (
                <div>
                  {workConfigs.slice(0, 2).map((config: any, index: number) => (
                    <div key={index} style={{ marginBottom: 4 }}>
                      <div style={{ fontWeight: 500, color: '#1890ff' }}>
                        {config.work_title || '未命名工种'}
                      </div>
                    </div>
                  ))}
                  {workConfigs.length > 2 && (
                    <div style={{ fontSize: 12, color: '#999' }}>
                      ...还有 {workConfigs.length - 2} 个
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            title: '价格范围',
            dataIndex: 'work_configs',
            hideInSearch: true,
            width: 120,
            align: 'center',
            render: (text: any, record: any) => {
              const workConfigs = record.work_configs;
              if (!workConfigs || workConfigs.length === 0) {
                return '-';
              }
              const prices = workConfigs
                .map((config: any) => config.price || 0)
                .filter(Boolean);
              if (prices.length === 0) return '-';

              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);

              return (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#52c41a', fontWeight: 500 }}>
                    ¥{minPrice}
                  </div>
                  {minPrice !== maxPrice && (
                    <div style={{ fontSize: 12, color: '#999' }}>
                      ~ ¥{maxPrice}
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            title: '计价说明',
            dataIndex: 'work_configs',
            hideInSearch: true,
            width: 200,
            ellipsis: true,
            render: (text: any, record: any) => {
              const workConfigs = record.work_configs;
              if (!workConfigs || workConfigs.length === 0) {
                return '-';
              }
              return (
                <div>
                  {workConfigs.slice(0, 1).map((config: any, index: number) => (
                    <div key={index} style={{ fontSize: 12, color: '#666' }}>
                      {config.pricing_description || '暂无说明'}
                    </div>
                  ))}
                  {workConfigs.length > 1 && (
                    <div style={{ fontSize: 11, color: '#999' }}>
                      ...还有 {workConfigs.length - 1} 个配置
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            title: '服务范围',
            dataIndex: 'work_configs',
            hideInSearch: true,
            width: 200,
            ellipsis: true,
            render: (text: any, record: any) => {
              const workConfigs = record.work_configs;
              if (!workConfigs || workConfigs.length === 0) {
                return '-';
              }
              return (
                <div>
                  {workConfigs.slice(0, 1).map((config: any, index: number) => (
                    <div key={index} style={{ fontSize: 12, color: '#666' }}>
                      {config.service_scope || '暂无说明'}
                    </div>
                  ))}
                  {workConfigs.length > 1 && (
                    <div style={{ fontSize: 11, color: '#999' }}>
                      ...还有 {workConfigs.length - 1} 个配置
                    </div>
                  )}
                </div>
              );
            },
          },
          {
            title: '图片资源',
            dataIndex: 'work_configs',
            hideInSearch: true,
            width: 120,
            align: 'center',
            render: (text: any, record: any) => {
              const workConfigs = record.work_configs;
              if (!workConfigs || workConfigs.length === 0) {
                return '-';
              }

              const totalDisplayImages = workConfigs.reduce(
                (sum: number, config: any) =>
                  sum + (config.display_images?.length || 0),
                0,
              );
              const totalServiceDetails = workConfigs.reduce(
                (sum: number, config: any) =>
                  sum + (config.service_details?.length || 0),
                0,
              );

              return (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#1890ff' }}>
                    📷 {totalDisplayImages}
                  </div>
                  <div style={{ fontSize: 12, color: '#52c41a' }}>
                    📋 {totalServiceDetails}
                  </div>
                </div>
              );
            },
          },
          {
            title: '配置数量',
            dataIndex: 'work_configs',
            hideInSearch: true,
            width: 100,
            align: 'center',
            render: (text: any, record: any) => {
              const workConfigs = record?.work_configs;
              const count = workConfigs?.length || 0;
              return (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                    height: '24px',
                    backgroundColor: count > 0 ? '#e6f7ff' : '#f5f5f5',
                    color: count > 0 ? '#1890ff' : '#999',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border:
                      count > 0 ? '1px solid #91d5ff' : '1px solid #d9d9d9',
                  }}
                >
                  {count}
                </div>
              );
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
                      wholeHouseModalRef.current.handleOpenModal('edit', record)
                    }
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除"
                    description={`确定要删除全屋装修配置吗？`}
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
      <WholeHouseModal ref={wholeHouseModalRef} tableFormRef={tableFormRef} />
    </PageContainer>
  );
};

export default Table;
