import React, { useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { PageContainer, DragSortTable } from '@ant-design/pro-components';
import type {
  ActionType,
  ProFormInstance,
  ProColumns,
} from '@ant-design/pro-components';
import { Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getActivityListService,
  deleteActivityService,
  updateActivitySortService,
} from './service';
import OperateModal from './components/OperateModal';

const ActivityConfig = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>(null);
  const [dataSource, setDataSource] = useState<any[]>([]);

  // 加载数据
  const { run: loadData, loading: loadingData } = useRequest(
    getActivityListService,
    {
      manual: false,
      onSuccess: (response) => {
        const data = response?.data || [];
        // 确保数据是数组格式
        const list = Array.isArray(data) ? data : [];
        // 为每个数据项添加 sort 字段（如果后端没有返回）
        const formattedData = list.map((item: any, index: number) => ({
          ...item,
          sort: item.sort ?? index + 1,
        }));
        setDataSource(formattedData);
      },
      onError: (error: any) => {
        message.error(error?.message || '加载数据失败');
      },
    },
  );

  // 删除活动
  const { run: handleDelete, loading: deleting } = useRequest(
    (id: string | number) => deleteActivityService(id),
    {
      manual: true,
      onSuccess: () => {
        message.success('删除成功');
        loadData();
      },
      onError: (error: any) => {
        message.error(error?.message || '删除失败');
      },
    },
  );

  // 更新排序
  const { run: updateSort, loading: updatingSort } = useRequest(
    (ids: number[]) => updateActivitySortService(ids),
    {
      manual: true,
      onSuccess: () => {
        message.success('修改列表排序成功');
        // 成功后刷新数据
        loadData();
      },
      onError: (error: any) => {
        message.error(error?.message || '更新排序失败');
        // 失败时刷新数据恢复原状态
        loadData();
      },
    },
  );

  // 拖拽排序结束
  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    // 提取 ids 数组，按照新顺序
    const ids = newDataSource.map((item: any) => item.id);

    // 发送到后端
    updateSort(ids);
  };

  const columns: ProColumns<any>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      className: 'drag-visible',
    },
    {
      title: '活动图片',
      dataIndex: 'image',
      width: 150,
      hideInSearch: true,
      valueType: 'image',
      fieldProps: {
        width: 50,
        height: 50,
      },
      className: 'drag-visible',
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
      className: 'drag-visible',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
      width: 300,
    },
    {
      title: '链接文本',
      dataIndex: 'linkText',
      ellipsis: true,
      hideInSearch: true,
      width: 150,
    },
    {
      title: '链接URL',
      dataIndex: 'linkUrl',
      ellipsis: true,
      hideInSearch: true,
      width: 250,
      render: (_, record) => {
        const text = record.linkUrl;
        if (text) {
          return (
            <a href={text} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          );
        }
        return '-';
      },
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
          <Popconfirm
            title="确定要删除这条活动吗？"
            description="此操作不可恢复，请谨慎操作"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <DragSortTable
        headerTitle="活动管理"
        actionRef={actionRef}
        formRef={tableFormRef}
        columns={columns}
        rowKey="id"
        search={false}
        pagination={false}
        scroll={{ x: 900 }}
        dataSource={dataSource}
        loading={loadingData || deleting || updatingSort}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            icon={<PlusOutlined />}
            onClick={() => operateModalRef.current?.handleOpenModal('add')}
          >
            新增活动
          </Button>,
        ]}
      />

      <OperateModal
        ref={operateModalRef}
        actionRef={actionRef}
        onSuccess={loadData}
      />
    </PageContainer>
  );
};

export default ActivityConfig;
