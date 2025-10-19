import React, { useRef } from 'react';
import { Space, Button, Popconfirm, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
// components
import OperateModal from './components/OperateModal';
// service
import { deleteWorkTypeService, getWorkTypeListService } from './service';
// utils
import { getProTableConfig } from '@/utils/proTable';

const WorkType = () => {
  const operateModalRef = useRef<any>(null);
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  // 删除类目
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteWorkTypeService(id);
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
            return await getWorkTypeListService(params);
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
              新增工种
            </Button>
          </Space>
        }
        columns={[
          // search字段
          {
            title: '工种名称',
            dataIndex: 'work_title',
            hideInTable: true,
          },
          // show
          {
            title: '工种名称',
            dataIndex: 'work_title',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '工种价格',
            dataIndex: 'work_price',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '计价说明',
            dataIndex: 'pricing_description',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '服务范围',
            dataIndex: 'service_scope',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '主图',
            dataIndex: 'display_images',
            hideInSearch: true,
            width: 150,
            render: (_: any, record: any) => {
              return (
                <Space>
                  <Image
                    width={40}
                    height={40}
                    src={record?.display_images?.[0]}
                  />

                  <span style={{ fontSize: '12px', color: '#666' }}>
                    +{record?.display_images?.length - 1}
                  </span>
                </Space>
              );
            },
          },
          {
            title: '服务详情',
            dataIndex: 'service_details',
            hideInSearch: true,
            width: 150,
            render: (_: any, record: any) => {
              return (
                <Space>
                  <Image
                    width={40}
                    height={40}
                    src={record?.service_details?.[0]}
                  />

                  <span style={{ fontSize: '12px', color: '#666' }}>
                    +{record?.service_details?.length - 1}
                  </span>
                </Space>
              );
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
                    description={`确定要删除类目吗？`}
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

export default WorkType;
