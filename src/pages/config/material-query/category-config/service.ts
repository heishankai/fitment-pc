import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建类目
 */
export const createCategoryService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/category-config', data);
};

/**
 * 获取类目列表
 */
export const getCategoryListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/category-config/page', data);
};

/**
 * 根据id获取类目
 */
export const getCategoryByIdService = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await request.get(`/category-config/${id}`);
};

/**
 * 删除类目
 */
export const deleteCategoryService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/category-config/${id}`);
};

/**
 * 编辑类目
 */
export const editCategoryService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/category-config/${id}`, data);
};
