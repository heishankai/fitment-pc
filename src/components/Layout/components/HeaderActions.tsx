import React from 'react';
import { useNavigate } from '@umijs/max';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useGetPriceNotification } from './hooks/useGetPriceNotification';
import { Badge, Popover, List, Empty } from 'antd';

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: ${theme.colors.white};
  cursor: pointer;
  transition: ${theme.transitions.normal};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);

    &::before {
      width: 100%;
      height: 100%;
    }
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

const NotificationList = styled.div`
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }

  .notification-item {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f5f5;
    }

    &:last-child {
      border-bottom: none;
    }

    .notification-title {
      font-weight: 500;
      margin-bottom: 4px;
      color: #333;
    }

    .notification-content {
      font-size: 12px;
      color: #666;
      line-height: 1.5;
    }

    .notification-time {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
  }
`;

interface Action {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  showStatus?: boolean;
}

interface HeaderActionsProps {
  actions?: Action[];
}

const HeaderActions: React.FC<HeaderActionsProps> = ({ actions }) => {
  const navigate = useNavigate();
  const { notifications, clearNotifications, removeNotification } =
    useGetPriceNotification();

  const handleNotificationClick = (notification: any) => {
    // 跳转到获取报价管理页面
    navigate('/config/get-price');
    // 移除该通知
    removeNotification(notification.id);
  };

  const notificationContent = (
    <NotificationList>
      {notifications.length === 0 ? (
        <Empty description="暂无新通知" style={{ padding: '20px 0' }} />
      ) : (
        <>
          <div
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 500 }}>获取报价通知</span>
            {notifications.length > 0 && (
              <span
                style={{
                  fontSize: '12px',
                  color: '#1890ff',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotifications();
                }}
              >
                清空
              </span>
            )}
          </div>
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <div
                className="notification-item"
                onClick={() => handleNotificationClick(item)}
              >
                <div className="notification-title">
                  新的获取报价请求 #{item.id}
                </div>
                <div className="notification-content">
                  <div>位置：{item.location}</div>
                  <div>
                    {item.houseTypeName} · {item.area}㎡ · {item.roomType}
                  </div>
                  <div>手机号：{item.phone}</div>
                </div>
                <div className="notification-time">
                  {new Date(item.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
            )}
          />
        </>
      )}
    </NotificationList>
  );

  const handleNoticeClick = () => {
    // 点击通知图标时，如果通知列表为空，跳转到获取报价管理页面
    if (notifications.length === 0) {
      navigate('/config/get-price');
    }
  };

  const defaultActions: Action[] = [
    {
      icon: '🔔',
      title: '通知',
      showStatus: notifications.length > 0,
      onClick: handleNoticeClick,
    },
  ];

  const finalActions = actions || defaultActions;

  return (
    <>
      {finalActions.map((action, index) => {
        if (action.title === '通知') {
          return (
            <Popover
              key={index}
              content={notificationContent}
              title={null}
              trigger="hover"
              placement="bottomRight"
              overlayStyle={{ padding: 0 }}
            >
              <ActionButton title={action.title} onClick={action.onClick}>
                <Badge
                  count={notifications.length}
                  offset={[6, -6]}
                  size="small"
                  style={{
                    fontSize: '10px',
                    minWidth: '14px',
                    height: '14px',
                    lineHeight: '14px',
                    padding: '0 3px',
                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.2)',
                  }}
                  overflowCount={99}
                >
                  {action.icon}
                </Badge>
              </ActionButton>
            </Popover>
          );
        }
        return (
          <ActionButton
            key={index}
            title={action.title}
            onClick={action.onClick}
          >
            {action.icon}
          </ActionButton>
        );
      })}
    </>
  );
};

export default HeaderActions;
