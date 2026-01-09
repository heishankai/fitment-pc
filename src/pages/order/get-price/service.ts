import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建获取报价
 */
export const createGetPriceService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/get-price', data);
};

/**
 * 获取获取报价列表
 */
export const getGetPriceListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/get-price/page', data);
};

/**
 * 根据id获取获取报价
 */
export const getGetPriceByIdService = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await request.get(`/get-price/${id}`);
};

/**
 * 删除获取报价
 */
export const deleteGetPriceService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/get-price/${id}`);
};

/**
 * 编辑获取报价
 */
export const editGetPriceService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/get-price/${id}`, data);
};
