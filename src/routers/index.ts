export const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '登录',
    path: '/login',
    component: './login',
    layout: false,
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    name: '权限演示',
    path: '/access',
    component: './Access',
  },
  {
    name: ' CRUD 示例',
    path: '/table',
    component: './Table',
  },
];
