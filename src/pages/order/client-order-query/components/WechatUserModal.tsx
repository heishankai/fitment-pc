import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Modal } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';

const WechatUserModal = (props: any, ref: any) => {
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

  const wechatUser = record?.wechat_user;

  if (!wechatUser) {
    return (
      <Modal
        title="业主信息"
        open={visible}
        onCancel={setFalse}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          暂无业主信息
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="业主信息"
      open={visible}
      onCancel={setFalse}
      footer={null}
      width={600}
    >
      <ProDescriptions
        column={1}
        bordered
        dataSource={wechatUser}
        columns={[
          {
            title: '用户ID',
            dataIndex: 'id',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            copyable: true,
          },
          {
            title: '昵称',
            dataIndex: 'nickname',
          },
          {
            title: '头像',
            dataIndex: 'avatar',
            valueType: 'image',
            fieldProps: {
              width: 100,
              height: 100,
            },
          },
          {
            title: '城市',
            dataIndex: 'city',
            render: (_: any, entity: any) => entity.city || '-',
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            proFieldProps: {
              format: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
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

export default forwardRef(WechatUserModal);
