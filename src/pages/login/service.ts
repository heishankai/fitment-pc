import request from '@/utils/request';
import { ApiResponse } from '@/utils/request';

// 用户数据类型定义
interface UserData {
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
