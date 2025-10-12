import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';
/**
 * 新增数据转换
 */
export const transformAddData = (data: any) => {
  if (!data) return {};
  const {
    construction_image,
    drawingroom_image,
    balcony_image,
    master_bedroom_image,
    secondary_bedroom_image,
    bathroom_image,
    city,
    ...rest
  } = data ?? {};
  return {
    ...rest,
    city_name: city?.label,
    city_code: city?.value,
    construction_image: extractImageUrl(construction_image),
    drawingroom_image: extractImageUrl(drawingroom_image),
    balcony_image: extractImageUrl(balcony_image),
    master_bedroom_image: extractImageUrl(master_bedroom_image),
    secondary_bedroom_image: extractImageUrl(secondary_bedroom_image),
    bathroom_image: extractImageUrl(bathroom_image),
  };
};

/**
 * 编辑数据转换
 */
export const transformEditData = (record: any, form: FormInstance) => {
  if (!record) return {};
  const {
    construction_image,
    drawingroom_image,
    balcony_image,
    master_bedroom_image,
    secondary_bedroom_image,
    bathroom_image,
    city_name,
    city_code,
    ...restValues
  } = record ?? {};

  form.setFieldsValue({
    ...restValues,
    city: {
      label: city_name,
      value: city_code,
    },
    construction_image: handleImageForm(construction_image),
    drawingroom_image: handleImageForm(drawingroom_image),
    balcony_image: handleImageForm(balcony_image),
    master_bedroom_image: handleImageForm(master_bedroom_image),
    secondary_bedroom_image: handleImageForm(secondary_bedroom_image),
    bathroom_image: handleImageForm(bathroom_image),
  });
};
