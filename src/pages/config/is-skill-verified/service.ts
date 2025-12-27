import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取技能认证分页
 */
export const getIsSkillVerifiedListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/is-skill-verified/page', data);
};

/**
 * 确认认证通过
 */
export const isSkillVerifiedApproveService = async (
  userId: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/is-skill-verified/approve/${userId}`);
};

/**
 * 确认认证不通过
 */
export const isSkillVerifiedRejectService = async (
  userId: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/is-skill-verified/reject/${userId}`);
};
