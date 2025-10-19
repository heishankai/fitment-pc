import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { Space, Button, Popconfirm, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
// components
import { CitySelect } from '@/components';
// service
import {
  getCraftsmanListService,
  deleteCraftsmanQueryService,
} from './service';
// components
import OperateModal from './components/OperateModal';

const Table = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const operateModalRef = useRef<any>(null);

  // 删除类目
  const handleDelete = async (id: string | number) => {
    const { success } = await deleteCraftsmanQueryService(id);
    if (success) {
      message.success('删除成功');
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
            return await getCraftsmanListService(params);
          },
        })}
        headerTitle={
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => operateModalRef.current.handleOpenModal('add')}
            >
              新增工匠
            </Button>
          </Space>
        }
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
          {
            title: '城市',
            dataIndex: 'city_code',
            hideInTable: true,
            renderFormItem: () => <CitySelect />,
          },
          // table字段
          {
            title: '工匠名称',
            dataIndex: 'craftsman_name',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
          },
          {
            title: '手机号',
            dataIndex: 'craftsman_phone',
            hideInSearch: true,
            width: 140,
            ellipsis: true,
          },
          {
            title: '年龄',
            dataIndex: 'craftsman_age',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '城市',
            dataIndex: 'city_name',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '技能描述',
            dataIndex: 'craftsman_skill',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '个人简介',
            dataIndex: 'craftsman_intro',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '个人荣誉说明',
            dataIndex: 'craftsman_honor',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '过往工作说明',
            dataIndex: 'craftsman_work_intro',
            hideInSearch: true,
            width: 150,
            ellipsis: true,
          },
          {
            title: '形象照',
            dataIndex: 'craftsman_image',
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
            title: '个人荣誉照片',
            dataIndex: 'craftsman_honor_images',
            hideInSearch: true,
            width: 150,
            render: (_: any, record: any) => {
              return (
                <Space>
                  <Image
                    width={40}
                    height={40}
                    src={record?.craftsman_honor_images?.[0]}
                  />

                  <span style={{ fontSize: '12px', color: '#666' }}>
                    +{record?.craftsman_honor_images?.length - 1}
                  </span>
                </Space>
              );
            },
          },
          {
            title: '技能证书',
            dataIndex: 'craftsman_skill_certificate',
            hideInSearch: true,
            width: 150,
            render: (_: any, record: any) => {
              return (
                <Space>
                  <Image
                    width={40}
                    height={40}
                    src={record?.craftsman_skill_certificate?.[0]}
                  />

                  <span style={{ fontSize: '12px', color: '#666' }}>
                    +{record?.craftsman_skill_certificate?.length - 1}
                  </span>
                </Space>
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
                    description={`确定要删除工匠吗？`}
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
      <OperateModal ref={operateModalRef} tableFormRef={tableFormRef} />
    </PageContainer>
  );
};

export default Table;
