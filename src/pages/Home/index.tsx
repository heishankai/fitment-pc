import React, { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { PageContainer } from '@ant-design/pro-components';
import { theme, Card, Row, Col, Tag, Space, Typography, Divider } from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
// components
import CollectCard from './components/CollectCard';
// service
import { getAllUserService } from './service';
// utils
import { useEcharts } from '@/hooks';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  const { data, loading: statsLoading } = useRequest(getAllUserService);
  console.log(data, 'data');

  const { token } = theme.useToken();

  // Mock数据
  const chartData = {
    x: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
    y: [120, 200, 150, 80, 70, 110, 130],
  };

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

  // 饼图数据
  const pieData = [
    { value: 335, name: '已完成' },
    { value: 310, name: '进行中' },
    { value: 234, name: '待处理' },
    { value: 135, name: '已取消' },
  ];

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
    <PageContainer
      title={
        <Space align="center">
          <BarChartOutlined
            style={{ color: token.colorPrimary, fontSize: 24 }}
          />
          <Title level={3} style={{ margin: 0, color: token.colorText }}>
            叮当智装仪表盘
          </Title>
        </Space>
      }
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      {/* 统计卡片 */}
      <CollectCard />

      <Divider style={{ margin: '32px 0' }} />

      {/* 图表区域 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined style={{ color: token.colorPrimary }} />
                <span>订单走势图</span>
              </Space>
            }
            extra={
              <Tag color="blue" icon={<LineChartOutlined />}>
                近一周
              </Tag>
            }
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div
              ref={containerRef}
              style={{
                width: '100%',
                height: '400px',
                borderRadius: 8,
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined style={{ color: token.colorPrimary }} />
                <span>订单状态分布</span>
              </Space>
            }
            extra={
              <Tag color="blue" icon={<PieChartOutlined />}>
                近一周
              </Tag>
            }
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
              height: '100%',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div
              ref={pieContainerRef}
              style={{
                width: '100%',
                height: '400px',
                borderRadius: 8,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作区域 */}
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <Title level={4} style={{ color: 'white', marginBottom: 16 }}>
              快速创建订单
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              一键创建新的装修订单，开始您的装修之旅
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <Title level={4} style={{ color: 'white', marginBottom: 16 }}>
              查看项目进度
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              实时跟踪您的装修项目进展，掌握每个细节
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: 'none',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <Title level={4} style={{ color: 'white', marginBottom: 16 }}>
              联系客服
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              专业客服团队为您提供7x24小时贴心服务
            </Text>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Home;
