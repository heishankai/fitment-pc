import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';
/**
 * 新增数据转换
 */
export const transformAddData = (data: any) => {
  if (!data) return {};
  const { category_image, ...rest } = data ?? {};
  return {
    ...rest,
    category_image: extractImageUrl(category_image)?.[0],
  };
};

/**
 * 编辑数据转换
 */
export const transformEditData = (record: any, form: FormInstance) => {
  if (!record) return {};
  const { category_image, ...restValues } = record ?? {};

  form.setFieldsValue({
    ...restValues,
    category_image: handleImageForm([category_image]),
  });
};
