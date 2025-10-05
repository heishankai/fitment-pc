import Cookies from 'js-cookie';
import storage from './storage';

// 清除登录数据
export const clearLoginData = () => {
  Cookies.remove('token');
  storage.remove('ddzz_userInfo');
  window.location.href = '/login';
};
