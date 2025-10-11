import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';
/**
 * 新增数据转换
 */
export const transformAddData = (data: any) => {
  if (!data) return {};
  return {
    ...data,
    city_name: data?.city?.label,
    city_code: data?.city?.value,
    construction_image: extractImageUrl(data?.construction_image),
    drawingroom_image: extractImageUrl(data?.drawingroom_image),
    balcony_image: extractImageUrl(data?.balcony_image),
    master_bedroom_image: extractImageUrl(data?.master_bedroom_image),
    secondary_bedroom_image: extractImageUrl(data?.secondary_bedroom_image),
    bathroom_image: extractImageUrl(data?.bathroom_image),
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
