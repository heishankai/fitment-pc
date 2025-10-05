import React, { useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// components
import OperateModal from './components/OperateModal';

const Table = () => {
  const operateModalRef = useRef<any>(null);
  return (
    <PageContainer>
      <ProTable
        headerTitle={
          <Space>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => operateModalRef.current.handleOpenModal('add')}
            >
              新增
            </Button>
          </Space>
        }
      />
      <OperateModal ref={operateModalRef} />
    </PageContainer>
  );
};

export default Table;
