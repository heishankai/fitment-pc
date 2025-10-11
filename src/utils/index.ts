import Cookies from 'js-cookie';
import storage from './storage';

// 清除登录数据
export const clearLoginData = () => {
  Cookies.remove('token');
  storage.remove('ddzz_userInfo');
  window.location.href = '/login';
};

// 导出字体样式工具
export * from './typography';

/**
 * 从图片上传接口返回的数据中提取URL
 * @param uploadResponse 上传接口返回的数据
 * @returns 图片URL字符串，如果提取失败返回空字符串
 */
export const extractImageUrl = (uploadImages: any): string[] => {
  return (uploadImages || [])
    .map((item: any) => {
      const { response, status } = item ?? {};
      if (status === 'done' && response?.success) {
        return response?.data?.url;
      }
      return undefined;
    })
    .filter(Boolean);
};

/**
 * 后端返回图片表单回显
 */
export const handleImageForm = (images: any) => {
  return (images || []).map((item: any, index: number) => {
    const uid = `rc-upload-${Date.now()}-${index}`;
    const name = `image-${index}.jpg`;

    // 创建一个虚拟的 File 对象用于预览
    const virtualFile = new File([''], name, { type: 'image/jpeg' });

    return {
      uid,
      name,
      status: 'done',
      url: item,
      thumbUrl: item,
      response: {
        success: true,
        data: {
          url: item,
        },
      },
      // 关键：添加 originFileObj 属性，这是预览功能必需的
      originFileObj: virtualFile,
    };
  });
};
