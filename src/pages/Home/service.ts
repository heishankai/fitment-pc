import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取用户列表
 * @returns Promise<ApiResponse<User[]>>
 */
export const getAllUserService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/admin/users');
};

/**
 * 获取今日统计数据
 * @returns Promise<ApiResponse<TodayData>>
 */
export const getTodayDataService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/admin/today');
};

/**
 * 最近一周订单走势图：（从当天往前获取7天）
 * @returns Promise<ApiResponse<OrderTrendData>>
 */
export const getOrderTrendService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/admin/week-order-trend');
};

/**
 * 获取订单状态分布饼图
 * @returns Promise<ApiResponse<OrderStatusDistribution>>
 */
export const getOrderStatusDistributionService = async (): Promise<
  ApiResponse<any>
> => {
  return await request.get('/admin/week-order-status-distribution');
};
