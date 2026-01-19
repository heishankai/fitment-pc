import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProFormInstance } from '@ant-design/pro-components';
import { Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProTableConfig } from '@/utils/proTable';
import { getSwiperListService, deleteSwiperService } from './service';
import OperateModal from './components/OperateModal';

const SwiperConfig = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>(null);

  // 删除单个轮播图
  const handleDelete = async (id: string | number) => {
    try {
      const { success } = await deleteSwiperService(id);
      if (success) {
        message.success('删除成功');
        actionRef.current?.reload();
      }
    } catch (error: any) {
      message.error(error?.message || '删除失败');
    }
  };

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        {...getProTableConfig({
          request: async () => {
            return await getSwiperListService();
          },
        })}
        search={false}
        rowKey="id"
        scroll={{ x: 900 }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            icon={<PlusOutlined />}
            onClick={() => operateModalRef.current?.handleOpenModal('add')}
          >
            新增轮播图
          </Button>,
        ]}
        columns={[
          {
            title: '轮播图',
            dataIndex: 'swiper_image',
            width: 200,
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
          },
          {
            title: '描述',
            dataIndex: 'description',
            ellipsis: true,
            hideInSearch: true,
          },
          {
            title: '操作',
            valueType: 'option',
            width: 180,
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
                <Popconfirm
                  title="确定要删除这条轮播图吗？"
                  description="此操作不可恢复，请谨慎操作"
                  onConfirm={() => handleDelete(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                  >
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <OperateModal ref={operateModalRef} actionRef={actionRef} />
    </PageContainer>
  );
};

export default SwiperConfig;
