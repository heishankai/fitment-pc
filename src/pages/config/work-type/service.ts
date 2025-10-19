import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建工种
 */
export const createWorkTypeService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/work-type', data);
};

/**
 * 编辑工种
 */
export const editWorkTypeService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/work-type/${id}`, data);
};

/**
 * 获取工种列表
 */
export const getWorkTypeListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/work-type/page', data);
};

/**
 * 删除工种
 */
export const deleteWorkTypeService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/work-type/${id}`);
};

/**
 * 根据id获取工种
 */
export const getWorkTypeByIdService = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await request.get(`/work-type/${id}`);
};
