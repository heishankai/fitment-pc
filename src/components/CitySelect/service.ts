import request from '@/utils/request';
import { ApiResponse } from '@/types';

/**
 * 获取城市数据
 */
export const getCityDataService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/city');
};
