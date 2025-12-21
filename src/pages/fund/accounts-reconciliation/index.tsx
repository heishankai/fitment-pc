import React, { useRef } from 'react';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Space, Button, message } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
// service
import {
  getPlatformIncomeRecordListService,
  exportPlatformIncomeRecordListService,
} from './service';

const AccountsReconciliation = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  const { loading, run } = useRequest(exportPlatformIncomeRecordListService, {
    manual: true,
    onSuccess: () => message.success({ content: '导出成功' }),
  });

  // 导出平台收入记录列表
  const handleExport = async () => {
    const { income_time, ...rest } =
      await tableFormRef.current?.getFieldsValue();

    const [startDate, endDate] = income_time ?? [];

    run({
      ...rest,
      income_time:
        startDate && endDate
          ? [
              dayjs(startDate).format('YYYY-MM-DD'),
              dayjs(endDate).format('YYYY-MM-DD'),
            ]
          : undefined,
    });
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        {...getProTableConfig({
          request: async (params) => {
            return await getPlatformIncomeRecordListService(params);
          },
        })}
        rowKey="id"
        scroll={{ x: 900 }}
        headerTitle={
          <Space>
            <Button
              type="primary"
              loading={loading}
              icon={<VerticalAlignBottomOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
          </Space>
        }
        columns={[
          // search
          {
            title: '订单编号',
            dataIndex: 'order_no',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '收入时间',
            dataIndex: 'income_time',
            hideInTable: true,
            valueType: 'dateRange',
            fieldProps: {
              format: 'YYYY-MM-DD',
            },
          },
          // show
          {
            title: '平台收入',
            dataIndex: 'cost_amount',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
            valueType: 'money',
          },
          {
            title: '收入类型',
            dataIndex: 'cost_type_text',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
          },
          {
            title: '订单编号',
            dataIndex: 'order_no',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
            copyable: true,
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
        ]}
      />
    </PageContainer>
  );
};

export default AccountsReconciliation;
