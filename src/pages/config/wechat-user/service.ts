import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取微信用户分页列表
 */
export const getWechatUserListService = async (data: {
  pageIndex: number;
  pageSize: number;
  phone?: string;
  nickname?: string;
  city?: string;
}): Promise<ApiResponse<any>> => {
  return await request.post('/wechat/wechat-user/page', data);
};
