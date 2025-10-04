import request from '@/utils/request';
import { ApiResponse } from '@/utils/request';

// 用户数据类型定义
export interface UserData {
  active: boolean;
  avatar: string;
  role: string;
  username: string;
  token: string;
}

/**
 * 登录
 */
export const loginService = (data: any): Promise<ApiResponse<UserData>> => {
  return request.post('/admin/login', data);
};


export const getUserInfoService = (): Promise<ApiResponse<UserData>> => {
  return request.get('/admin/users/info');
};