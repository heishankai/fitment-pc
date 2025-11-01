import React, { useMemo } from 'react';
import { theme } from 'antd';
import { Empty } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import styled from 'styled-components';
import { useEcharts } from '@/hooks';
import { Card } from '@/styles/styled';

const ChartHeader = styled.div`
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

interface LineChartProps {
  data?: { x: string[]; y: number[] };
  loading?: boolean;
  title?: string;
  timeRange?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data = { x: [], y: [] },
  loading = false,
  title = '订单走势图',
  timeRange = '近一周',
}) => {
  const { token } = theme.useToken();
  const isEmpty = !data.x?.length || !data.y?.length;

  const chartOption = useMemo(
    () => ({
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
        textStyle: { color: '#333' },
      },
      xAxis: {
        type: 'category',
        data: data.x,
        axisLine: { lineStyle: { color: '#e8e8e8' } },
        axisLabel: { interval: 0, color: '#666', fontSize: 12 },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#666', fontSize: 12 },
        splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
      },
      series: [
        {
          data: data.y,
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
    }),
    [data, token.colorPrimary],
  );

  const containerRef = useEcharts(chartOption, loading);

  return (
    <Card>
      <ChartHeader>
        <ChartTitle>
          <LineChartOutlined style={{ color: token.colorPrimary }} />
          <span>{title}</span>
        </ChartTitle>
        <Tag color="blue" icon={<LineChartOutlined />}>
          {timeRange}
        </Tag>
      </ChartHeader>
      {isEmpty ? (
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
    </Card>
  );
};

export default LineChart;
