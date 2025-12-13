import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取订单列表
 */
export const getOrderListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  // 处理日期范围参数：格式化 date_range 数组中的日期
  const params = { ...data };

  if (
    params.date_range &&
    Array.isArray(params.date_range) &&
    params.date_range.length === 2
  ) {
    // 格式化日期为 YYYY-MM-DD 格式
    const formatDate = (date: any) => {
      if (!date) return '';
      // 如果是 moment 对象，使用 format 方法
      if (date.format) {
        return date.format('YYYY-MM-DD');
      }
      // 如果是 Date 对象，转换为字符串
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      // 如果已经是字符串，直接返回
      return String(date);
    };

    // 格式化 date_range 数组中的日期
    params.date_range = [
      formatDate(params.date_range[0]),
      formatDate(params.date_range[1]),
    ];
  }

  return await request.post('/order/query', params);
};

/**
 * 获取所有工种
 */
export const getAllWorkTypeService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/work-kind');
};

/**
 * 获取所有工匠用户
 */
export const getAllCraftsmanUsersService = async (): Promise<
  ApiResponse<any>
> => {
  return await request.get('/craftsman-user/all');
};

/**
 * 指派订单给工匠
 */
export const assignOrderService = async (data: {
  orderId: number;
  craftsmanUserId: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/order/assign', data);
};

/**
 * 主工价支付
 */
export const payService = async (data: {
  order_id: number;
  pay_type: 'work_prices' | 'sub_work_prices';
  subItem?: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/order/confirm-payment', data);
};

/**
 * 确认辅材支付
 */
export const payMaterialsService = async (data: {
  order_id: number;
  materials_id: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/materials/confirm-payment', data);
};

/**
 * 根据订单ID获取施工进度
 */
export const getConstructionProgressByOrderId = async (
  orderId: number,
): Promise<ApiResponse<any>> => {
  return await request.get(`/construction-progress/order/${orderId}`);
};

/**
 * 根据订单ID获取辅材列表
 */
export const getMaterialsByOrderId = async (
  orderId: number,
): Promise<ApiResponse<any>> => {
  return await request.get(`/materials/order/${orderId}`);
};
