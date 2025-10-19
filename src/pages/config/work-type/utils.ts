import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';
/**
 * 新增数据转换
 */
export const transformAddData = (data: any) => {
  if (!data) return {};
  const { display_images, service_details, ...rest } = data ?? {};
  return {
    ...rest,
    display_images: extractImageUrl(display_images),
    service_details: extractImageUrl(service_details),
  };
};

/**
 * 编辑数据转换
 */
export const transformEditData = (record: any, form: FormInstance) => {
  if (!record) return {};
  const { display_images, service_details, ...restValues } = record ?? {};

  form.setFieldsValue({
    ...restValues,
    display_images: handleImageForm(display_images),
    service_details: handleImageForm(service_details),
  });
};
