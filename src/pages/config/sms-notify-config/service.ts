import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/** 三类通知共用同一组号码（与后端约定字段名） */
export type SmsNotifyPhonesPayload = {
  phones: string[];
};

/**
 * 获取短信通知号码配置
 */
export const getSmsNotifyConfigService = async (): Promise<
  ApiResponse<SmsNotifyPhonesPayload>
> => {
  return await request.get('/sms-notify-config');
};

/**
 * 保存短信通知号码配置
 */
export const saveSmsNotifyConfigService = async (
  data: SmsNotifyPhonesPayload,
): Promise<ApiResponse<unknown>> => {
  return await request.put('/sms-notify-config', data);
};
