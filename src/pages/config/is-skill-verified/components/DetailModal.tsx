import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Modal, Tag, Tooltip, Image } from 'antd';
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
      title="技能认证详情"
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
            title: '工种ID',
            dataIndex: 'work_kind_code',
          },
          {
            title: '工种名称',
            dataIndex: 'work_kind_name',
          },
          {
            title: '工龄（年）',
            dataIndex: 'work_years',
          },
          {
            title: '技能介绍',
            dataIndex: 'skill_intro',
            valueType: 'textarea',
            renderText: (text: any) => (
              <Tooltip title={text}>
                <div
                  style={{
                    width: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {text}
                </div>
              </Tooltip>
            ),
          },
          {
            title: '承诺图片',
            dataIndex: 'promise_image',
            span: 2,
            hideInSearch: true,
            render: (_: any, entity: any) => {
              const images = entity?.promise_image;

              if (images?.length === 0) return '-';
              return (
                <Image.PreviewGroup>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(images || []).map((item: any, index: number) => (
                      <Image
                        key={index}
                        src={item?.url}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              );
            },
          },
          {
            title: '操作视频',
            dataIndex: 'operation_video',
            span: 2,
            render: (_: any, entity: any) => {
              const list = entity?.operation_video;
              const videos: { url?: string }[] = Array.isArray(list)
                ? list
                : list
                  ? [{ url: String(list) }]
                  : [];
              if (videos.length === 0) return '-';
              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {videos.map((item, index) => (
                    <video
                      key={index}
                      src={item?.url}
                      controls
                      style={{ width: 200, height: 150, borderRadius: 4 }}
                    >
                      您的浏览器不支持视频播放
                    </video>
                  ))}
                </div>
              );
            },
          },
          {
            title: '是否通过认证',
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
