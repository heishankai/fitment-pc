import { extractImageUrl, handleImageForm } from '@/utils';
import type { FormInstance } from 'antd';

// 提交转换
export const transformAddData = (data: any) => {
  if (!data) return {};

  const { work_configs, ...rest } = data ?? {};
  console.log(work_configs, 'whole_house_config');

  return {
    ...rest,
    work_configs: (work_configs || []).map((item: any) => ({
      ...item,
      display_images: extractImageUrl(item.display_images),
      service_details: extractImageUrl(item.service_details),
    })),
  };
};

// 编辑数据转换
export const transformEditData = (record: any, form: FormInstance) => {
  if (!record) return {};
  const { work_configs, ...rest } = record ?? {};
  console.log(work_configs, 'whole_house_config');
  form.setFieldsValue({
    ...rest,
    work_configs: (work_configs || []).map((item: any) => ({
      ...item,
      display_images: handleImageForm(item?.display_images),
      service_details: handleImageForm(item?.service_details),
    })),
  });
};
