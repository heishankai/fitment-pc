import Cookies from 'js-cookie';
import storage from './storage';
import { history } from '@umijs/max';

// 清除登录数据
export const clearLoginData = (shouldRedirect = false) => {
  Cookies.remove('token');
  storage.remove('ddzz_userInfo');

  // 如果需要跳转，则跳转到登录页面
  if (shouldRedirect) {
    history.push('/login');
  }
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

/**
 * 在图片上添加标题和描述文字
 * @param file 原始图片文件
 * @param title 标题文字
 * @param desc 描述文字
 * @returns 处理后的图片文件
 */
export const composeImageWithText = (
  file: File,
  title: string,
  desc: string,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Canvas not supported');
        return;
      }

      // 提高渲染质量，使文字更清晰
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 绘制原图
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 计算文字大小（根据图片尺寸自适应）
      const baseSize = Math.max(canvas.width, canvas.height);
      const titleSize = Math.floor(baseSize / 20); // 标题字体大小（更大更清晰）
      const descSize = Math.floor(baseSize / 28); // 描述字体大小（更大更清晰）
      const leftPadding = Math.floor(baseSize / 30) + 24; // 左边距，增加12px
      const bottomPadding = Math.floor(baseSize / 25) + 24; // 底边距，增加12px
      const spacing = Math.floor(baseSize / 35); // 标题和描述之间的间距（增大间距）

      // 底部渐变遮罩（参考图片效果，从底部向上渐变）
      const maskHeight = canvas.height * 0.25; // 遮罩高度约25%
      const gradient = ctx.createLinearGradient(
        0,
        canvas.height,
        0,
        canvas.height - maskHeight,
      );
      // 渐变效果：底部较深，向上逐渐透明
      gradient.addColorStop(0, 'rgba(0,0,0,0.7)');
      gradient.addColorStop(0.6, 'rgba(0,0,0,0.3)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - maskHeight, canvas.width, maskHeight);

      // 设置文字样式 - 左下角对齐
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'left';

      // 计算文字位置（左下角）
      const textX = leftPadding;
      // 从底部向上计算位置
      let currentY = canvas.height - bottomPadding;

      // 先绘制描述（在底部，较小）
      if (desc && desc.trim()) {
        // 设置字符间距（稍微小一点）
        ctx.letterSpacing = '0.5px';
        ctx.font = `${descSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif`;

        // 描述文字颜色淡一些（降低透明度），更柔和
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';

        // 添加柔和的文字描边效果
        ctx.lineWidth = 1.5;
        ctx.strokeText(desc, textX, currentY);

        // 添加柔和的文字阴影效果
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1.5;

        ctx.fillText(desc, textX, currentY);

        // 重置阴影和描边
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 1;
        ctx.letterSpacing = '0px';

        // 如果有标题，向上移动位置
        if (title && title.trim()) {
          currentY -= descSize + spacing;
        }
      }

      // 再绘制标题（在描述上方，较大）
      if (title && title.trim()) {
        // 设置字符间距（稍微小一点）
        ctx.letterSpacing = '1px';
        ctx.font = `bold ${titleSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif`;
        ctx.fillStyle = '#ffffff';

        // 添加柔和的文字描边效果，保持清晰但更柔和
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.strokeText(title, textX, currentY);

        // 添加柔和的文字阴影效果，增强可读性
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1.5;

        ctx.fillText(title, textX, currentY);

        // 重置阴影和描边
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 1;
        ctx.letterSpacing = '0px';
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('图片转换失败'));
            URL.revokeObjectURL(url);
            return;
          }
          const newFile = new File([blob], file.name, {
            type: 'image/jpeg',
          });
          resolve(newFile);
          URL.revokeObjectURL(url);
        },
        'image/jpeg',
        0.95, // 稍微压缩以减小文件大小
      );
    };

    img.onerror = reject;
  });
};
