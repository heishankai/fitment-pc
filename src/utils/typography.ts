/**
 * 字体样式工具函数
 * 提供统一的字体样式配置
 */

export const typography = {
  // 标题样式
  title: {
    fontSize: '18px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    lineHeight: '1.4',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },

  // 副标题样式
  subtitle: {
    fontSize: '16px',
    fontWeight: '500',
    letterSpacing: '0.3px',
    lineHeight: '1.5',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },

  // 正文字体样式
  body: {
    fontSize: '14px',
    fontWeight: '400',
    letterSpacing: '0.2px',
    lineHeight: '1.6',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },

  // 小字体样式
  caption: {
    fontSize: '12px',
    fontWeight: '400',
    letterSpacing: '0.1px',
    lineHeight: '1.4',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },

  // 按钮字体样式
  button: {
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.3px',
    lineHeight: '1.4',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },
};

// 获取带主题色的样式
export const getThemedTypography = (token: any) => ({
  title: {
    ...typography.title,
    color: token.colorPrimary,
    textShadow: '0 1px 2px rgba(0, 206, 201, 0.1)',
  },
  subtitle: {
    ...typography.subtitle,
    color: token.colorTextHeading,
  },
  body: {
    ...typography.body,
    color: token.colorText,
  },
  caption: {
    ...typography.caption,
    color: token.colorTextSecondary,
  },
  button: {
    ...typography.button,
    color: token.colorPrimary,
  },
});

// 获取带悬停效果的样式
export const getHoverTypography = (baseStyle: any) => ({
  ...baseStyle,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  userSelect: 'none',
  onMouseEnter: (e: any) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.textShadow = '0 2px 4px rgba(0, 206, 201, 0.2)';
  },
  onMouseLeave: (e: any) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.textShadow = '0 1px 2px rgba(0, 206, 201, 0.1)';
  },
});
