import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { message } from 'antd';

// 响应数据类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  errorMessage?: string;
  errorCode?: string | number;
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
  private loadingCount = 0;

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

        // 显示加载状态
        if (config.showLoading !== false) {
          this.showLoading();
        }

        console.log('🚀 Request:', {
          url: config.url,
          method: config.method,
          params: config.params,
          data: config.data,
        });

        return config;
      },
      (error) => {
        this.hideLoading();
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        this.hideLoading();

        console.log('✅ Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });

        const { data } = response;
        const config = response.config as RequestConfig;

        // 处理业务逻辑错误
        if (data && typeof data === 'object' && 'success' in data) {
          if (!data.success) {
            const errorMessage = data.errorMessage || '请求失败';

            if (config.showError !== false) {
              message.error(errorMessage);
            }

            return Promise.reject(new Error(errorMessage));
          }

          // 显示成功消息
          if (config.showSuccess && config.successMessage) {
            message.success(config.successMessage);
          }
        }

        return response;
      },
      (error: AxiosError) => {
        this.hideLoading();

        const config = error.config as RequestConfig;

        console.error('❌ Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });

        // 处理HTTP错误
        let errorMessage = '网络错误，请稍后重试';

        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 400:
              errorMessage = '请求参数错误';
              break;
            case 401:
              errorMessage = '未授权，请重新登录';
              this.handleUnauthorized();
              break;
            case 403:
              errorMessage = '拒绝访问';
              break;
            case 404:
              errorMessage = '请求的资源不存在';
              break;
            case 500:
              errorMessage = '服务器内部错误';
              break;
            case 502:
              errorMessage = '网关错误';
              break;
            case 503:
              errorMessage = '服务不可用';
              break;
            default:
              errorMessage = (data as any)?.message || `请求失败 (${status})`;
          }
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = '请求超时，请稍后重试';
        } else if (error.message.includes('Network Error')) {
          errorMessage = '网络连接失败，请检查网络设置';
        }

        if (config?.showError !== false) {
          message.error(errorMessage);
        }

        return Promise.reject(error);
      },
    );
  }

  // 获取token
  private getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // 处理未授权
  private handleUnauthorized() {
    // 清除token
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    // 跳转到登录页
    window.location.href = '/login';
  }

  // 显示加载状态
  private showLoading() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      // 这里可以集成你的loading组件
      console.log('🔄 Loading...');
    }
  }

  // 隐藏加载状态
  private hideLoading() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      console.log('✅ Loading complete');
    }
  }

  // GET请求
  get<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.get(url, config);
  }

  // POST请求
  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post(url, data, config);
  }

  // PUT请求
  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put(url, data, config);
  }

  // DELETE请求
  delete<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete(url, config);
  }

  // PATCH请求
  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.patch(url, data, config);
  }

  // 上传文件
  upload<T = any>(
    url: string,
    file: File | FormData,
    config?: RequestConfig,
  ): Promise<AxiosResponse<ApiResponse<T>>> {
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
  setToken(
    token: string,
    storage: 'localStorage' | 'sessionStorage' = 'localStorage',
  ) {
    if (storage === 'localStorage') {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  // 清除认证token
  clearToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
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
