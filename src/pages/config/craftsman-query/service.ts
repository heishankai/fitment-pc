import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取工匠列表
 */
export const getCraftsmanListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/craftsman-user/page', data);
};

/**
 * 删除工匠
 */
export const deleteCraftsmanQueryService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/craftsman-user/${id}`);
};

/**
 * 获取实名认证信息
 */
export const getIsVerifiedInfoService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.get(`/is-verified/user/${id}`);
};

/**
 * 获取实名认证信息
 */
export const getIsSkillVerifiedInfoService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.get(`/is-skill-verified/user/${id}`);
};
