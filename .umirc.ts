import { defineConfig } from '@umijs/max';
import { theme } from './src/theme';
import { routes } from './src/routers';

export default defineConfig({
  antd: {
    theme: {
      token: {
        colorPrimary: '#ff69b4',
        colorSuccess: '#0bb20c',
        colorWarning: '#f58003',
        colorError: '#f5222d',
        colorInfo: '#0b84f4',
      },
    },
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'hello',
  },
  // 使用自定义主题配置
  theme,
  // 配置 Babel 插件支持 styled-components
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: true,
        fileName: true,
      },
    ],
  ],
  routes,
  npmClient: 'pnpm',
});
