import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取商品列表
 */
export const getCommodityListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/commodity-config/page', data);
};

/**
 * 创建商品
 */
export const createCommodityService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  console.log(data, 'datas');

  return await request.post('/commodity-config', data);
};

/**
 * 编辑商品
 */
export const editCommodityService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/commodity-config/${id}`, data);
};

/**
 * 删除商品
 */
export const deleteCommodityService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/commodity-config/${id}`);
};
