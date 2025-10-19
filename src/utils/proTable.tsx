/**  proTable公共配置 */
import React from 'react';
import type { ProTableProps } from '@ant-design/pro-components';

type SearchConfig = ProTableProps<any, any>['search'];
type RequestType = ProTableProps<any, any>['request'];

// 自定义protable默认配置
const defaultProTableConfig: ProTableProps<any, any> = {
  form: {
    ignoreRules: false,
  },
  pagination: {
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 10,
  },
  dateFormatter: 'string',
  defaultSize: 'small',
  sticky: true,
  manualRequest: true,
  search: {
    span: 8,
    defaultColsNumber: 7,
    labelWidth: 70,
    collapsed: false,
  },
};

// 需要自定义search但想保留原来的search配置
export const getProTableConfig = (options?: {
  search?: SearchConfig;
  request?: RequestType;
  onReset?: () => void;
}): ProTableProps<any, any> => {
  const { search, request, onReset } = options || {};
  const defaultOptionRender: Exclude<
    SearchConfig,
    false | undefined
  >['optionRender'] = (searchConfig, props, dom) => {
    const [resetBtn, queryBtn] = dom;

    return [
      queryBtn,
      React.cloneElement(resetBtn as any, {
        onClick: () => {
          const { form, items } = props as any;
          items.forEach((item: any) => {
            // 不会重置 不可编辑的字段
            if (
              item?.props?.renderFormItem &&
              item?.props?.renderFormItem()?.props?.disabled
            ) {
              // 获取renderFormItem自定义属性中的disabled
              return;
            }
            if (
              item?.props?.getFieldProps &&
              item?.props?.getFieldProps()?.disabled
            ) {
              // 获取fieldsProps中的disabled
              return;
            }
            if (item?.props?.name) {
              form?.resetFields([item?.props?.name]);
            }
            if (
              item?.props?.getFormItemProps &&
              item?.props?.getFormItemProps()?.name
            ) {
              form?.resetFields([item?.props?.getFormItemProps()?.name]);
            }
          });
          if (onReset) {
            onReset();
          }
        },
      }),
    ];
  };

  return {
    ...defaultProTableConfig,
    search: {
      optionRender: defaultOptionRender,
      ...defaultProTableConfig.search,
      ...search,
    },
    request: request
      ? (parmas, sort, filter) => {
          const { current, ...restParams } = parmas;
          return request(
            {
              pageIndex: current,
              ...restParams,
            },
            sort,
            filter,
          );
        }
      : undefined,
  };
};
