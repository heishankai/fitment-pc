import { defineConfig } from '@umijs/max';
import { theme } from './src/theme';
import { routes } from './src/routers';

export default defineConfig({
  antd: {},
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
