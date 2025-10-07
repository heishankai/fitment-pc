import React, { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { theme, Row, Col, Tag, Divider, Empty, Image } from 'antd';
import { LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import styled from 'styled-components';
// components
import CollectCard from './components/CollectCard';
// service
import { getAllUserService } from './service';
// utils
import { useEcharts } from '@/hooks';

// Styled Components
const StyledPageContainer = styled(PageContainer)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const StyledDivider = styled(Divider)`
  margin: 32px 0;
`;

const ChartCard = styled.div`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
  background: white;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const ChartCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ChartTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;

  .anticon {
    color: #1890ff;
  }
`;

const ChartTag = styled(Tag)`
  border-radius: 6px;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 8px;
`;

const EmptyContainer = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Home: React.FC = () => {
  const { data, loading: statsLoading } = useRequest(getAllUserService);
  console.log(data, 'data');

  const { token } = theme.useToken();

  // 柱状图数据 - 可以设置为空数组来测试空数据状态
  const chartData: { x: string[]; y: number[] } = {
    x: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
    y: [120, 200, 150, 80, 70, 110, 130],
  };

  // 饼图数据 - 可以设置为空数组来测试空数据状态
  const pieData: Array<{ value: number; name: string }> = [
    { value: 335, name: '已完成' },
    { value: 310, name: '进行中' },
    { value: 234, name: '待处理' },
    { value: 135, name: '已取消' },
  ];

  // 检查数据是否为空
  const isChartDataEmpty = !chartData.x?.length || !chartData.y?.length;
  const isPieDataEmpty = !pieData?.length;

  // 构建ECharts配置
  const chartOption = useMemo(() => {
    return {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: token.colorPrimary,
        borderWidth: 1,
        textStyle: {
          color: '#333',
        },
      },
      xAxis: {
        type: 'category',
        data: chartData.x,
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
          },
        },
        axisLabel: {
          interval: 0,
          color: '#666',
          fontSize: 12,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed',
          },
        },
      },
      series: [
        {
          data: chartData.y,
          type: 'bar',
          barWidth: '50%',
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: token.colorPrimary },
                { offset: 1, color: `${token.colorPrimary}80` },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: token.colorPrimary,
              shadowBlur: 10,
              shadowColor: `${token.colorPrimary}40`,
            },
          },
        },
      ],
    };
  }, [chartData, token.colorPrimary]);

  const containerRef = useEcharts(chartOption, statsLoading);

  // 饼图配置
  const pieOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: '5%',
        top: 'middle',
        textStyle: {
          color: '#666',
        },
      },
      series: [
        {
          name: '订单状态',
          type: 'pie',
          radius: ['35%', '60%'],
          center: ['65%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: pieData,
        },
      ],
    };
  }, [pieData]);

  const pieContainerRef = useEcharts(pieOption, statsLoading);

  return (
    <StyledPageContainer>
      {/* 统计卡片 */}
      <CollectCard />

      <StyledDivider />

      {/* 图表区域 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <ChartCard>
            <ChartCardHeader>
              <ChartTitle>
                <LineChartOutlined style={{ color: token.colorPrimary }} />
                <span>订单走势图</span>
              </ChartTitle>
              <ChartTag color="blue" icon={<LineChartOutlined />}>
                近一周
              </ChartTag>
            </ChartCardHeader>
            {isChartDataEmpty ? (
              <EmptyContainer>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ color: '#999' }}
                />
              </EmptyContainer>
            ) : (
              <ChartContainer ref={containerRef} />
            )}
          </ChartCard>
        </Col>

        <Col xs={24} lg={8}>
          <ChartCard style={{ height: '100%' }}>
            <ChartCardHeader>
              <ChartTitle>
                <PieChartOutlined style={{ color: token.colorPrimary }} />
                <span>订单状态分布</span>
              </ChartTitle>
              <ChartTag color="blue" icon={<PieChartOutlined />}>
                近一周
              </ChartTag>
            </ChartCardHeader>
            {isPieDataEmpty ? (
              <EmptyContainer>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无数据"
                  style={{ color: '#999' }}
                />
              </EmptyContainer>
            ) : (
              <ChartContainer ref={pieContainerRef} />
            )}
          </ChartCard>
        </Col>
      </Row>
      <Image src="https://din-dang-zhi-zhuang.oss-cn-hangzhou.aliyuncs.com/uploads/1759739087831_ynhwdp_%E6%88%AA%E5%B1%8F2023-09-09%2000.33.49.png" />
    </StyledPageContainer>
  );
};

export default Home;
