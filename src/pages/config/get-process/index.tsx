import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { Space, Button, Popconfirm, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
// service
import { getProcessUserListService, getProcessContactService } from './service';

const GetProcess = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  // 确认审核通过
  const handleContact = async (id: number) => {
    const { success } = await getProcessContactService(id);
    if (success) {
      message.success('已联系成功');
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
            return await getProcessUserListService(params);
          },
        })}
        columns={[
          // search字段
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInTable: true,
          },
          // table字段
          {
            title: '用户手机号码',
            dataIndex: 'phone',
            hideInSearch: true,
            width: 150,
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
            title: '是否已联系',
            dataIndex: 'is_contact',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
            valueEnum: {
              true: { text: '是', status: 'Success' },
              false: { text: '否', status: 'Error' },
            },
          },
          {
            title: '操作',
            valueType: 'option',
            width: 200,
            align: 'center',
            render: (text: any, record: any) => {
              const { id, is_contact } = record ?? {};
              return (
                <Space>
                  {!is_contact && (
                    <Popconfirm
                      title="确认已联系吗？"
                      onConfirm={() => handleContact(id)}
                    >
                      <Button type="link" icon={<CheckCircleOutlined />}>
                        已联系
                      </Button>
                    </Popconfirm>
                  )}
                </Space>
              );
            },
          },
        ]}
      />
    </PageContainer>
  );
};

export default GetProcess;
