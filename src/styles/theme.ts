// 主题常量配置
export const theme = {
  colors: {
    primary: '#00cec9',
    secondary: '#00b4d8',
    tertiary: '#0099cc',
    white: '#ffffff',
    success: '#52c41a',
    error: '#ff4d4f',
    warning: '#fa8c16',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 12px rgba(0, 0, 0, 0.1)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    xl: '0 12px 32px rgba(0, 0, 0, 0.16)',
  },
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    danger: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    header: 'linear-gradient(135deg, #00cec9 0%, #00b4d8 50%, #0099cc 100%)',
    page: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
} as const;
