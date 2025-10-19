import React, { FunctionComponent } from 'react';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { getCategoryDataService } from './service';

type CategorySelectProps = SelectProps;

const CategorySelect: FunctionComponent<CategorySelectProps> = (props: any) => {
  const { ...restProps } = props ?? {};
  const { data: categoryOptions, loading } = useRequest(getCategoryDataService);

  return (
    <Select
      loading={loading}
      allowClear
      showSearch
      placeholder="请选择类目"
      optionFilterProp="category_name"
      fieldNames={{ label: 'category_name', value: 'id' }}
      options={categoryOptions?.data}
      {...restProps}
    />
  );
};

export default CategorySelect;
