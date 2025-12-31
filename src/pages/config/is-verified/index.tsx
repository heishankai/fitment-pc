import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { Space, Button, Popconfirm, message } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
// service
import {
  getIsVerifiedListService,
  isVerifiedApproveService,
  isVerifiedRejectService,
} from './service';
// components
import DetailModal from './components/DetailModal';

const Table = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const detailModalRef = useRef<any>(null);

  // 确认认证通过
  const handleOk = async (userId: string | number) => {
    const { success } = await isVerifiedApproveService(userId);
    if (success) {
      message.success('认证通过');
      tableFormRef.current?.submit();
    }
  };

  // 确认认证不通过
  const handleReject = async (userId: string | number) => {
    const { success } = await isVerifiedRejectService(userId);
    if (success) {
      message.success('认证不通过');
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
            const { data, ...rest } = await getIsVerifiedListService(params);
            console.log(data, 'data');

            return {
              ...rest,
              data: (data || []).map((item: any) => {
                const { card_reverse_image, card_front_image } = item ?? {};
                return {
                  ...item,
                  // 表格显示用：只显示第一张图片
                  card_front_image: card_front_image?.[0]?.url,
                  card_reverse_image: card_reverse_image?.[0]?.url,
                };
              }),
            };
          },
        })}
        columns={[
          // search字段
          {
            title: '证件名称',
            dataIndex: 'card_name',
            hideInTable: true,
          },
          {
            title: '用户昵称',
            dataIndex: 'nickname',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInTable: true,
            valueType: 'text',
          },
          // table字段
          {
            title: '用户名称',
            dataIndex: 'nickname',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '用户手机号',
            dataIndex: 'phone',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '证件名称',
            dataIndex: 'card_name',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '证件号码',
            dataIndex: 'card_number',
            hideInSearch: true,
            width: 200,
            ellipsis: true,
          },
          {
            title: '证件住址',
            dataIndex: 'card_address',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
          },
          {
            title: '有效期开始日期',
            dataIndex: 'card_start_date',
            hideInSearch: true,
            width: 200,
            ellipsis: true,
          },
          {
            title: '有效期结束日期',
            dataIndex: 'card_end_date',
            hideInSearch: true,
            width: 200,
            ellipsis: true,
          },
          {
            title: '证件正面图片',
            dataIndex: 'card_front_image',
            hideInSearch: true,
            width: 120,
            valueType: 'image',
            fieldProps: {
              width: 50,
              height: 50,
            },
          },
          {
            title: '证件反面图片',
            dataIndex: 'card_reverse_image',
            hideInSearch: true,
            width: 120,
            valueType: 'image',
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
            title: '是否通过认证',
            dataIndex: 'isVerified',
            hideInSearch: true,
            width: 110,
            fixed: 'right',
            valueEnum: {
              true: { text: '是', status: 'Success' },
              false: { text: '否', status: 'Error' },
            },
          },
          {
            title: '操作',
            valueType: 'option',
            width: 250,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              const { userId } = record ?? {};
              return (
                <Space>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    style={{ padding: 0 }}
                    onClick={() =>
                      detailModalRef.current?.handleOpenModal(record)
                    }
                  >
                    查看详情
                  </Button>

                  <Popconfirm
                    title="确认通过认证吗？"
                    onConfirm={() => handleOk(userId)}
                  >
                    <Button
                      type="link"
                      icon={<CheckCircleOutlined />}
                      style={{ padding: 0 }}
                    >
                      通过
                    </Button>
                  </Popconfirm>

                  <Popconfirm
                    title="确认不通过认证吗？"
                    onConfirm={() => handleReject(userId)}
                  >
                    <Button
                      type="link"
                      icon={<CloseCircleOutlined />}
                      style={{ padding: 0 }}
                    >
                      不通过
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
      <DetailModal ref={detailModalRef} />
    </PageContainer>
  );
};

export default Table;
