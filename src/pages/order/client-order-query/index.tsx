import React, { useRef } from 'react';
import { Space, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  MoreOutlined,
  UserAddOutlined,
  ScheduleOutlined,
  UserOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { getOrderListService, getAllWorkTypeService } from './service';
import {
  WorkPriceModal,
  ConstructionProgressModal,
  WechatUserModal,
  CraftsmanUserModal,
  AssignOrderModal,
  MaterialsListModal,
} from './components';

const ClientOrderQuery = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const workPriceModalRef = useRef<any>();
  const constructionProgressModalRef = useRef<any>();
  const wechatUserModalRef = useRef<any>();
  const craftsmanUserModalRef = useRef<any>();
  const assignOrderModalRef = useRef<any>();
  const materialsListModalRef = useRef<any>();

  const { data: workTypeOptions, loading: workTypeLoading } = useRequest(
    getAllWorkTypeService,
  );

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        formRef={tableFormRef}
        {...getProTableConfig({
          request: async (params) => {
            return await getOrderListService(params);
          },
        })}
        rowKey="id"
        scroll={{ x: 900 }}
        columns={[
          // search字段
          {
            title: '工种',
            dataIndex: 'work_kind_name',
            hideInTable: true,
            valueType: 'select',
            fieldProps: {
              showSearch: true,
              loading: workTypeLoading,
              fieldNames: { label: 'work_kind_name', value: 'work_kind_name' },
              options: workTypeOptions?.data ?? [],
            },
          },
          {
            title: '工匠昵称',
            dataIndex: 'craftsman_user_name',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '业主昵称',
            dataIndex: 'wechat_user_name',
            valueType: 'text',
            hideInTable: true,
          },
          {
            title: '下单时间',
            dataIndex: 'date_range',
            valueType: 'dateRange',
            hideInTable: true,
            proFieldProps: {
              format: 'YYYY-MM-DD',
            },
          },
          // show
          {
            title: '工种',
            dataIndex: 'work_kind_name',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '城市',
            dataIndex: 'city',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '面积',
            dataIndex: 'area',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '房屋类型',
            dataIndex: 'houseType',
            hideInSearch: true,
            width: 100,
            valueEnum: {
              new: '新房',
              old: '老房',
            },
          },
          {
            title: '户型',
            dataIndex: 'roomType',
            hideInSearch: true,
            width: 100,
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
            title: '订单状态',
            dataIndex: 'order_status',
            hideInSearch: true,
            width: 90,
            fixed: 'right',
            valueEnum: {
              1: { text: '待接单', status: 'Default' },
              2: { text: '已接单', status: 'Processing' },
              3: { text: '已完成', status: 'Success' },
              4: { text: '已取消', status: 'Error' },
            },
          },
          {
            title: '操作',
            valueType: 'option',
            width: 280,
            fixed: 'right',
            align: 'left',
            render: (text: any, record: any) => {
              // 只有待接单状态的订单才显示指派按钮
              const canAssign = record?.order_status === 1;

              const moreMenuItems: MenuProps['items'] = [
                ...(canAssign
                  ? [
                      {
                        key: 'assign',
                        label: '指派订单',
                        icon: <UserAddOutlined />,
                        onClick: () => {
                          assignOrderModalRef.current?.handleOpenModal(record);
                        },
                      },
                    ]
                  : []),
                {
                  key: 'constructionProgress',
                  label: '施工进度',
                  icon: <ScheduleOutlined />,
                  onClick: () => {
                    constructionProgressModalRef.current?.handleOpenModal(
                      record,
                    );
                  },
                },
                {
                  key: 'wechatUser',
                  label: '查看业主',
                  icon: <UserOutlined />,
                  onClick: () => {
                    wechatUserModalRef.current?.handleOpenModal(record);
                  },
                },
                {
                  key: 'craftsmanUser',
                  label: '查看工匠',
                  icon: <TeamOutlined />,
                  onClick: () => {
                    craftsmanUserModalRef.current?.handleOpenModal(record);
                  },
                },
              ];

              return (
                <Space size="small">
                  <Button
                    type="link"
                    key="workPrice"
                    icon={<DollarOutlined />}
                    style={{ padding: 0 }}
                    onClick={() => {
                      workPriceModalRef.current?.handleOpenModal(record);
                    }}
                  >
                    查看工价
                  </Button>
                  <Button
                    type="link"
                    key="materialsList"
                    icon={<ShoppingOutlined />}
                    style={{ padding: 0 }}
                    onClick={() => {
                      materialsListModalRef.current?.handleOpenModal(record);
                    }}
                  >
                    辅材清单
                  </Button>
                  <Dropdown
                    menu={{ items: moreMenuItems }}
                    trigger={['click', 'hover']}
                  >
                    <Button
                      type="link"
                      icon={<MoreOutlined />}
                      style={{ padding: 0 }}
                      onClick={(e) => e.preventDefault()}
                    >
                      更多...
                    </Button>
                  </Dropdown>
                </Space>
              );
            },
          },
        ]}
      />
      <WorkPriceModal ref={workPriceModalRef} tableFormRef={tableFormRef} />
      <MaterialsListModal
        ref={materialsListModalRef}
        tableFormRef={tableFormRef}
      />
      <ConstructionProgressModal ref={constructionProgressModalRef} />
      <WechatUserModal ref={wechatUserModalRef} />
      <CraftsmanUserModal ref={craftsmanUserModalRef} />
      <AssignOrderModal
        ref={assignOrderModalRef}
        onSuccess={() => {
          // 指派成功后刷新列表
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default ClientOrderQuery;
