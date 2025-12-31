import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
// service
import { getWechatUserListService } from './service';

const Table = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        rowKey="id"
        scroll={{ x: 900 }}
        {...getProTableConfig({
          request: async (params) => {
            return await getWechatUserListService(params);
          },
        })}
        columns={[
          // search字段
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '昵称',
            dataIndex: 'nickname',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '城市',
            dataIndex: 'city',
            hideInTable: true,
            valueType: 'text',
          },
          // table字段
          {
            title: '昵称',
            dataIndex: 'nickname',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
            copyable: true,
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
            title: '头像',
            dataIndex: 'avatar',
            hideInSearch: true,
            width: 100,
            valueType: 'image',
            fieldProps: {
              width: 50,
              height: 50,
            },
          },
          {
            title: '城市',
            dataIndex: 'city',
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
        ]}
      />
    </PageContainer>
  );
};

export default Table;
