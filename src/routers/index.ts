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
    name: '今日数据',
    path: '/home',
    component: 'home',
  },
  {
    name: '配置管理',
    path: '/config',
    routes: [
      {
        name: '工程管理查询',
        path: 'project-query',
        component: 'config/project-query',
      },
      {
        name: '工价/辅料管理查询',
        path: 'price-query',
        component: 'config/price-query',
      },
      {
        name: '工匠管理查询',
        path: 'craftsman-query',
        component: 'config/craftsman-query',
      },
    ],
  },
  {
    name: '认证审核管理中心',
    path: '/audit',
    routes: [
      {
        name: '实名认证审核',
        path: 'name-auth',
        component: 'audit/name-auth',
      },
      {
        name: '承诺书审核',
        path: 'promise-auth',
        component: 'audit/promise-auth',
      },
      {
        name: '技能认证审核',
        path: 'skill-auth',
        component: 'audit/skill-auth',
      },
    ],
  },
];
