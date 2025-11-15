import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建工种
 */
export const createLabourCostService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/labour-cost', data);
};

/**
 * 获取工种列表
 */
export const getLabourCostListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/labour-cost/page', data);
};

/**
 * 编辑工种
 */
export const editLabourCostService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/labour-cost/${id}`, data);
};

/**
 * 删除工种
 */
export const deleteLabourCostService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/labour-cost/${id}`);
};
