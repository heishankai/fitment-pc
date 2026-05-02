import React, { useRef } from 'react';
import { Space, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  ScheduleOutlined,
  UserOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { getOrderListService, getAllWorkTypeService } from './service';
import {
  WorkPriceModal,
  SubWorkPriceModal,
  ConstructionProgressModal,
  WechatUserModal,
  CraftsmanUserModal,
  MaterialsListModal,
  AddOrderModal,
} from './components';

const ClientOrderQuery = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  const workPriceModalRef = useRef<any>();
  const subWorkPriceModalRef = useRef<any>();
  const addOrderModalRef = useRef<any>();
  const constructionProgressModalRef = useRef<any>();
  const wechatUserModalRef = useRef<any>();
  const craftsmanUserModalRef = useRef<any>();
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
        search={{ labelWidth: 88, defaultColsNumber: 8 }}
        headerTitle={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              addOrderModalRef?.current?.handleOpenModal?.('add');
            }}
          >
            新增订单
          </Button>
        }
        columns={[
          // search字段
          {
            title: '订单编号',
            dataIndex: 'order_no',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '订单类型',
            dataIndex: 'order_type',
            hideInTable: true,
            width: 100,
            ellipsis: true,
            valueType: 'radio',
            valueEnum: {
              gangmaster: '工长单',
              craftsman: '工匠单',
            },
          },
          {
            title: '订单状态',
            dataIndex: 'order_status',
            hideInTable: true,
            valueType: 'select',
            fieldProps: {
              options: [
                { label: '待接单', value: 1 },
                { label: '已接单', value: 2 },
                { label: '已完成', value: 3 },
                { label: '已取消', value: 4 },
              ],
            },
          },
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
            title: '工匠手机号',
            dataIndex: 'craftsman_user_phone',
            hideInTable: true,
            valueType: 'text',
          },
          {
            title: '业主手机号',
            dataIndex: 'wechat_user_phone',
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
            title: '订单编号',
            dataIndex: 'order_no',
            hideInSearch: true,
            width: 300,
            ellipsis: true,
            copyable: true,
          },
          {
            title: '订单类型',
            dataIndex: 'order_type',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
            valueEnum: {
              gangmaster: '工长单',
              craftsman: '工匠单',
            },
          },
          {
            title: '工种',
            dataIndex: 'work_kind_name',
            hideInSearch: true,
            width: 100,
            render: (_, record: any) => {
              const { workKindName } = record?.craftsman_user ?? {};
              return workKindName;
            },
          },
          {
            title: '工匠手机号',
            dataIndex: 'craftsman_user',
            hideInSearch: true,
            width: 130,
            render: (_, record: any) => {
              const { phone } = record?.craftsman_user ?? {};
              return phone;
            },
          },
          {
            title: '业主手机号',
            dataIndex: 'wechat_user',
            hideInSearch: true,
            width: 130,
            render: (_, record: any) => {
              const { phone } = record?.wechat_user ?? {};
              return phone;
            },
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
            title: '城市',
            dataIndex: 'city',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '平台服务费',
            dataIndex: 'total_service_fee',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
            valueType: 'money',
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
            width: 290,
            fixed: 'right',
            align: 'left',
            render: (text: any, record: any) => {
              const moreMenuItems: MenuProps['items'] = [
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
                    size="small"
                    onClick={() => {
                      workPriceModalRef.current?.handleOpenModal(record);
                    }}
                  >
                    工价
                  </Button>
                  <Button
                    type="link"
                    key="workPrice"
                    icon={<DollarOutlined />}
                    style={{ padding: 0 }}
                    size="small"
                    onClick={() => {
                      subWorkPriceModalRef.current?.handleOpenModal(record);
                    }}
                  >
                    子工价
                  </Button>

                  <Button
                    type="link"
                    key="materialsList"
                    icon={<ShoppingOutlined />}
                    size="small"
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
                      size="small"
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
      {/* 工价弹窗 */}
      <WorkPriceModal ref={workPriceModalRef} />

      {/* 子工价弹窗 */}
      <SubWorkPriceModal ref={subWorkPriceModalRef} />

      {/* 辅材弹窗 */}
      <MaterialsListModal ref={materialsListModalRef} />

      {/* 施工进度弹窗 */}
      <ConstructionProgressModal ref={constructionProgressModalRef} />

      {/* 业主弹窗 */}
      <WechatUserModal ref={wechatUserModalRef} />

      {/* 工匠弹窗 */}
      <CraftsmanUserModal ref={craftsmanUserModalRef} />

      {/* 新增订单弹窗 */}
      <AddOrderModal ref={addOrderModalRef} actionRef={actionRef} />
    </PageContainer>
  );
};

export default ClientOrderQuery;
