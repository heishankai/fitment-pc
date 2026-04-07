import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取工艺小程序用户列表
 */
export const getProcessUserListService = async (data: {
  pageIndex: number;
  pageSize: number;
  phone?: string;
}): Promise<ApiResponse<any>> => {
  return await request.post('/craft-wechat-user/page', data);
};

/**
 * 确认联系成功
 */
export const getProcessContactService = async (
  id: number,
): Promise<ApiResponse<any>> => {
  return await request.patch(`/craft-wechat-user/${id}/contact`);
};
