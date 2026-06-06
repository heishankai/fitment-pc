import request from '@/utils/request';
import type { ApiResponse } from '@/types';

export type CustomerServiceConfig = {
  id?: number;
  avatar?: string;
  welcome_text?: string;
  welcome_image?: string;
  updatedAt?: string;
};

export const getCustomerServiceConfigService = async (): Promise<
  ApiResponse<CustomerServiceConfig>
> => {
  return await request.get('/customer-service-config');
};

export const saveCustomerServiceConfigService = async (
  data: CustomerServiceConfig,
): Promise<ApiResponse<unknown>> => {
  return await request.put('/customer-service-config', data);
};
