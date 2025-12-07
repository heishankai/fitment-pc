import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取首页统计数据
 */
export const getHomeStatisticsService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.get('/home/statistics', { params: data });
};
