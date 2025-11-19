import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取实名认证分页
 */
export const getIsVerifiedListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/is-verified/page', data);
};

/**
 * 确认认证通过
 */
export const isVerifiedApproveService = async (
  userId: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/is-verified/approve/${userId}`);
};
