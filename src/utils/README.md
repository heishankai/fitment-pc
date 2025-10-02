# Axios 请求工具

这是一个基于 Axios 封装的请求工具，提供了统一的请求配置、错误处理、加载状态管理等功能。

## 特性

- 🚀 基于 Axios 的现代化请求库
- 🔐 自动处理认证 token
- 📱 统一的错误处理和用户提示
- ⏳ 智能加载状态管理
- 🎯 TypeScript 完整类型支持
- 🔄 请求/响应拦截器
- 📁 文件上传/下载支持
- 🛡️ 错误重试机制
- 📊 请求日志记录

## 安装

```bash
pnpm add axios
```

## 基础使用

```typescript
import request from '@/utils/request';

// GET 请求
const response = await request.get('/api/users');
console.log(response.data.data);

// POST 请求
const newUser = await request.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT 请求
const updatedUser = await request.put('/api/users/1', {
  name: 'Jane Doe'
});

// DELETE 请求
await request.delete('/api/users/1');
```

## 高级配置

### 请求配置选项

```typescript
interface RequestConfig {
  showLoading?: boolean;    // 是否显示加载状态 (默认: true)
  showError?: boolean;      // 是否显示错误信息 (默认: true)
  showSuccess?: boolean;    // 是否显示成功信息 (默认: false)
  successMessage?: string;  // 成功提示信息
  timeout?: number;         // 请求超时时间
  headers?: Record<string, string>; // 自定义请求头
}
```

### 使用示例

```typescript
// 带配置的请求
const response = await request.get('/api/users', {
  showLoading: true,
  showError: true,
  showSuccess: true,
  successMessage: '数据加载成功！',
  timeout: 5000,
});

// 静默请求（不显示任何提示）
const response = await request.get('/api/users', {
  showLoading: false,
  showError: false,
});
```

## 文件操作

### 文件上传

```typescript
// 上传单个文件
const file = document.querySelector('input[type="file"]').files[0];
const response = await request.upload('/api/upload', file);

// 上传多个文件
const formData = new FormData();
formData.append('file1', file1);
formData.append('file2', file2);
const response = await request.upload('/api/upload', formData);
```

### 文件下载

```typescript
// 下载文件
await request.download('/api/files/report.pdf', 'report.pdf');
```

## 认证管理

### 设置 Token

```typescript
// 设置认证 token
request.setToken('your-jwt-token');

// 设置到 sessionStorage
request.setToken('your-jwt-token', 'sessionStorage');
```

### 清除 Token

```typescript
// 清除所有 token
request.clearToken();
```

## 环境配置

### 设置基础 URL

```typescript
// 开发环境
request.setBaseURL('/api');

// 生产环境
request.setBaseURL('https://api.example.com/api');
```

### 设置默认请求头

```typescript
request.setDefaultHeader('X-Custom-Header', 'custom-value');
```

## 错误处理

工具会自动处理以下错误情况：

- **400**: 请求参数错误
- **401**: 未授权，自动跳转登录页
- **403**: 拒绝访问
- **404**: 资源不存在
- **500**: 服务器内部错误
- **502**: 网关错误
- **503**: 服务不可用
- **超时**: 请求超时
- **网络错误**: 网络连接失败

### 自定义错误处理

```typescript
try {
  const response = await request.get('/api/users');
  return response.data.data;
} catch (error) {
  // 自定义错误处理
  console.error('请求失败:', error);
  // 可以在这里添加自定义的错误处理逻辑
  throw error;
}
```

## 响应数据格式

工具期望后端返回以下格式的数据：

```typescript
interface ApiResponse<T> {
  success: boolean;      // 请求是否成功
  data: T;              // 业务数据
  errorMessage?: string; // 错误信息
  errorCode?: string | number; // 错误代码
}
```

## 实际使用示例

### 用户管理 API

```typescript
// 获取用户列表
export const getUserList = async (params: {
  current?: number;
  pageSize?: number;
  keyword?: string;
}) => {
  const response = await request.get('/api/users', { params });
  return response.data.data;
};

// 创建用户
export const createUser = async (userData: {
  name: string;
  email: string;
}) => {
  const response = await request.post('/api/users', userData, {
    showSuccess: true,
    successMessage: '用户创建成功！',
  });
  return response.data.data;
};

// 更新用户
export const updateUser = async (id: string, userData: Partial<UserInfo>) => {
  const response = await request.put(`/api/users/${id}`, userData, {
    showSuccess: true,
    successMessage: '用户更新成功！',
  });
  return response.data.data;
};

// 删除用户
export const deleteUser = async (id: string) => {
  await request.delete(`/api/users/${id}`, {
    showSuccess: true,
    successMessage: '用户删除成功！',
  });
};
```

### 批量请求

```typescript
// 并行请求多个接口
export const getDashboardData = async () => {
  const [usersResponse, statsResponse] = await Promise.all([
    request.get('/api/users?pageSize=5'),
    request.get('/api/stats'),
  ]);

  return {
    users: usersResponse.data.data,
    stats: statsResponse.data.data,
  };
};
```

## 最佳实践

1. **统一错误处理**: 使用 try-catch 包装请求，提供统一的错误处理
2. **类型安全**: 为 API 响应定义 TypeScript 接口
3. **合理使用配置**: 根据场景选择合适的 showLoading、showError 等配置
4. **环境区分**: 在不同环境中使用不同的 baseURL
5. **Token 管理**: 及时设置和清除认证 token

## 注意事项

- 工具会自动在请求头中添加 `Authorization: Bearer <token>` 如果存在 token
- 401 错误会自动清除 token 并跳转到登录页
- 所有请求都会在控制台输出日志，便于调试
- 加载状态是全局管理的，多个并发请求会正确显示/隐藏加载状态

## 扩展

如果需要更高级的功能，可以：

1. 继承 `RequestUtil` 类创建自定义请求工具
2. 使用 `request.getInstance()` 获取原始 Axios 实例
3. 在拦截器中添加自定义逻辑

```typescript
// 获取原始 Axios 实例
const axiosInstance = request.getInstance();

// 添加自定义拦截器
axiosInstance.interceptors.request.use((config) => {
  // 自定义逻辑
  return config;
});
```

