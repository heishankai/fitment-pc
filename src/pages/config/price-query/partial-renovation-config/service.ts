import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建局部改造配置
 */
export const createPartialRenovationConfigService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/partial-renovation-config', data);
};

/**
 * 编辑局部改造配置
 */
export const editPartialRenovationConfigService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/partial-renovation-config/${id}`, data);
};

/**
 * 获取局部改造配置列表
 */
export const getPartialRenovationConfigListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/partial-renovation-config/page', data);
};

/**
 * 删除局部改造配置
 */
export const deletePartialRenovationConfigService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/partial-renovation-config/${id}`);
};
