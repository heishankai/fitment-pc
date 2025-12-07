import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Space, Button, Popconfirm, message } from 'antd';
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
// service
import { getWithdrawListService, auditWithdrawService } from './service';
// components
import { BankCardModal } from './components';

const WithdrawalAudit = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const bankCardModalRef = useRef<any>();

  // 审核提现申请
  const handleAudit = async (id: number, status: number) => {
    const { success } = await auditWithdrawService({
      withdraw_id: id,
      status,
    });

    if (success) {
      message.success('操作成功');
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
            return await getWithdrawListService(params);
          },
        })}
        rowKey="id"
        scroll={{ x: 900 }}
        columns={[
          // search
          {
            title: '工匠昵称',
            dataIndex: 'craftsman_user_name',
            hideInTable: true,
          },
          {
            title: '状态',
            dataIndex: 'status',
            hideInTable: true,
            valueType: 'select',
            valueEnum: {
              1: { text: '审核中' },
              2: { text: '已完成' },
              3: { text: '已拒绝' },
            },
          },
          // show
          {
            title: '工匠名称',
            dataIndex: 'nickname',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
            render: (_, record: any) => record?.craftsman_user?.nickname,
          },
          {
            title: '工匠联系方式',
            dataIndex: 'phone',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
            render: (_, record: any) => record?.craftsman_user?.phone,
          },
          {
            title: '提现金额',
            dataIndex: 'amount',
            hideInSearch: true,
            width: 120,
            valueType: 'money',
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
            title: '状态',
            dataIndex: 'status',
            hideInSearch: true,
            width: 90,
            fixed: 'right',
            valueEnum: {
              1: { text: '审核中', status: 'Processing' },
              2: { text: '已完成', status: 'Success' },
              3: { text: '已拒绝', status: 'Error' },
            },
          },
          {
            title: '操作',
            valueType: 'option',
            width: 320,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              const { craftsman_bank_card, id, status } = record ?? {};
              return (
                <Space>
                  <Popconfirm
                    key="approve"
                    title="确认审核通过"
                    description="确定要通过该提现申请吗？"
                    onConfirm={() => handleAudit(id, 2)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button
                      type="link"
                      style={{
                        display: status === 1 ? 'block' : 'none',
                      }}
                      icon={<CheckCircleOutlined />}
                    >
                      通过
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    key="reject"
                    title="确认拒绝"
                    description="确定要拒绝该提现申请吗？"
                    onConfirm={() => handleAudit(id, 3)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <Button
                      type="link"
                      style={{
                        display: status === 1 ? 'block' : 'none',
                      }}
                      icon={<CloseCircleOutlined />}
                    >
                      拒绝
                    </Button>
                  </Popconfirm>
                  <Button
                    key="bankCard"
                    type="link"
                    style={{ padding: 0 }}
                    icon={<EyeOutlined />}
                    onClick={() => {
                      bankCardModalRef.current?.handleOpenModal(
                        craftsman_bank_card,
                      );
                    }}
                  >
                    查看银行卡信息
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
      <BankCardModal ref={bankCardModalRef} />
    </PageContainer>
  );
};

export default WithdrawalAudit;
