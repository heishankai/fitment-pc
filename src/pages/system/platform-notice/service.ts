import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 创建公告
 */
export const createPlatformNoticeService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/platform-notice', data);
};

/**
 * 获取公告列表
 */
export const getPlatformNoticeListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/platform-notice/page', data);
};

/**
 * 根据id获取公告
 */
export const getPlatformNoticeByIdService = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await request.get(`/platform-notice/${id}`);
};

/**
 * 删除公告
 */
export const deletePlatformNoticeService = async (
  id: string | number,
): Promise<ApiResponse<any>> => {
  return await request.delete(`/platform-notice/${id}`);
};

/**
 * 编辑公告
 */
export const editPlatformNoticeService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/platform-notice/${id}`, data);
};
