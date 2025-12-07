import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Modal, Timeline, Image, Empty } from 'antd';

const ConstructionProgressModal = (props: any, ref: any) => {
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

  const constructionProgress = record?.construction_progress || [];

  return (
    <Modal
      title="施工进度"
      open={visible}
      onCancel={setFalse}
      footer={null}
      width={800}
    >
      {constructionProgress.length > 0 ? (
        <Timeline
          items={constructionProgress.map((item: any, index: number) => ({
            key: index,
            children: (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    进度 {index + 1}
                  </div>
                  <div style={{ color: '#666', marginBottom: 4 }}>
                    <span style={{ marginRight: 16 }}>
                      开始时间: {item.start_time}
                    </span>
                    <span>结束时间: {item.end_time}</span>
                  </div>
                  <div style={{ color: '#666', marginBottom: 8 }}>
                    位置: {item.location}
                  </div>
                </div>
                {item.photos && item.photos.length > 0 && (
                  <div>
                    <div style={{ marginBottom: 8, fontWeight: 'bold' }}>
                      施工照片:
                    </div>
                    <Image.PreviewGroup>
                      <div
                        style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                      >
                        {item.photos.map(
                          (photo: string, photoIndex: number) => (
                            <Image
                              key={photoIndex}
                              src={photo}
                              alt={`施工照片${photoIndex + 1}`}
                              width={100}
                              height={100}
                              style={{
                                objectFit: 'cover',
                                borderRadius: 4,
                              }}
                            />
                          ),
                        )}
                      </div>
                    </Image.PreviewGroup>
                  </div>
                )}
              </div>
            ),
          }))}
        />
      ) : (
        <Empty description="暂无施工进度" />
      )}
    </Modal>
  );
};

export default forwardRef(ConstructionProgressModal);
