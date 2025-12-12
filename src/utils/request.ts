import axios from 'axios';
import Cookies from 'js-cookie';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { notification } from 'antd';
import { clearLoginData } from './index';

export const BASE_URL = process.env.API_BASE_URL;

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @description :添加请求拦截器
 * 在发送请求之前做些什么
 * 启动loading
 * 设置token
 * 设置请求头
 * 返回config
 */
request.interceptors.request.use(
  function (config) {
    NProgress.start();

    const token = Cookies.get('token') || null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData 请求不需要设置 Content-Type，让浏览器自动设置（包含 boundary）
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  function (error) {
    /**
     * 对请求错误做些什么
     * 停止loading
     * 返回error
     */
    NProgress.done();
    return Promise.reject(error);
  },
);

// 添加响应拦截器
/**
 * @description :添加响应拦截器
 * 2xx 范围内的状态码都会触发该函数。
 * 对响应数据做点什么
 * 停止loading
 * 返回response.data
 */
request.interceptors.response.use(
  function (response) {
    /**
     * 2xx 范围内的状态码都会触发该函数。
     * 对响应数据做点什么
     * 停止loading
     * 返回response.data
     */
    NProgress.done();
    // 如果是 blob 响应，直接返回 response，由调用方处理
    if (response.config.responseType === 'blob') {
      return response;
    }
    return response.data;
  },
  function (error) {
    /**
     * 超出 2xx 范围的状态码都会触发该函数。
     * 对响应错误做点什么
     * 401 - 清除登录数据
     * 返回error
     */
    console.log(error, 'error');

    if (error.response) {
      const { status, data } = error?.response ?? {};

      switch (status) {
        case 401:
          clearLoginData(true);
          break;
        default:
          notification.error({
            message: '提示信息',
            description: data?.message,
          });
          break;
      }
    }

    NProgress.done();
    return Promise.reject(error);
  },
);

/**
 * 导出文件（Excel等）
 * @param url 请求地址
 * @param data 请求参数
 * @returns Promise<void>
 */
export const exportFile = async (url: string, data?: any): Promise<void> => {
  try {
    const response = await request.post(url, data || {}, {
      responseType: 'blob', // 重要：设置响应类型为 blob
    });

    console.log(response, 'response');

    const contentDisposition = response.headers['content-disposition'];

    let filename = '导出文件.xlsx'; // 兜底默认值，正常情况下应该由后端返回

    let filenameMatch = contentDisposition.match(
      /filename\*=UTF-8''([^;\n]+)/i,
    );

    filename = decodeURIComponent(filenameMatch[1]);

    // 创建 blob URL
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const blobUrl = window.URL.createObjectURL(blob);

    // 创建临时链接并触发下载
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error: any) {
    console.error('导出失败:', error);
    throw new Error(error?.response?.data?.message || '导出失败');
  }
};

export default request;
