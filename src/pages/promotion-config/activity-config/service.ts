import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取活动列表
 */
export const getActivityListService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/activity');
};

/**
 * 根据ID查询活动详情
 */
export const getActivityDetailService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.get(`/activity/${id}`);
};

/**
 * 创建活动
 */
export const createActivityService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/activity', data);
};

/**
 * 更新活动
 */
export const editActivityService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/activity/${id}`, data);
};

/**
 * 删除活动
 */
export const deleteActivityService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/activity/${id}`);
};

/**
 * 更新活动排序
 */
export const updateActivitySortService = async (
  ids: number[],
): Promise<ApiResponse<any>> => {
  return await request.put('/activity/sort', { ids });
};
