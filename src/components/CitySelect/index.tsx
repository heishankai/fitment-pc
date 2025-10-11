import React, { FunctionComponent } from 'react';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { getCityDataService } from './service';

type CitySelectProps = SelectProps;

const CitySelect: FunctionComponent<CitySelectProps> = (props: any) => {
  const { ...restProps } = props ?? {};
  const { data: cityOptions, loading } = useRequest(getCityDataService);

  return (
    <Select
      loading={loading}
      allowClear
      showSearch
      placeholder="请选择城市"
      optionFilterProp="city_name"
      fieldNames={{ label: 'city_name', value: 'city_code' }}
      options={cityOptions?.data}
      {...restProps}
    />
  );
};

export default CitySelect;
