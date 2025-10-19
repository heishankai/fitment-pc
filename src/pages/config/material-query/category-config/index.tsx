import React, { useRef } from 'react';
import {
  ProTable,
  ProFormInstance,
  ActionType,
} from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { Space, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// components
import OperateModal from './components/OperateModal';
// service
import { getCategoryListService, deleteCategoryService } from './service';
// utils
import { getProTableConfig } from '@/utils/proTable';

const CategoryConfig = () => {
  const operateModalRef = useRef<any>(null);
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  // 删除类目
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteCategoryService(id);
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
            return await getCategoryListService(params);
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
              新增类目
            </Button>
          </Space>
        }
        columns={[
          // search字段
          {
            title: '类目名称',
            dataIndex: 'category_name',
            hideInTable: true,
          },
          // show
          {
            title: '类目名称',
            dataIndex: 'category_name',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '类目图片',
            dataIndex: 'category_image',
            hideInSearch: true,
            width: 120,
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

export default CategoryConfig;
