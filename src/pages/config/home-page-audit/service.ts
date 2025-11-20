import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取首页审核分页
 */
export const getHomePageAuditListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/home-page-audit/page', data);
};

/**
 * 确认审核通过
 */
export const homePageAuditApproveService = async (
  userId: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/home-page-audit/approve/${userId}`);
};
