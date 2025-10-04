import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { notification } from 'antd';
import Cookies from 'js-cookie';
import storage from './storage';

// 响应数据类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  code: number;
  message?: string | null;
}

// 请求配置类型
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
}

// 扩展InternalAxiosRequestConfig以支持自定义配置
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean;
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
}

// 请求工具类
class RequestUtil {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL:
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: ExtendedAxiosRequestConfig) => {
        // 添加认证token
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response;
        const config = response.config as RequestConfig;

        // 处理业务逻辑错误
        if (data && typeof data === 'object' && 'success' in data) {
          if (!data?.success) {
            const errorMessage = data?.message || '请求失败';

            if (config?.showError !== false) {
              notification.error({
                message: '请求失败',
                description: errorMessage,
                placement: 'topRight',
                duration: 3,
              });
            }

            return Promise.reject(new Error(errorMessage));
          }
        }

        return data as any;
      },
      (error: AxiosError) => {
        const config = error.config as RequestConfig;

        // 处理HTTP错误
        let errorMessage = '网络错误，请稍后重试';

        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 400:
              errorMessage = (data as any)?.message || '请求参数错误';
              break;
            case 401:
              errorMessage = (data as any)?.message || '未授权，请重新登录';
              this.handleUnauthorized();
              break;
            case 403:
              errorMessage = (data as any)?.message || '拒绝访问';
              break;
            case 404:
              errorMessage = (data as any)?.message || '请求的资源不存在';
              break;
            case 500:
              errorMessage = (data as any)?.message || '服务器内部错误';
              break;
            case 502:
              errorMessage = (data as any)?.message || '网关错误';
              break;
            case 503:
              errorMessage = (data as any)?.message || '服务不可用';
              break;
            default:
              errorMessage = (data as any)?.message || `请求失败 (${status})`;
          }
        }

        if (config?.showError !== false) {
          notification.error({
            message: '提示',
            description: errorMessage,
            placement: 'topRight',
            duration: 3,
          });
        }

        return Promise.reject(error);
      },
    );
  }

  // 获取token
  private getToken(): string | null {
    // 只从cookie获取token
    return Cookies.get('token') || null;
  }

  // 处理未授权
  private handleUnauthorized() {
    // 清除cookie中的token
    Cookies.remove('token');
    storage.remove('ddzz_userInfo');
    // 跳转到登录页
    window.location.href = '/login';
  }

  // GET请求
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config);
  }

  // POST请求
  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config);
  }

  // PUT请求
  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config);
  }

  // DELETE请求
  delete<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config);
  }

  // PATCH请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  // 上传文件
  upload<T = any>(
    url: string,
    file: File | FormData,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.instance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }

  // 下载文件
  download(
    url: string,
    filename?: string,
    config?: RequestConfig,
  ): Promise<void> {
    return this.instance
      .get(url, {
        ...config,
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      });
  }

  // 设置基础URL
  setBaseURL(baseURL: string) {
    this.instance.defaults.baseURL = baseURL;
  }

  // 设置默认请求头
  setDefaultHeader(key: string, value: string) {
    this.instance.defaults.headers.common[key] = value;
  }

  // 设置认证token
  setToken(token: string, expires?: number) {
    // 只使用cookie存储token
    Cookies.set('token', token, { expires: expires || 1 });
  }

  // 清除认证token
  clearToken() {
    // 只清除cookie中的token
    Cookies.remove('token');
  }

  // 获取axios实例（用于特殊需求）
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// 创建单例实例
const request = new RequestUtil();

// 导出实例和类型
export default request;
export { RequestUtil };
