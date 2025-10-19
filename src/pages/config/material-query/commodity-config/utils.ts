import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';
/**
 * 新增数据转换
 */
export const transformAddData = (data: any) => {
  if (!data) return {};
  const {
    commodity_cover,
    commodity_detail_images,
    commodity_images,
    category,
    ...rest
  } = data ?? {};
  return {
    ...rest,
    category_id: category?.value,
    category_name: category?.label,
    commodity_cover: extractImageUrl(commodity_cover),
    commodity_images: extractImageUrl(commodity_images),
    commodity_detail_images: extractImageUrl(commodity_detail_images),
  };
};

/**
 * 编辑数据转换
 */
export const transformEditData = (record: any, form: FormInstance) => {
  if (!record) return {};
  const {
    commodity_cover,
    commodity_detail_images,
    commodity_images,
    category_name,
    category_id,
    ...restValues
  } = record ?? {};

  form.setFieldsValue({
    ...restValues,
    category: {
      label: category_name,
      value: category_id,
    },
    commodity_cover: handleImageForm(commodity_cover),
    commodity_images: handleImageForm(commodity_images),
    commodity_detail_images: handleImageForm(commodity_detail_images),
  });
};
