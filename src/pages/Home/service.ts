import request from '@/utils/request';

/**
 * 获取用户列表
 * @returns
 */
export const getAllUserService = async () => {
  return await request.get('/admin/users');
};
