import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建全屋装修配置
 */
export const createWholeHouseConfigService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/whole-house-config', data);
};

/**
 * 编辑全屋装修配置
 */
export const editWholeHouseConfigService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/whole-house-config/${id}`, data);
};

/**
 * 获取全屋装修配置列表
 */
export const getWholeHouseConfigListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/whole-house-config/page', data);
};

/**
 * 删除全屋装修配置
 */
export const deleteWholeHouseConfigService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/whole-house-config/${id}`);
};
