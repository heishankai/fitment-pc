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
  id: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/home-page-audit/approve/${id}`);
};

/**
 * 确认审核不通过
 */
export const homePageAuditRejectService = async (
  userId: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/home-page-audit/reject/${userId}`);
};
