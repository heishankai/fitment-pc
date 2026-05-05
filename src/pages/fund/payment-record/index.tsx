import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type {
  ActionType,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  Button,
  Descriptions,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { EyeOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { getProTableConfig } from '@/utils/proTable';
import {
  exportMaterialPaymentDetailsService,
  exportPaymentRecordPageService,
  getPaymentRecordPageService,
} from './service';

const paymentTypeValueEnum = {
  materials: { text: '辅材' },
  platform_service_fee: { text: '平台服务费' },
  gangmaster_cost: { text: '工长费' },
  work_price: { text: '工价' },
  order: { text: '订单费用' },
};

const paymentTypeColorMap: Record<string, string> = {
  materials: 'green',
  platform_service_fee: 'blue',
  gangmaster_cost: 'purple',
  work_price: 'cyan',
  order: 'gold',
};

const formatMoney = (value: any) => `¥${(Number(value) || 0).toFixed(2)}`;

const formatTime = (value: any) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-';

const getPaymentTypeText = (record: any) =>
  record?.payment_type_text ||
  paymentTypeValueEnum[
    record?.payment_type as keyof typeof paymentTypeValueEnum
  ]?.text ||
  '付款';

const getPaymentContent = (record: any) => {
  const materialCount = record?.materials_snapshot?.length || 0;
  const workPriceCount = record?.work_price_items_snapshot?.length || 0;

  if (materialCount > 0) return `辅材 ${materialCount} 项`;
  if (workPriceCount > 0) return `工价 ${workPriceCount} 项`;
  return record?.description || '-';
};

const PaymentRecordPage = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const [detailRecord, setDetailRecord] = useState<any>(null);

  const { loading: exportLoading, run: exportRecords } = useRequest(
    exportPaymentRecordPageService,
    {
      manual: true,
      onSuccess: () => message.success({ content: '业主付款明细导出成功' }),
    },
  );
  const { loading: exportMaterialLoading, run: exportMaterialDetails } =
    useRequest(exportMaterialPaymentDetailsService, {
      manual: true,
      onSuccess: () => message.success({ content: '辅材明细导出成功' }),
    });

  const handleExport = async () => {
    const values = await tableFormRef.current?.getFieldsValue();
    exportRecords(values);
  };

  const handleExportMaterialDetails = async () => {
    const values = await tableFormRef.current?.getFieldsValue();
    exportMaterialDetails(values);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '订单编号',
      dataIndex: 'order_no',
      hideInTable: true,
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入订单编号',
      },
    },
    {
      title: '付款类型',
      dataIndex: 'payment_type',
      hideInTable: true,
      valueType: 'select',
      valueEnum: paymentTypeValueEnum,
      fieldProps: {
        allowClear: true,
        placeholder: '请选择付款类型',
      },
    },
    {
      title: '付款时间',
      dataIndex: 'payment_time',
      hideInTable: true,
      valueType: 'dateRange',
      fieldProps: {
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '付款类型',
      dataIndex: 'payment_type_text',
      hideInSearch: true,
      width: 130,
      render: (_, record) => (
        <Tag color={paymentTypeColorMap[record?.payment_type] || 'default'}>
          {getPaymentTypeText(record)}
        </Tag>
      ),
    },
    {
      title: '业务金额',
      dataIndex: 'payment_amount',
      hideInSearch: true,
      width: 120,
      valueType: 'money',
    },
    {
      title: '微信实付',
      dataIndex: 'wx_payment_amount',
      hideInSearch: true,
      width: 120,
      render: (_, record) =>
        record?.wx_payment_amount === null
          ? '-'
          : formatMoney(record.wx_payment_amount),
    },
    {
      title: '付款内容',
      dataIndex: 'description',
      hideInSearch: true,
      width: 180,
      ellipsis: true,
      render: (_, record) => getPaymentContent(record),
    },
    {
      title: '业主昵称',
      dataIndex: ['wechat_user', 'nickname'],
      hideInSearch: true,
      width: 140,
      ellipsis: true,
      render: (_, record) => record?.wechat_user?.nickname || '-',
    },
    {
      title: '业主手机号',
      dataIndex: ['wechat_user', 'phone'],
      hideInSearch: true,
      width: 140,
      ellipsis: true,
      render: (_, record) => record?.wechat_user?.phone || '-',
    },
    {
      title: '订单编号',
      dataIndex: 'order?.order_no',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
      copyable: true,
      render: (_, record) => (
        <Tooltip title={record?.order?.order_no}>
          {record?.order?.order_no}
        </Tooltip>
      ),
    },
    {
      title: '商户订单号',
      dataIndex: 'out_trade_no',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '付款时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
      width: 180,
      valueType: 'dateTime',
      proFieldProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => setDetailRecord(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        {...getProTableConfig({
          request: async (params) => {
            return await getPaymentRecordPageService(params);
          },
        })}
        rowKey="id"
        scroll={{ x: 1500 }}
        headerTitle={
          <Space>
            <Button
              type="primary"
              loading={exportLoading}
              icon={<VerticalAlignBottomOutlined />}
              onClick={handleExport}
            >
              导出付款明细
            </Button>
            <Button
              loading={exportMaterialLoading}
              icon={<VerticalAlignBottomOutlined />}
              onClick={handleExportMaterialDetails}
            >
              导出辅材明细
            </Button>
          </Space>
        }
        columns={columns}
      />

      <Modal
        title="付款明细"
        open={!!detailRecord}
        width={900}
        footer={null}
        onCancel={() => setDetailRecord(null)}
      >
        {detailRecord && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="付款类型">
                {getPaymentTypeText(detailRecord)}
              </Descriptions.Item>
              <Descriptions.Item label="业务金额">
                {formatMoney(detailRecord.payment_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="微信实付">
                {detailRecord.wx_payment_amount === null
                  ? '-'
                  : formatMoney(detailRecord.wx_payment_amount)}
              </Descriptions.Item>
              <Descriptions.Item label="付款时间">
                {formatTime(detailRecord.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="订单编号">
                {detailRecord.order_no || detailRecord.order?.order_no || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="业主">
                {detailRecord.wechat_user?.nickname || '-'} /{' '}
                {detailRecord.wechat_user?.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="商户订单号" span={2}>
                {detailRecord.out_trade_no || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="微信交易号" span={2}>
                {detailRecord.transaction_id || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="描述" span={2}>
                {detailRecord.description || '-'}
              </Descriptions.Item>
            </Descriptions>

            {!!detailRecord.materials_snapshot?.length && (
              <Table
                size="small"
                rowKey={(row: any, index) => row?.id ?? index}
                pagination={false}
                dataSource={detailRecord.materials_snapshot}
                columns={[
                  {
                    title: '辅材名称',
                    dataIndex: 'commodity_name',
                  },
                  {
                    title: '工种',
                    dataIndex: 'work_kind_name',
                    render: (text) => text || '-',
                  },
                  {
                    title: '数量',
                    dataIndex: 'quantity',
                    render: (text, record: any) =>
                      `${Number(text) || 0}${record?.commodity_unit || ''}`,
                  },
                  {
                    title: '结算金额',
                    dataIndex: 'settlement_amount',
                    render: (text) => formatMoney(text),
                  },
                ]}
              />
            )}

            {!!detailRecord.work_price_items_snapshot?.length && (
              <Table
                size="small"
                rowKey={(row: any, index) => row?.id ?? index}
                pagination={false}
                dataSource={detailRecord.work_price_items_snapshot}
                columns={[
                  {
                    title: '工价名称',
                    dataIndex: 'work_title',
                  },
                  {
                    title: '工种',
                    dataIndex: 'work_kind_name',
                    render: (text) => text || '-',
                  },
                  {
                    title: '数量',
                    dataIndex: 'quantity',
                    render: (text, record: any) =>
                      `${Number(text) || 0}${record?.labour_cost_name || ''}`,
                  },
                  {
                    title: '结算金额',
                    dataIndex: 'settlement_amount',
                    render: (text) => formatMoney(text),
                  },
                ]}
              />
            )}
          </Space>
        )}
      </Modal>
    </PageContainer>
  );
};

export default PaymentRecordPage;
