import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建工种
 */
export const createWorkKindService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/work-kind', data);
};

/**
 * 获取工种列表
 */
export const getWorkKindListService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/work-kind');
};

/**
 * 编辑工种
 */
export const editWorkKindService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/work-kind/${id}`, data);
};

/**
 * 删除工种
 */
export const deleteWorkKindService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/work-kind/${id}`);
};

/**
 * 拖拽排序
 */
export const sortWorkKindService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/work-kind/sort`, data);
};
