import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProFormInstance } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getProTableConfig } from '@/utils/proTable';
import { getWelcomeListService } from './service';
import OperateModal from './components/OperateModal';

const WelcomeConfig = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>(null);

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        {...getProTableConfig({
          request: async () => {
            const response = await getWelcomeListService();
            // 将返回的对象转换为数组格式
            const data = response?.data;
            return {
              ...response,
              data: Array.isArray(data) ? data : data ? [data] : [],
              total: Array.isArray(data) ? data.length : data ? 1 : 0,
            };
          },
        })}
        search={false}
        rowKey="id"
        scroll={{ x: 1200 }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            icon={<PlusOutlined />}
            onClick={() => operateModalRef.current?.handleOpenModal('add')}
          >
            新增欢迎页配置
          </Button>,
        ]}
        columns={[
          {
            title: 'Logo',
            dataIndex: 'logo',
            width: 150,
            hideInSearch: true,
            valueType: 'image',
            fieldProps: {
              width: 80,
              height: 80,
            },
          },
          {
            title: '背景图片',
            dataIndex: 'background_image',
            width: 150,
            hideInSearch: true,
            valueType: 'image',
            fieldProps: {
              width: 100,
              height: 100,
            },
          },
          {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
            hideInSearch: true,
            width: 150,
          },
          {
            title: '副标题',
            dataIndex: 'subtitle',
            ellipsis: true,
            hideInSearch: true,
            width: 200,
          },
          {
            title: '倒计时（单位：秒）',
            dataIndex: 'count_down',
            hideInSearch: true,
            width: 200,
          },
          {
            title: '版权信息',
            dataIndex: 'copyright',
            ellipsis: true,
            hideInSearch: true,
            width: 200,
          },
          {
            title: '操作',
            valueType: 'option',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
              <Space>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() =>
                    operateModalRef.current?.handleOpenModal('edit', record)
                  }
                >
                  编辑
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <OperateModal ref={operateModalRef} actionRef={actionRef} />
    </PageContainer>
  );
};

export default WelcomeConfig;
