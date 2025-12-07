import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Modal, Tag } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';

const CraftsmanUserModal = (props: any, ref: any) => {
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

  const craftsmanUser = record?.craftsman_user;

  if (!craftsmanUser) {
    return (
      <Modal
        title="工匠信息"
        open={visible}
        onCancel={setFalse}
        footer={null}
        width={800}
      >
        <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
          暂无工匠信息
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="工匠信息"
      open={visible}
      onCancel={setFalse}
      footer={null}
      width={800}
    >
      <ProDescriptions
        column={2}
        bordered
        dataSource={craftsmanUser}
        columns={[
          {
            title: '工匠ID',
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
            title: '是否实名认证',
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
            title: '是否技能认证',
            dataIndex: 'isSkillVerified',
            render: (_: any, entity: any) => {
              const value = entity?.isSkillVerified;
              return (
                <Tag color={value ? 'success' : 'error'}>
                  {value ? '是' : '否'}
                </Tag>
              );
            },
          },
          {
            title: '个人主页是否通过审核',
            dataIndex: 'isHomePageVerified',
            render: (_: any, entity: any) => {
              const value = entity?.isHomePageVerified;
              return (
                <Tag color={value ? 'success' : 'error'}>
                  {value ? '是' : '否'}
                </Tag>
              );
            },
          },
          {
            title: '评分',
            dataIndex: 'score',
          },
          {
            title: '省份',
            dataIndex: 'province',
            render: (_: any, entity: any) => entity.province || '-',
          },
          {
            title: '城市',
            dataIndex: 'city',
            render: (_: any, entity: any) => entity.city || '-',
          },
          {
            title: '区县',
            dataIndex: 'district',
            render: (_: any, entity: any) => entity.district || '-',
          },
          {
            title: '纬度',
            dataIndex: 'latitude',
            render: (_: any, entity: any) => entity.latitude || '-',
          },
          {
            title: '经度',
            dataIndex: 'longitude',
            render: (_: any, entity: any) => entity.longitude || '-',
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
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
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

export default forwardRef(CraftsmanUserModal);
