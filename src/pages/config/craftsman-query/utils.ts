import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';
/**
 * 新增数据转换
 */
export const transformAddData = (data: any) => {
  if (!data) return {};
  const {
    craftsman_image,
    craftsman_honor_images,
    craftsman_skill_certificate,
    craftsman_customer_comments,
    city,
    ...rest
  } = data ?? {};
  return {
    ...rest,
    city_name: city?.label,
    city_code: city?.value,
    craftsman_image: extractImageUrl(craftsman_image),
    craftsman_honor_images: extractImageUrl(craftsman_honor_images),
    craftsman_skill_certificate: extractImageUrl(craftsman_skill_certificate),
    craftsman_customer_comments: craftsman_customer_comments.map(
      (item: any) => ({
        ...item,
        comment_images: extractImageUrl(item?.comment_images),
      }),
    ),
  };
};

/**
 * 编辑数据转换
 */
export const transformEditData = (record: any, form: FormInstance) => {
  if (!record) return {};
  const {
    craftsman_image,
    craftsman_honor_images,
    craftsman_skill_certificate,
    craftsman_customer_comments,
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
    craftsman_image: handleImageForm(craftsman_image),
    craftsman_honor_images: handleImageForm(craftsman_honor_images),
    craftsman_skill_certificate: handleImageForm(craftsman_skill_certificate),
    craftsman_customer_comments: craftsman_customer_comments.map(
      (item: any) => ({
        ...item,
        comment_images: handleImageForm(item?.comment_images),
      }),
    ),
  });
};
