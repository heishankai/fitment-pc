import request from '@/utils/request';
import type { ApiResponse } from '@/types';

export interface SkillRelationItem {
  id: number;
  userId: number;
  relatedCraftsmanUserId?: number | null;
  promise_image?: Array<{ url: string }>;
  operation_video?: Array<{ url: string }>;
  work_kind_code?: string;
  work_kind_name?: string;
  work_years?: string;
  skill_intro?: string;
  createdAt?: string;
  updatedAt?: string;
  isSkillVerified?: boolean;
  nickname?: string;
  phone?: string;
  avatar?: string;
}

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

/**
 * 根据技能认证ID查询从属关系
 */
export const getSkillVerifiedRelationService = async (
  id: string | number,
): Promise<ApiResponse<SkillRelationItem[]>> => {
  return await request.get(`/is-skill-verified/relation/${id}`);
};
