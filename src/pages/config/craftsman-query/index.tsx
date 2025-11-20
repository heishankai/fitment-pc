import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { Space, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import IsVerifiedModal from './components/IsVerifiedModal';
import IsSkillVerifiedModal from './components/IsSkillVerifiedModal';
// service
import { getCraftsmanListService } from './service';

const Table = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();

  const isVerifiedModalRef = useRef<any>(null);
  const isSkillVerifiedModalRef = useRef<any>(null);

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        rowKey="id"
        scroll={{ x: 900 }}
        {...getProTableConfig({
          request: async (params) => {
            return await getCraftsmanListService(params);
          },
        })}
        columns={[
          // search字段
          {
            title: '工匠名称',
            dataIndex: 'craftsman_name',
            hideInTable: true,
          },
          {
            title: '手机号',
            dataIndex: 'craftsman_phone',
            hideInTable: true,
          },
          // table字段
          {
            title: '工匠名称',
            dataIndex: 'nickname',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
          },
          {
            title: '头像',
            dataIndex: 'avatar',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
            valueType: 'image',
            fieldProps: {
              width: 40,
              height: 40,
            },
          },
          {
            title: '是否实名认证',
            dataIndex: 'isVerified',
            hideInSearch: true,
            width: 150,
            valueEnum: {
              true: { text: '是', status: 'Success' },
              false: { text: '否', status: 'Error' },
            },
          },
          {
            title: '是否技能认证',
            dataIndex: 'isSkillVerified',
            hideInSearch: true,
            width: 150,
            valueEnum: {
              true: { text: '是', status: 'Success' },
              false: { text: '否', status: 'Error' },
            },
          },
          {
            title: '个人主页是否通过审核',
            dataIndex: 'isHomePageVerified',
            hideInSearch: true,
            width: 200,
            valueEnum: {
              true: { text: '是', status: 'Success' },
              false: { text: '否', status: 'Error' },
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
            title: '操作',
            valueType: 'option',
            width: 300,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              return (
                <Space>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() =>
                      isVerifiedModalRef.current?.handleOpenModal(record)
                    }
                  >
                    实名认证信息
                  </Button>
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() =>
                      isSkillVerifiedModalRef.current?.handleOpenModal(record)
                    }
                  >
                    技能认证信息
                  </Button>
                </Space>
              );
            },
          },
        ]}
      />
      <IsVerifiedModal ref={isVerifiedModalRef} />
      <IsSkillVerifiedModal ref={isSkillVerifiedModalRef} />
    </PageContainer>
  );
};

export default Table;
