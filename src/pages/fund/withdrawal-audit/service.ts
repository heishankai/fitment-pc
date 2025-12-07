import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 分页查询提现申请列表
 */
export const getWithdrawListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/withdraw/query', data);
};

/**
 * 审核提现申请
 */
export const auditWithdrawService = async (data: {
  withdraw_id: number;
  status: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/withdraw/audit', data);
};
