import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取欢迎页配置列表
 */
export const getWelcomeListService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/welcome');
};

/**
 * 创建欢迎页配置
 */
export const createWelcomeService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/welcome', data);
};

/**
 * 编辑欢迎页配置
 */
export const editWelcomeService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/welcome/${id}`, data);
};
