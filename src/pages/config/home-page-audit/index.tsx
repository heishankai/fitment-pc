import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { Space, Button, Popconfirm, message, Image } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
// service
import {
  getHomePageAuditListService,
  homePageAuditApproveService,
  homePageAuditRejectService,
} from './service';
// components
import DetailModal from './components/DetailModal';

const Table = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const detailModalRef = useRef<any>(null);

  // 确认审核通过
  const handleOk = async (id: string | number) => {
    const { success } = await homePageAuditApproveService(id);
    if (success) {
      message.success('审核通过');
      tableFormRef.current?.submit();
    }
  };

  // 确认审核不通过
  const handleReject = async (userId: string | number) => {
    const { success } = await homePageAuditRejectService(userId);
    if (success) {
      message.success('审核不通过');
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
            const { data, ...rest } = await getHomePageAuditListService(params);

            return {
              ...rest,
              data: (data || []).map((item: any) => {
                const { awards_image } = item ?? {};
                return {
                  ...item,
                  // 保存原始数据用于详情展示
                  _originalAwardsImage: awards_image,
                  // 表格显示用：只显示第一张图片
                  awards_image: awards_image?.[0]?.url,
                };
              }),
            };
          },
        })}
        columns={[
          // search字段
          {
            title: '用户昵称',
            dataIndex: 'nickname',
            hideInTable: true,
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInTable: true,
          },
          // table字段
          {
            title: '用户昵称',
            dataIndex: 'nickname',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '简介',
            dataIndex: 'publish_text',
            hideInSearch: true,
            width: 200,
            ellipsis: true,
          },
          {
            title: '图片',
            dataIndex: 'publish_images',
            hideInSearch: true,
            width: 200,
            valueType: 'image',
            fieldProps: {
              width: 100,
              height: 100,
            },
            render: (_, row) => {
              const src = row?.publish_images?.[0];
              if (!src) return '-';
              return <Image src={src} width={50} height={50} />;
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
            title: '是否通过审核',
            dataIndex: 'status',
            hideInSearch: true,
            width: 110,
            fixed: 'right',
            valueEnum: {
              1: { text: '审核通过', status: 'success' },
              2: { text: '审核中', status: 'default' },
              3: { text: '审核失败', status: 'error' },
            },
          },
          {
            title: '操作',
            valueType: 'option',
            width: 260,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              const { id } = record ?? {};
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
                    title="确认通过审核吗？"
                    onConfirm={() => handleOk(id)}
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
                    title="确认不通过审核吗？"
                    onConfirm={() => handleReject(id)}
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
