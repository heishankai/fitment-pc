import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取工匠列表
 */
export const getCraftsmanListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/craftsman-query/page', data);
};

/**
 * 创建工匠
 */
export const createCraftsmanQueryService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/craftsman-query', data);
};

/**
 * 编辑工匠
 */
export const editCraftsmanQueryService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/craftsman-query/${id}`, data);
};

/**
 * 删除工匠
 */
export const deleteCraftsmanQueryService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/craftsman-query/${id}`);
};
