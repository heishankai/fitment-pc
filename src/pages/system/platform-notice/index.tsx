import React, { useRef } from 'react';
import { Space, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import {
  deletePlatformNoticeService,
  getPlatformNoticeListService,
} from './service';
// components
import OperateModal from './components/OperateModal';
// utils
import { getProTableConfig } from '@/utils/proTable';

const PlatformNotice = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>(null);

  // 删除公告
  const handleDelete = async (id: string | number) => {
    const { success } = await deletePlatformNoticeService(id);
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
            return await getPlatformNoticeListService(params);
          },
        })}
        rowKey="id"
        scroll={{ x: 1200 }}
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
            title: '公告标题',
            dataIndex: 'notice_title',
            hideInTable: true,
          },
          {
            title: '公告类型',
            dataIndex: 'notice_type',
            hideInTable: true,
            valueType: 'radio',
            fieldProps: {
              options: [
                { label: '用户端公告', value: 1 },
                { label: '工匠端公告', value: 2 },
              ],
            },
          },
          {
            title: '发送时间',
            dataIndex: 'create_time',
            hideInTable: true,
            valueType: 'date',
            proFieldProps: {
              format: 'YYYY-MM-DD',
            },
          },
          // table字段
          {
            title: '公告标题',
            dataIndex: 'notice_title',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '公告类型',
            dataIndex: 'notice_type',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
            valueEnum: {
              1: { text: '用户端公告' },
              2: { text: '工匠端公告' },
            },
          },
          {
            title: '公告内容',
            dataIndex: 'notice_content',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            hideInSearch: true,
            width: 120,
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
            width: 120,
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

export default PlatformNotice;
