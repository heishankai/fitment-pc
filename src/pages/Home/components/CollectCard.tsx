import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const CollectCard = () => {
  const cardData = [
    {
      title: '今日新增用户',
      value: 93,
      prefix: <UserOutlined />,
      suffix: '+12%',
      trend: 'up',
      color: '#52c41a',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: '今日交易额',
      value: 812800,
      prefix: <DollarOutlined />,
      suffix: '+8.2%',
      trend: 'up',
      color: '#1890ff',
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: '今日新增订单',
      value: 1128,
      prefix: <ShoppingCartOutlined />,
      suffix: '-2.1%',
      trend: 'down',
      color: '#fa8c16',
      bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ];

  return (
    <Row gutter={[24, 24]}>
      {cardData.map((item, index) => (
        <Col xs={24} sm={12} lg={8} key={index}>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              border: 'none',
              background: item.bgGradient,
              color: 'white',
              overflow: 'hidden',
              position: 'relative',
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {React.cloneElement(item.prefix, {
                    style: {
                      fontSize: 24,
                      color: 'white',
                    },
                  })}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 4,
                    }}
                  >
                    {item.trend === 'up' ? (
                      <ArrowUpOutlined
                        style={{ color: '#52c41a', fontSize: 12 }}
                      />
                    ) : (
                      <ArrowDownOutlined
                        style={{ color: '#ff4d4f', fontSize: 12 }}
                      />
                    )}
                    <Text
                      style={{
                        color: item.trend === 'up' ? '#52c41a' : '#ff4d4f',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {item.suffix}
                    </Text>
                  </div>
                </div>
              </div>

              <div>
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </Text>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: 'white',
                    marginTop: 8,
                    lineHeight: 1.2,
                  }}
                >
                  {item.value.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 装饰性背景元素 */}
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                zIndex: 1,
              }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CollectCard;
