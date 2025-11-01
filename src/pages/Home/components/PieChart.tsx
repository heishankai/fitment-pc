import React, { useMemo } from 'react';
import { theme } from 'antd';
import { Empty } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
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

interface PieDataItem {
  value: number;
  name: string;
}

interface PieChartProps {
  data?: PieDataItem[];
  loading?: boolean;
  title?: string;
  timeRange?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data = [],
  loading = false,
  title = '订单状态分布',
  timeRange = '近一周',
}) => {
  const { token } = theme.useToken();
  const isEmpty = !data?.length;

  const pieOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: '5%',
        top: 'middle',
        textStyle: { color: '#666' },
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
          label: { show: false, position: 'center' },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          labelLine: { show: false },
          data: data,
        },
      ],
    }),
    [data],
  );

  const containerRef = useEcharts(pieOption, loading);

  return (
    <Card style={{ height: '100%' }}>
      <ChartHeader>
        <ChartTitle>
          <PieChartOutlined style={{ color: token.colorPrimary }} />
          <span>{title}</span>
        </ChartTitle>
        <Tag color="blue" icon={<PieChartOutlined />}>
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

export default PieChart;
