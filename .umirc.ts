import { defineConfig } from '@umijs/max';
import { routes } from './src/routers';
import packageJSON from './package.json';

export const PROJECT_NAME = packageJSON.name;

export default defineConfig({
  antd: {
    theme: {
      token: {
        colorPrimary: '#00cec9',
        colorSuccess: '#0bb20c',
        colorWarning: '#f58003',
        colorError: '#f5222d',
        colorInfo: '#0b84f4',
        colorLink: '#00cec9',
        colorLinkHover: '#00b5b0',
        colorLinkActive: '#009a96',
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
  base: `/${PROJECT_NAME}/`,
  outputPath: PROJECT_NAME,
  publicPath: `/${PROJECT_NAME}/`,
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
  define: {
    'process.env.API_BASE_URL':
      process.env.NODE_ENV === 'production'
        ? 'https://zjiangyun.cn'
        : 'http://localhost:3000',
  },
});
