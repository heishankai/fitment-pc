import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Space, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
// components
import OperateModal from './components/OperateModal';
// service
import { getCaseListService, deleteCaseService } from './service';

const CaseQuery = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>(null);

  // 删除案例
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteCaseService(id);
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
        rowKey="id"
        scroll={{ x: 900 }}
        {...getProTableConfig({
          request: async (params) => {
            return await getCaseListService(params);
          },
        })}
        headerTitle={
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => operateModalRef.current.handleOpenModal('add')}
            >
              新增
            </Button>
          </Space>
        }
        columns={[
          // search字段
          {
            title: '小区名称',
            dataIndex: 'housing_name',
            hideInTable: true,
          },
          // table字段
          {
            title: '小区名称',
            dataIndex: 'housing_name',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '改造类型',
            dataIndex: 'remodel_type',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
            valueEnum: {
              1: '新房装修',
              2: '旧房改造',
            },
          },
          {
            title: '城市',
            dataIndex: 'city_name',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '平米数',
            dataIndex: 'square_number',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '施工费用',
            dataIndex: 'construction_cost',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '辅材费用',
            dataIndex: 'auxiliary_material_cost',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '房屋总费用',
            dataIndex: 'house_total_cost',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
            render: (text: any, record: any) => {
              return (
                <span>
                  {record?.auxiliary_material_cost + record?.construction_cost}
                  元
                </span>
              );
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
                    description={`确定要删除案例吗？`}
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

export default CaseQuery;
