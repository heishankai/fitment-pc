import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Modal } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { getIsVerifiedInfoService } from '../service';

const IsVerifiedModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [record, setRecord] = useState<any>(null);

  const {
    run: getIsVerifiedInfoRun,
    data: isVerifiedInfo,
    loading,
  } = useRequest(getIsVerifiedInfoService, {
    manual: true,
  });

  // 打开弹窗方法
  const handleOpenModal = (record: any) => {
    setRecord(record);
    getIsVerifiedInfoRun(record?.id);
    setTrue();
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  if (!record) return null;

  return (
    <Modal
      title="实名认证信息"
      open={visible}
      onCancel={setFalse}
      footer={null}
      width={800}
      loading={loading}
    >
      <ProDescriptions
        column={2}
        bordered
        dataSource={{
          ...isVerifiedInfo?.data,
          card_front_image: isVerifiedInfo?.data?.card_front_image?.[0]?.url,
          card_reverse_image:
            isVerifiedInfo?.data?.card_reverse_image?.[0]?.url,
        }}
        columns={[
          {
            title: '证件名称',
            dataIndex: 'card_name',
            span: 2,
          },
          {
            title: '证件号码',
            dataIndex: 'card_number',
            span: 2,
          },
          {
            title: '证件住址',
            dataIndex: 'card_address',
            span: 2,
          },
          {
            title: '有效期开始日期',
            dataIndex: 'card_start_date',
          },
          {
            title: '有效期结束日期',
            dataIndex: 'card_end_date',
          },
          {
            title: '证件正面图片',
            dataIndex: 'card_front_image',
            span: 2,
            valueType: 'image',
            fieldProps: {
              width: 100,
              height: 100,
            },
          },
          {
            title: '证件反面图片',
            dataIndex: 'card_reverse_image',
            span: 2,
            valueType: 'image',
            fieldProps: {
              width: 100,
              height: 100,
            },
          },
          {
            title: '是否通过认证',
            dataIndex: 'isVerified',
            valueEnum: {
              true: { text: '是', status: 'Success' },
              false: { text: '否', status: 'Error' },
            },
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            span: 2,
            valueType: 'dateTime',
            proFieldProps: {
              format: 'YYYY-MM-DD HH:mm:ss',
            },
          },
        ]}
      />
    </Modal>
  );
};

export default forwardRef(IsVerifiedModal);
