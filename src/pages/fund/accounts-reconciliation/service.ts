import request from '@/utils/request';
import { exportFile } from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 分页查询平台收入记录列表
 */
export const getPlatformIncomeRecordListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/platform-income-record/page', data);
};

/**
 * 导出平台收入记录列表为 Excel
 * @param data 查询参数（可选，不传则导出全部）
 */
export const exportPlatformIncomeRecordListService = async (
  data?: any,
): Promise<void> => {
  return await exportFile('/platform-income-record/export', data);
};
