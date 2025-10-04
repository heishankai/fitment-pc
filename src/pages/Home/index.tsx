import React from 'react';
import { useRequest } from 'ahooks';
import { PageContainer, ProTable } from '@ant-design/pro-components';

import { getAllUserService } from './service';
import { Button } from 'antd';

const Home: React.FC = () => {
  const { data: statsData, loading: statsLoading } =
    useRequest(getAllUserService);

  return (
    <PageContainer title="仪表盘">
      <Button type="primary">11</Button>
      <ProTable />
    </PageContainer>
  );
};

export default Home;
