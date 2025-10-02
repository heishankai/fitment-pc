import Guide from '@/components/Guide';
import { Button, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { getAllUserService } from './service';
import styled from 'styled-components';

// 创建 styled-components 示例组件
const StyledCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  margin: 16px 0;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StyledButton = styled.button`
  background-color: #764ba2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 8px;

  &:hover {
    background-color: #8a5ba8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);
  }

  &:active {
    background-color: #6a3d8a;
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(118, 75, 162, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.2);
  }
`;

const StyledTitle = styled.h2`
  color: #764ba2;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const { data, loading } = useRequest(getAllUserService);
  console.log(data);
  console.log(loading);
  return (
    <PageContainer ghost>
      <StyledContainer>
        <StyledTitle>欢迎使用 Styled Components!</StyledTitle>

        <StyledCard>
          <h3>这是一个使用 styled-components 创建的卡片</h3>
          <p>你可以看到渐变背景、圆角、阴影和悬停效果</p>
          <p>用户名: {name}</p>
          <p>数据加载状态: {loading ? '加载中...' : '加载完成'}</p>
        </StyledCard>

        <div>
          <Space wrap>
            <StyledButton
              onClick={() => alert('点击了 styled-components 按钮!')}
            >
              Styled Button
            </StyledButton>
            <StyledButton onClick={() => console.log('数据:', data)}>
              查看数据
            </StyledButton>
          </Space>
        </div>

        <div style={{ marginTop: '16px' }}>
          <Space wrap>
            <Button
              type="primary"
              onClick={() => alert('点击了 Ant Design 主按钮!')}
            >
              Primary Button
            </Button>
            <Button onClick={() => alert('点击了 Ant Design 默认按钮!')}>
              Default Button
            </Button>
            <Button
              type="dashed"
              onClick={() => alert('点击了 Ant Design 虚线按钮!')}
            >
              Dashed Button
            </Button>
            <Button
              type="link"
              onClick={() => alert('点击了 Ant Design 链接按钮!')}
            >
              Link Button
            </Button>
          </Space>
        </div>

        <Guide name={name} />
      </StyledContainer>
    </PageContainer>
  );
};

export default HomePage;
