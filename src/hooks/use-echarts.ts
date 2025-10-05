import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const useEcharts = (option: any, loading: boolean = false) => {
  const chartRef = useRef<echarts.ECharts | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 初始化图表
    chartRef.current = echarts.init(containerRef.current);

    // 设置配置
    if (option) {
      chartRef.current.setOption(option);
    }

    // 自动调整大小
    const resizeObserver = new ResizeObserver(() => {
      chartRef.current?.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current?.dispose();
    };
  }, []);

  // 当option变化时更新图表
  useEffect(() => {
    if (chartRef.current && option) {
      chartRef.current.setOption(option);
    }
  }, [option]);

  // 处理loading状态
  useEffect(() => {
    if (!chartRef.current) return;

    if (loading) {
      chartRef.current.showLoading();
    } else {
      chartRef.current.hideLoading();
    }
  }, [loading]);

  return containerRef;
};

export default useEcharts;
