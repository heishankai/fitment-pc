import { useEffect, useRef, useCallback } from 'react';
import * as echarts from 'echarts';

const useEcharts = (option: any, loading: boolean = false) => {
  const chartRef = useRef<echarts.ECharts | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const optionRef = useRef(option);

  // 更新 option ref
  useEffect(() => {
    optionRef.current = option;
  }, [option]);

  // 初始化图表
  const initChart = useCallback(() => {
    if (!containerRef.current || chartRef.current) return false;

    try {
      chartRef.current = echarts.init(containerRef.current);

      // 自动调整大小
      resizeObserverRef.current = new ResizeObserver(() => {
        chartRef.current?.resize();
      });
      resizeObserverRef.current.observe(containerRef.current);

      // 设置初始配置
      if (optionRef.current) {
        chartRef.current.setOption(optionRef.current, true);
      }

      return true;
    } catch (error) {
      console.error('ECharts initialization error:', error);
      return false;
    }
  }, []);

  // 当容器准备好时初始化图表
  const setContainer = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        containerRef.current = node;
        // 容器准备好后，如果图表未初始化且option存在，则初始化
        if (!chartRef.current && optionRef.current) {
          initChart();
        }
      } else {
        // 清理
        resizeObserverRef.current?.disconnect();
        chartRef.current?.dispose();
        chartRef.current = null;
        containerRef.current = null;
      }
    },
    [initChart],
  );

  // 当option变化时更新图表
  useEffect(() => {
    if (!chartRef.current) {
      // 如果图表未初始化但容器已准备好，先初始化
      if (containerRef.current && optionRef.current) {
        initChart();
      }
    } else if (optionRef.current && chartRef.current) {
      // 如果图表已初始化，更新配置
      chartRef.current.setOption(optionRef.current, true);
    }
  }, [option, initChart]);

  // 处理loading状态
  useEffect(() => {
    if (!chartRef.current) return;

    if (loading) {
      chartRef.current.showLoading();
    } else {
      chartRef.current.hideLoading();
    }
  }, [loading]);

  return setContainer;
};

export default useEcharts;
