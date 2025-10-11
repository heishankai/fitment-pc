import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建案例
 */
export const createCaseService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/case-query', data);
};

/**
 * 获取案例列表
 */
export const getCaseListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/case-query/page', data);
};

/**
 * 根据id获取案例
 */
export const getCaseByIdService = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await request.get(`/case-query/${id}`);
};

/**
 * 删除案例
 */
export const deleteCaseService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/case-query/${id}`);
};

/**
 * 编辑案例
 */
export const editCaseService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/case-query/${id}`, data);
};
