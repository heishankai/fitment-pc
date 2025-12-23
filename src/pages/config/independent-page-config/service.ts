import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取独立页面配置
 */
export const getInspectionConfig = async (): Promise<ApiResponse<any>> => {
  return await request.get('/independent-page-config');
};

/**
 * 保存独立页面配置
 */
export const saveInspectionConfig = async (
  id: string | number,
  data: {
    price: string | number;
    title: string;
    content: string;
  },
): Promise<ApiResponse<any>> => {
  return await request.patch(`/independent-page-config/${id}`, data);
};
/**
 * 创建独立页面配置
 */
export const createInspectionConfig = async (
  data: {
    price: string | number;
    title: string;
    content: string;
  },
): Promise<ApiResponse<any>> => {
  return await request.post('/independent-page-config', data);
};