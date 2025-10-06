import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProFormInstance, ActionType } from '@ant-design/pro-components';
import { getProTableConfig } from '@/utils/proTable';
import { Image } from 'antd';
import { getCraftsmanListService } from './service';
const Table = () => {
  const actionRef = useRef<ActionType>();
  const tableFormRef = useRef<ProFormInstance>();
  return (
    <PageContainer>
      <Image src="https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1759739087831_ynhwdp_%E6%88%AA%E5%B1%8F2023-09-09%2000.33.49.png" />
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
            title: '姓名',
            dataIndex: 'craftsman_name',
            hideInTable: true,
            ellipsis: true,
          },
          {
            title: '手机号',
            dataIndex: 'craftsman_phone',
            hideInTable: true,
            ellipsis: true,
          },
          // table字段
          {
            title: '姓名',
            dataIndex: 'craftsman_name',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '手机号',
            dataIndex: 'craftsman_phone',
            hideInSearch: true,
            width: 100,
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
            dataIndex: 'craftsman_city',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
          {
            title: '简介',
            dataIndex: 'craftsman_intro',
            hideInSearch: true,
            width: 100,
            ellipsis: true,
          },
        ]}
      />
    </PageContainer>
  );
};

export default Table;
