import axios from 'axios';
import Cookies from 'js-cookie';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { notification } from 'antd';
import { clearLoginData } from './index';

export const BASE_URL = process.env.API_BASE_URL + '/api';

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

export default request;
