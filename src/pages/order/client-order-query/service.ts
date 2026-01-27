import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取订单列表
 */
export const getOrderListService = async (
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/order/query', data);
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
 * 确认辅材支付（旧接口，保留兼容）
 */
export const payMaterialsService = async (data: {
  order_id: number;
  materials_id: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/materials/confirm-payment', data);
};

/**
 * 确认单个辅材支付（更新支付状态）
 */
export const confirmMaterialPaymentService = async (
  materialId: number,
): Promise<ApiResponse<any>> => {
  return await request.put(`/materials/${materialId}/confirm-payment`);
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

/**
 * 分配工匠给工价项（仅工长订单）
 */
export const assignCraftsmanService = async (data: {
  orderId: number;
  workPricesIndex?: number;
  subWorkPricesIndex?: number;
  pricesItemIndex: number;
  craftsmanUserId: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/order/assign-craftsman', data);
};

/**
 * 根据订单ID获取订单详情
 */
export const getOrderByIdService = async (
  orderId: number,
): Promise<ApiResponse<any>> => {
  return await request.get(`/order/${orderId}`);
};

/**
 * 根据订单ID获取子工价列表
 */
export const getSubWorkPriceByOrderId = async (
  orderId: number,
): Promise<ApiResponse<any>> => {
  return await request.get(`/order/${orderId}/sub-groups`);
};

/**
 * 确认单个工价项支付
 */
export const payPriceItemService = async (
  workPriceItemId: number,
): Promise<ApiResponse<any>> => {
  return await request.put(`/work-price-item/${workPriceItemId}/pay`);
};

/**
 * 批量分配工匠给工价项
 */
export const batchAssignCraftsmanService = async (data: {
  parent_order_id: number;
  work_price_list: number[];
  craftsman_id: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/order/assign-work-prices', data);
};

/**
 * 支付平台服务费
 */
export const payPlatformServiceFeeService = async (
  orderId: number,
): Promise<ApiResponse<any>> => {
  return await request.put(`/order/${orderId}/service-fee/pay`);
};

/**
 * 子工价支付平台服务费
 */
export const subPayPlatformServiceFeeService = async (data: {
  work_price_item_id: number;
}): Promise<ApiResponse<any>> => {
  return await request.post(`/order/confirm-work-price-service-fee`, data);
};

/**
 * 一键支付辅材
 */
export const allConfirmMaterialPaymentService = async (data: {
  orderId: number;
}): Promise<ApiResponse<any>> => {
  return await request.post(`/materials/batch-payment`, data);
};

/**
 * 一键验收辅材
 */
export const allConfirmMaterialAcceptService = async (
  orderId: number,
): Promise<ApiResponse<any>> => {
  return await request.post(`/materials/batch-accept-by-order/${orderId}`);
};

/**
 * 创建订单
 */
export const createOrderService = async (data: {
  area: number;
  houseType: string;
  roomType: number;
  location: string;
  craftsman_user_id: number;
  wechat_user_id: number;
}): Promise<ApiResponse<any>> => {
  return await request.post('/order/admin', data);
};

/**
 * 获取所有微信用户
 */
export const getAllWechatUsersService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/wechat/wechat-user');
};
