import React, { FunctionComponent } from 'react';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { getWorkKindDataService } from './service';

type WorkKindSelectProps = SelectProps;

const WorkKindSelect: FunctionComponent<WorkKindSelectProps> = (props: any) => {
  const { ...restProps } = props ?? {};
  const { data: workKindOptions, loading } = useRequest(getWorkKindDataService);

  return (
    <Select
      loading={loading}
      allowClear
      showSearch
      placeholder="请选择工种"
      optionFilterProp="work_kind_name"
      fieldNames={{ label: 'work_kind_name', value: 'id' }}
      options={workKindOptions?.data}
      {...restProps}
    />
  );
};

export default WorkKindSelect;
