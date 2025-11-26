import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';
/**
 * 新增数据转换
 */
export const transformAddData = (data: any) => {
  if (!data) return {};
  const { notice_image, ...rest } = data ?? {};
  return {
    ...rest,
    notice_image: extractImageUrl(notice_image),
  };
};

/**
 * 编辑数据转换
 */
export const transformEditData = (record: any, form: FormInstance) => {
  if (!record) return {};
  const { notice_image, ...rest } = record ?? {};

  form.setFieldsValue({
    ...rest,
    notice_image: handleImageForm(notice_image),
  });
};
