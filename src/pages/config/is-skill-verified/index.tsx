import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { Space, Button, Popconfirm, message } from 'antd';
import { CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
// service
import {
  getIsSkillVerifiedListService,
  isSkillVerifiedApproveService,
} from './service';
// components
import DetailModal from './components/DetailModal';
import { WorkKindSelect } from '@/components';

const Table = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const detailModalRef = useRef<any>(null);

  // 确认认证通过
  const handleOk = async (userId: string | number) => {
    const { success } = await isSkillVerifiedApproveService(userId);
    if (success) {
      message.success('认证通过');
      tableFormRef.current?.submit();
    }
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        rowKey="id"
        scroll={{ x: 1200 }}
        {...getProTableConfig({
          request: async (params) => {
            const { data, ...rest } = await getIsSkillVerifiedListService({
              ...params,
              workKindId: params?.workKindId
                ? String(params?.workKindId)
                : undefined,
            });

            return {
              ...rest,
              data: (data || []).map((item: any) => {
                const { promise_image, operation_video } = item ?? {};
                return {
                  ...item,
                  // 表格显示用：只显示第一张图片/第一个视频
                  promise_image: promise_image?.[0]?.url,
                  operation_video: operation_video?.[0]?.url,
                };
              }),
            };
          },
        })}
        columns={[
          // search字段
          {
            title: '工种',
            dataIndex: 'workKindId',
            hideInTable: true,
            renderFormItem: () => <WorkKindSelect />,
          },
          // table字段
          {
            title: '工种名称',
            dataIndex: 'workKindName',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '承诺图片',
            dataIndex: 'promise_image',
            hideInSearch: true,
            width: 200,
            valueType: 'image',
            fieldProps: {
              width: 150,
              height: 100,
            },
          },
          {
            title: '操作视频',
            dataIndex: 'operation_video',
            hideInSearch: true,
            width: 200,
            render: (_: any, record: any) => {
              const videoUrl = record?.operation_video;
              if (!videoUrl) return '-';
              return (
                <video
                  src={videoUrl}
                  controls
                  style={{ width: 150, height: 100 }}
                >
                  您的浏览器不支持视频播放
                </video>
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
            title: '是否通过认证',
            dataIndex: 'isSkillVerified',
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
            width: 220,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              const { isSkillVerified, userId } = record ?? {};
              return (
                <Space>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() =>
                      detailModalRef.current?.handleOpenModal(record)
                    }
                  >
                    查看详情
                  </Button>
                  {!isSkillVerified && (
                    <Popconfirm
                      title="确认通过认证吗？"
                      onConfirm={() => handleOk(userId)}
                    >
                      <Button type="link" icon={<CheckCircleOutlined />}>
                        通过
                      </Button>
                    </Popconfirm>
                  )}
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
