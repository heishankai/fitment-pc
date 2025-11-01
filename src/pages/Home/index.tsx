import React from 'react';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import styled from 'styled-components';
// components
import CollectCard from './components/CollectCard';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
// service
import { getAllUserService } from './service';
// styles
import { StyledDivider } from '@/styles/styled';
import { theme } from '@/styles/theme';

const StyledPageContainer = styled(PageContainer)`
  background: ${theme.gradients.page};
`;

// 模拟数据
const chartData = {
  x: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
  y: [120, 200, 150, 80, 70, 110, 130],
};

const pieData = [
  { value: 335, name: '已完成' },
  { value: 310, name: '进行中' },
  { value: 234, name: '待处理' },
  { value: 135, name: '已取消' },
];

const Home: React.FC = () => {
  const { loading: statsLoading } = useRequest(getAllUserService);

  return (
    <StyledPageContainer>
      <CollectCard />
      <StyledDivider />
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <LineChart data={chartData} loading={statsLoading} />
        </Col>
        <Col xs={24} lg={8}>
          <PieChart data={pieData} loading={statsLoading} />
        </Col>
      </Row>
    </StyledPageContainer>
  );
};

export default Home;
