import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建工价
 */
export const createWorkTypeService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/work-type', data);
};

/**
 * 编辑工价
 */
export const editWorkTypeService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/work-type/${id}`, data);
};

/**
 * 获取工价列表
 */
export const getWorkTypeListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/work-type/page', data);
};

/**
 * 删除工价
 */
export const deleteWorkTypeService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/work-type/${id}`);
};

/**
 * 根据id获取工价
 */
export const getWorkTypeByIdService = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await request.get(`/work-type/${id}`);
};

/**
 * 获取所有工种
 */
export const getAllWorkKindService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/work-kind');
};

/**
 * 获取所有单位
 */
export const getAllLabourCostsService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/labour-cost');
};
