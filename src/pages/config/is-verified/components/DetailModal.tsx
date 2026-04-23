import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Modal, Tag } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';

const DetailModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [record, setRecord] = useState<any>(null);

  // 打开弹窗方法
  const handleOpenModal = (record: any) => {
    setRecord(record);
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
      title="认证详情"
      open={visible}
      onCancel={setFalse}
      footer={null}
      width={800}
    >
      <ProDescriptions
        column={2}
        bordered
        dataSource={record}
        columns={[
          {
            title: '用户昵称',
            dataIndex: 'nickname',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
          },
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
          // {
          //   title: '有效期开始日期',
          //   dataIndex: 'card_start_date',
          // },
          // {
          //   title: '有效期结束日期',
          //   dataIndex: 'card_end_date',
          // },
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
            render: (_: any, entity: any) => {
              const value = entity?.isVerified;
              return (
                <Tag color={value ? 'success' : 'error'}>
                  {value ? '是' : '否'}
                </Tag>
              );
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

export default forwardRef(DetailModal);
