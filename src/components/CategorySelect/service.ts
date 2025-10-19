import request from '@/utils/request';
import { ApiResponse } from '@/types';

/**
 * 获取类目数据
 */
export const getCategoryDataService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/category-config');
};
