import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Modal } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import { getIsSkillVerifiedInfoService } from '../service';

const IsSkillVerifiedModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [record, setRecord] = useState<any>(null);

  const {
    run: getIsSkillVerifiedInfoRun,
    data: isSkillVerifiedInfo,
    loading,
  } = useRequest(getIsSkillVerifiedInfoService, {
    manual: true,
  });

  // 打开弹窗方法
  const handleOpenModal = (record: any) => {
    setRecord(record);
    getIsSkillVerifiedInfoRun(record?.id);
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
      title="技能认证信息"
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
          ...isSkillVerifiedInfo?.data,
          promise_image: isSkillVerifiedInfo?.data?.promise_image?.[0]?.url,
        }}
        columns={[
          {
            title: '工种ID',
            dataIndex: 'workKindId',
          },
          {
            title: '工种名称',
            dataIndex: 'workKindName',
          },
          {
            title: '承诺图片',
            dataIndex: 'promise_image',
            span: 2,
            hideInSearch: true,
            valueType: 'image',
            fieldProps: {
              width: 50,
              height: 50,
            },
          },
          {
            title: '操作视频',
            dataIndex: 'operation_video',
            span: 2,
            render: () => {
              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <video
                    key={isSkillVerifiedInfo?.data?.operation_video?.[0]?.url}
                    src={isSkillVerifiedInfo?.data?.operation_video?.[0]?.url}
                    controls
                    style={{ width: 200, height: 150, borderRadius: 4 }}
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>
              );
            },
          },
          {
            title: '是否通过认证',
            dataIndex: 'isSkillVerified',
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

export default forwardRef(IsSkillVerifiedModal);
