import React, { useRef } from 'react';
import { Space, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
// components
import OperateModal from './components/OperateModal';
// service
import { deleteLabourCostService, getLabourCostListService } from './service';
// utils
import { getProTableConfig } from '@/utils/proTable';

const LabourCost = () => {
  const operateModalRef = useRef<any>(null);
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  // 删除
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteLabourCostService(id);
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        {...getProTableConfig({
          request: async (params) => {
            return await getLabourCostListService(params);
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
              新增单位
            </Button>
          </Space>
        }
        columns={[
          // search字段
          {
            title: '单位名称',
            dataIndex: 'labour_cost_name',
            hideInTable: true,
          },
          // show
          {
            title: '单位名称',
            dataIndex: 'labour_cost_name',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
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
                    description={`确定要删除工种吗？`}
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
      <OperateModal ref={operateModalRef} actionRef={actionRef} />
    </PageContainer>
  );
};

export default LabourCost;
