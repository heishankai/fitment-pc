import {
  HomeOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  SettingOutlined,
  ToolOutlined,
} from '@ant-design/icons';

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
    icon: 'LoginOutlined',
  },
  {
    name: '本月数据',
    path: '/home',
    component: 'home',
    icon: 'HomeOutlined',
  },
  {
    name: '订单管理',
    path: '/order',
    icon: 'ShoppingCartOutlined',
    routes: [
      {
        name: '订单查询',
        path: 'client-order-query',
        component: 'order/client-order-query',
      },
    ],
  },
  {
    name: '资金管理',
    path: '/fund',
    icon: 'DollarOutlined',
    routes: [
      {
        name: '提现审核',
        path: 'withdrawal-audit',
        component: 'fund/withdrawal-audit',
      },
      {
        name: '流水对账',
        path: 'accounts-reconciliation',
        component: 'fund/accounts-reconciliation',
      },
    ],
  },
  {
    name: '配置管理',
    path: '/config',
    icon: 'SettingOutlined',
    routes: [
      {
        name: '轮播图管理',
        path: 'swiper-config',
        component: 'config/swiper-config',
      },
      {
        name: '工种管理',
        path: 'work',
        routes: [
          {
            name: '工价管理',
            path: 'work-type',
            component: 'config/work/work-type',
          },
          {
            name: '工种管理',
            path: 'work-kind',
            component: 'config/work/work-kind',
          },
          {
            name: '工价单位管理',
            path: 'labour-cost',
            component: 'config/work/labour-cost',
          },
        ],
      },
      {
        name: '辅料管理',
        path: 'material-query',
        routes: [
          {
            name: '类目配置',
            path: 'category-config',
            component: 'config/material-query/category-config',
          },
          {
            name: '商品配置',
            path: 'commodity-config',
            component: 'config/material-query/commodity-config',
          },
        ],
      },
      {
        name: '案例管理',
        path: 'case-query',
        component: 'config/case-query',
      },
      {
        name: '工匠管理',
        path: 'craftsman-query',
        component: 'config/craftsman-query',
      },
      {
        name: '工匠实名认证审核',
        path: 'is-verified',
        component: 'config/is-verified',
      },
      {
        name: '工匠技能认证审核',
        path: 'auth-skill-management',
        component: 'config/is-skill-verified',
      },
      {
        name: '工匠个人主页审核',
        path: 'home-page-audit',
        component: 'config/home-page-audit',
      },
      {
        name: '独立页面配置管理',
        path: 'independent-page-config',
        component: 'config/independent-page-config',
      },
    ],
  },
  {
    name: '客服系统',
    path: '/customer-service',
    icon: 'CustomerServiceOutlined',
    routes: [
      {
        name: '业主聊天',
        path: 'client-chat-page',
        component: 'customer-service/client-chat',
      },
      {
        name: '工匠聊天',
        path: 'craftsman-chat-page',
        component: 'customer-service/craftsman-chat',
      },
    ],
  },
  {
    name: '系统设置',
    path: '/system',
    icon: 'ToolOutlined',
    routes: [
      {
        name: '账号管理',
        path: 'account-permission',
        component: 'system/account-permission',
      },
      {
        name: '平台公告',
        path: 'platform-notice',
        component: 'system/platform-notice',
      },
    ],
  },
];

// 图标映射表
export const iconMap = {
  LoginOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  SettingOutlined,
  ToolOutlined,
};
