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
      {
        name: '获取报价管理',
        path: 'get-price',
        component: 'order/get-price',
      },
    ],
  },
  {
    name: '活动宣传配置',
    path: '/promotion-config',
    icon: 'PictureOutlined',
    routes: [
      {
        name: '轮播图管理',
        path: 'swiper-config',
        component: 'promotion-config/swiper-config',
      },
      {
        name: '欢迎页配置',
        path: 'welcome-config',
        component: 'promotion-config/welcome-config',
      },
      {
        name: '活动管理',
        path: 'activity-config',
        component: 'promotion-config/activity-config',
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
      {
        name: '业主付款明细',
        path: 'payment-record',
        component: 'fund/payment-record',
      },
    ],
  },
  {
    name: '配置管理',
    path: '/config',
    icon: 'SettingOutlined',
    routes: [
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
        name: '实名认证审核',
        path: 'is-verified',
        component: 'config/is-verified',
      },
      {
        name: '技能认证审核',
        path: 'auth-skill-management',
        component: 'config/is-skill-verified',
      },
      {
        name: '个人主页审核',
        path: 'home-page-audit',
        component: 'config/home-page-audit',
      },
      {
        name: '业主管理',
        path: 'wechat-user',
        component: 'config/wechat-user',
      },
      {
        name: '工匠管理',
        path: 'craftsman-query',
        component: 'config/craftsman-query',
      },
      {
        name: '工艺小程序用户',
        path: 'get-process',
        component: 'config/get-process',
      },
      {
        name: '短信通知号码配置',
        path: 'sms-notify-config',
        component: 'config/sms-notify-config',
      },
    ],
  },
  {
    name: '客服中心',
    path: '/customer-service',
    icon: 'CustomerServiceOutlined',
    routes: [
      {
        name: '业主消息',
        path: 'client-chat-page',
        component: 'customer-service/client-chat',
      },
      {
        name: '工匠消息',
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
