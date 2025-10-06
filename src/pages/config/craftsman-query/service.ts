import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取工匠列表
 */
export const getCraftsmanListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/admin/craftsmen/page', data);
};
