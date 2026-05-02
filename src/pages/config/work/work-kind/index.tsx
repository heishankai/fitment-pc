import React, { useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { Space, Button, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer, DragSortTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
// service
import {
  deleteWorkKindService,
  getWorkKindListService,
  sortWorkKindService,
} from './service';

// components
import OperateModal from './components/OperateModal';

const WorkKind = () => {
  const operateModalRef = useRef<any>(null);
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const [dataSource, setDataSource] = useState<any>([]);

  // 分页
  const { loading, refresh: pageRefresh } = useRequest(getWorkKindListService, {
    onSuccess: ({ success, data }) => {
      if (!success) return;
      setDataSource([...data]);
    },
  });

  // 排序
  const { loading: sortLoaing, run: sortRun } = useRequest(
    sortWorkKindService,
    {
      manual: true,
      onSuccess: ({ success }) => {
        if (!success) return;
        pageRefresh();
        message.success('修改排序成功');
      },
    },
  );

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    const ids = (newDataSource || [])?.map((item: any) => item?.id);
    sortRun({ ids });
  };

  // 删除类目
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteWorkKindService(id);
    if (success) {
      message.success('删除成功');
      actionRef.current?.reload();
    }
  };

  return (
    <PageContainer>
      <DragSortTable
        actionRef={actionRef}
        formRef={tableFormRef}
        loading={loading || sortLoaing}
        search={false}
        pagination={false}
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: 900 }}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
        headerTitle={
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => operateModalRef.current.handleOpenModal('add')}
            >
              新增工种
            </Button>
          </Space>
        }
        columns={[
          {
            title: '排序',
            dataIndex: 'sort',
            width: 60,
            className: 'drag-visible',
          },
          {
            title: '工种名称',
            dataIndex: 'work_kind_name',
            hideInSearch: true,
            width: 120,
            ellipsis: true,
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
            title: '操作',
            valueType: 'option',
            width: 180,
            fixed: 'right',
            align: 'center',
            render: (text: any, record: any) => {
              return (
                <Space>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() =>
                      operateModalRef.current.handleOpenModal('edit', record)
                    }
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除"
                    description={`确定要删除工种吗？`}
                    onConfirm={() => handleDelete(record?.id)}
                  >
                    <Button type="link" icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
      <OperateModal ref={operateModalRef} actionRef={actionRef} />
    </PageContainer>
  );
};

export default WorkKind;
