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
      title="首页审核详情"
      open={visible}
      onCancel={setFalse}
      footer={null}
      width={800}
    >
      <ProDescriptions
        column={2}
        bordered
        dataSource={{
          ...record,
          // 使用原始数据
          awards_image: record?._originalAwardsImage || record?.awards_image,
        }}
        columns={[
          {
            title: '用户昵称',
            dataIndex: 'nickname',
          },
          {
            title: '是否通过审核',
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
            title: '简介',
            dataIndex: 'intro',
            span: 2,
            ellipsis: true,
          },
          {
            title: '获奖情况',
            dataIndex: 'awards',
            span: 2,
            ellipsis: true,
          },
          {
            title: '获奖图片',
            dataIndex: 'awards_image',
            span: 2,
            render: (_: any, entity: any) => {
              const images = entity?.awards_image || [];
              if (images.length === 0) return '-';
              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {images.map((item: any, index: number) => (
                    <img
                      key={index}
                      src={item?.url}
                      alt={`获奖图片${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </div>
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
