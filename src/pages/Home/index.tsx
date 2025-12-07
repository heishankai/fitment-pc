import React from 'react';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Spin } from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';
// components
import CollectCard from './components/CollectCard';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
// service
import { getHomeStatisticsService } from './service';
// styles
import { StyledDivider } from '@/styles/styled';
import { theme } from '@/styles/theme';

const StyledPageContainer = styled(PageContainer)`
  background: ${theme.gradients.page};
`;

const Home: React.FC = () => {
  const { loading, data: homeStatisticsData } = useRequest(() =>
    getHomeStatisticsService({ month: dayjs().format('YYYY-MM') }),
  );

  const cardData = homeStatisticsData?.data?.card;
  const orderDailyChart = homeStatisticsData?.data?.order_daily_chart;
  const chartData =
    orderDailyChart?.x && orderDailyChart?.y
      ? {
          x: orderDailyChart.x,
          y: orderDailyChart.y,
        }
      : undefined;
  const pieData = homeStatisticsData?.data?.order_pie_chart || [];

  return (
    <StyledPageContainer>
      <Spin spinning={loading}>
        <CollectCard cardData={cardData} />
        <StyledDivider />
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <LineChart data={chartData} loading={loading} />
          </Col>
          <Col xs={24} lg={8}>
            <PieChart data={pieData} loading={loading} />
          </Col>
        </Row>
      </Spin>
    </StyledPageContainer>
  );
};

export default Home;
