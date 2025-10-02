/**
 * Axios请求工具使用示例
 * 这个文件展示了如何使用request工具进行各种HTTP请求
 */

import request, { ApiResponse } from './request';

// 定义API响应数据类型
interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserListResponse {
  list: UserInfo[];
  total: number;
  current: number;
  pageSize: number;
}

// 示例1: 基础GET请求
export const getUserList = async (params: {
  current?: number;
  pageSize?: number;
  keyword?: string;
}) => {
  try {
    const response = await request.get<UserListResponse>('/api/users', {
      params,
      showLoading: true, // 显示加载状态
      showError: true,   // 显示错误信息
    });
    
    return response.data.data; // 返回业务数据
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 示例2: POST请求创建用户
export const createUser = async (userData: {
  name: string;
  email: string;
  avatar?: string;
}) => {
  try {
    const response = await request.post<UserInfo>('/api/users', userData, {
      showLoading: true,
      showSuccess: true,
      successMessage: '用户创建成功！',
    });
    
    return response.data.data;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
};

// 示例3: PUT请求更新用户
export const updateUser = async (id: string, userData: Partial<UserInfo>) => {
  try {
    const response = await request.put<UserInfo>(`/api/users/${id}`, userData, {
      showLoading: true,
      showSuccess: true,
      successMessage: '用户更新成功！',
    });
    
    return response.data.data;
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
};

// 示例4: DELETE请求删除用户
export const deleteUser = async (id: string) => {
  try {
    await request.delete(`/api/users/${id}`, {
      showLoading: true,
      showSuccess: true,
      successMessage: '用户删除成功！',
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
};

// 示例5: 文件上传
export const uploadAvatar = async (file: File) => {
  try {
    const response = await request.upload<{ url: string }>('/api/upload/avatar', file, {
      showLoading: true,
      showSuccess: true,
      successMessage: '头像上传成功！',
    });
    
    return response.data.data.url;
  } catch (error) {
    console.error('上传头像失败:', error);
    throw error;
  }
};

// 示例6: 文件下载
export const downloadUserReport = async (userId: string) => {
  try {
    await request.download(`/api/users/${userId}/report`, `user-${userId}-report.pdf`, {
      showLoading: true,
    });
  } catch (error) {
    console.error('下载用户报告失败:', error);
    throw error;
  }
};

// 示例7: 自定义配置的请求
export const getSensitiveData = async () => {
  try {
    const response = await request.get('/api/sensitive-data', {
      showLoading: false,  // 不显示加载状态
      showError: false,    // 不显示错误信息
      timeout: 30000,      // 30秒超时
    });
    
    return response.data.data;
  } catch (error) {
    // 手动处理错误
    console.error('获取敏感数据失败:', error);
    // 可以在这里添加自定义的错误处理逻辑
    throw error;
  }
};

// 示例8: 批量请求
export const getDashboardData = async () => {
  try {
    const [usersResponse, statsResponse, notificationsResponse] = await Promise.all([
      request.get<UserListResponse>('/api/users?pageSize=5'),
      request.get<{ totalUsers: number; activeUsers: number }>('/api/stats'),
      request.get<{ count: number; items: any[] }>('/api/notifications'),
    ]);

    return {
      users: usersResponse.data.data,
      stats: statsResponse.data.data,
      notifications: notificationsResponse.data.data,
    };
  } catch (error) {
    console.error('获取仪表板数据失败:', error);
    throw error;
  }
};

// 示例9: 使用token认证
export const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await request.post<{ token: string; user: UserInfo }>('/api/auth/login', credentials);
    
    const { token, user } = response.data.data;
    
    // 设置token到localStorage
    request.setToken(token);
    
    return { token, user };
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 示例10: 登出
export const logout = async () => {
  try {
    await request.post('/api/auth/logout');
  } catch (error) {
    console.error('登出请求失败:', error);
  } finally {
    // 清除本地token
    request.clearToken();
  }
};

// 示例11: 设置自定义请求头
export const setCustomHeaders = () => {
  request.setDefaultHeader('X-Custom-Header', 'custom-value');
  request.setDefaultHeader('X-Client-Version', '1.0.0');
};

// 示例12: 修改基础URL
export const switchEnvironment = (env: 'dev' | 'staging' | 'prod') => {
  const baseURLs = {
    dev: '/api',
    staging: 'https://staging-api.example.com/api',
    prod: 'https://api.example.com/api',
  };
  
  request.setBaseURL(baseURLs[env]);
};

// 示例13: 错误处理包装器
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('请求执行失败:', error);
      // 可以在这里添加全局错误处理逻辑
      // 比如发送错误到监控系统
      return null;
    }
  };
};

// 使用错误处理包装器的示例
export const safeGetUserList = withErrorHandling(getUserList);
export const safeCreateUser = withErrorHandling(createUser);

