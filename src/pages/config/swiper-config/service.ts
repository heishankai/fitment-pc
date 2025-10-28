import request from '@/utils/request';
import type { ApiResponse } from '@/types';

/**
 * 获取轮播图列表
 */
export const getSwiperListService = async (): Promise<ApiResponse<any>> => {
  return await request.get('/swiper-config');
};

/**
 * 创建轮播图
 */
export const createSwiperService = async (
  _: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.post('/swiper-config', data);
};

/**
 * 编辑轮播图
 */
export const editSwiperService = async (
  id: string | number,
  data: any,
): Promise<ApiResponse<any>> => {
  return await request.put(`/swiper-config/${id}`, data);
};
