import React from 'react';
import { useRequest } from 'ahooks';
import { PageContainer, ProTable } from '@ant-design/pro-components';
// service
import { getAllUserService } from './service';

const Home: React.FC = () => {
  const { data: statsData, loading: statsLoading } =
    useRequest(getAllUserService);

  return <PageContainer title="仪表盘">11</PageContainer>;
};

export default Home;
