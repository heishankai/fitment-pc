import React from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Table = () => {
  return (
    <PageContainer>
      <ProTable
        headerTitle={
          <Space>
            <Button icon={<PlusOutlined />} type="primary">
              新增
            </Button>
          </Space>
        }
      />
    </PageContainer>
  );
};

export default Table;
