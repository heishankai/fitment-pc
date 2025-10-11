import { defineConfig } from '@umijs/max';
import { routes } from './src/routers';

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
