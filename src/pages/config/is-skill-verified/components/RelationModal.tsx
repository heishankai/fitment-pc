import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Avatar, Modal, Space, Table, Tag, Typography } from 'antd';
import { getSkillVerifiedRelationService } from '../service';

const RelationModal = (_props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [record, setRecord] = useState<any>(null);

  const isForeman = record?.work_kind_code === 'GONGZHANG';

  const {
    data: dataSource,
    loading,
    run,
  } = useRequest(getSkillVerifiedRelationService, {
    manual: true,
  });

  const handleOpenModal = async (record: any) => {
    setRecord(record);
    run(record?.id);
    setTrue();
  };

  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  return (
    <Modal
      title={isForeman ? '从属工匠' : '所属工长'}
      open={visible}
      onCancel={setFalse}
      footer={null}
      width={920}
    >
      <Table
        rowKey="id"
        size="small"
        loading={loading}
        dataSource={dataSource?.data || []}
        scroll={{ x: 820 }}
        pagination={false}
        locale={{
          emptyText: isForeman ? '暂无从属工匠' : '暂未绑定工长',
        }}
        columns={[
          {
            title: '用户',
            dataIndex: 'nickname',
            width: 220,
            render: (_: any, entity) => (
              <Space>
                <Avatar src={entity?.avatar}>
                  {entity?.nickname?.slice(0, 1)}
                </Avatar>
                <Typography.Text ellipsis style={{ maxWidth: 150 }}>
                  {entity?.nickname || '-'}
                </Typography.Text>
              </Space>
            ),
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            width: 150,
            ellipsis: true,
          },
          {
            title: '认证工种',
            dataIndex: 'work_kind_name',
            width: 130,
            ellipsis: true,
          },
          {
            title: '工龄（年）',
            dataIndex: 'work_years',
            width: 110,
            ellipsis: true,
          },
          {
            title: '认证状态',
            dataIndex: 'isSkillVerified',
            width: 110,
            render: (value) => (
              <Tag color={value ? 'success' : 'error'}>
                {value ? '已通过' : '未通过'}
              </Tag>
            ),
          },
          {
            title: '技能介绍',
            dataIndex: 'skill_intro',
            width: 200,
            ellipsis: true,
          },
        ]}
      />
    </Modal>
  );
};

export default forwardRef(RelationModal);
