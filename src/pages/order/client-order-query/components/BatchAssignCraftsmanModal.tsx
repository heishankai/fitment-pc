import React from 'react';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
import {
  getAllCraftsmanUsersService,
  batchAssignCraftsmanService,
} from '../service';
import styled from 'styled-components';

const StyledModalForm = styled(ModalForm)`
  .craftsman-option {
    padding: 4px 0;
    color: #8c8c8c;
    line-height: 20px;
    font-size: 12px;
  }
`;

interface BatchAssignCraftsmanModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  parentOrderId: number;
  selectedWorkPriceIds: number[];
}

const BatchAssignCraftsmanModal: React.FC<BatchAssignCraftsmanModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  parentOrderId,
  selectedWorkPriceIds,
}) => {
  // 获取所有工匠用户
  const { data: craftsmanUsersData, loading: craftsmanUsersLoading } =
    useRequest(getAllCraftsmanUsersService, {
      ready: visible, // 只在弹窗打开时请求
    });

  // 批量分配工匠
  const handleBatchAssignCraftsman = async (values: any) => {
    const { success } = await batchAssignCraftsmanService({
      parent_order_id: parentOrderId,
      work_price_list: selectedWorkPriceIds,
      craftsman_id: values?.craftsmanUserId,
    });

    if (success) {
      message.success('分配成功');
      onCancel();
      onSuccess?.();
    }
  };

  return (
    <StyledModalForm
      title="分配工匠"
      open={visible}
      onOpenChange={(visible) => {
        if (!visible) {
          onCancel();
        }
      }}
      onFinish={handleBatchAssignCraftsman}
      width={600}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProFormSelect
        label="选择工匠"
        name="craftsmanUserId"
        rules={[{ required: true, message: '请选择工匠' }]}
        extra={`已选择 ${selectedWorkPriceIds?.length} 项工价`}
        showSearch
        placeholder="请搜索工匠手机号"
        fieldProps={{
          loading: craftsmanUsersLoading,
          allowClear: true,
          filterOption: (input, option: any) => {
            // 基于 label 中的手机号进行筛选
            const label = (option?.label as string) || '';
            // 提取手机号部分进行匹配
            const phoneMatch = label.match(/\(([^)]+)\)/);
            if (phoneMatch && phoneMatch[1]) {
              return phoneMatch[1].includes(input);
            }
            return false;
          },
          optionRender: (option: any) => {
            const craftsman = option?.data?.data ?? {};

            return (
              <div className="craftsman-option">
                <strong>{craftsman?.nickname || '未设置昵称'}</strong>
                <div>
                  <div>
                    {craftsman?.city || '未设置城市'} |{' '}
                    {craftsman?.phone || '未设置手机号'}
                  </div>
                  <div>
                    {craftsman?.skillInfo?.workKindName || '未进行技能认证'}
                  </div>
                </div>
              </div>
            );
          },
        }}
        options={(craftsmanUsersData?.data ?? []).map((craftsman: any) => ({
          label: `${craftsman.nickname || '未设置昵称'} (${craftsman.phone})`,
          value: craftsman.id,
          data: craftsman,
        }))}
      />
    </StyledModalForm>
  );
};

export default BatchAssignCraftsmanModal;
