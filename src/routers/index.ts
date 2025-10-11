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
    name: '今日数据',
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
        name: '业主订单查询',
        path: 'client-order-query',
        component: 'order/client-order-query',
      },
      {
        name: '派单查询和操作',
        path: 'dispatch-query-operation',
        component: 'order/dispatch-query-operation',
      },
      {
        name: '介入处理纠纷记录查询',
        path: 'dispute-record-query',
        component: 'order/dispute-record-query',
      },
      {
        name: '呼叫录音查询',
        path: 'call-record-query',
        component: 'order/call-record-query',
      },
    ],
  },
  {
    name: '资金管理',
    path: '/fund',
    icon: 'DollarOutlined',
    routes: [
      {
        name: '业主付款记录',
        path: 'client-payment-record',
        component: 'fund/client-payment-record',
      },
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
        name: '抢单配置',
        path: 'grab-order-config',
        component: 'config/grab-order-config',
      },
      {
        name: '工程管理',
        path: 'project-query',
        component: 'config/project-query',
      },
      {
        name: '工价管理',
        path: 'price-query',
        component: 'config/price-query',
      },
      {
        name: '辅料管理',
        path: 'material-query',
        component: 'config/material-query',
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
        name: '认证审核',
        path: 'auth-audit-management',
        component: 'config/auth-audit-management',
      },
    ],
  },
  {
    name: '系统设置',
    path: '/system',
    icon: 'ToolOutlined',
    routes: [
      {
        name: '账号权限管理',
        path: 'account-permission',
        component: 'system/account-permission',
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
