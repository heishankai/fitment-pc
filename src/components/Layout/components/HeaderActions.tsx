import React, { useMemo, useState } from 'react';
import { useNavigate } from '@umijs/max';
import styled from 'styled-components';
import { Badge, Popover, List, Empty, Tabs, Button, Avatar } from 'antd';
import dayjs from 'dayjs';

import TipsButton from '@/components/TipsButton';
import { useAdminNotification } from './hooks/useAdminNotification';
import type { AdminNotification } from '../service';

/* ====================== 样式 ====================== */

const NotificationList = styled.div`
  width: 400px;
  max-height: 500px;
  overflow-x: hidden;
`;

/* ====================== 常量 ====================== */

const NOTIFICATION_TYPE = {
  GET_PRICE: 'get-price',
  CHAT: 'chat-message',
} as const;

type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

/* ====================== 组件 ====================== */

const HeaderActions: React.FC = () => {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useAdminNotification();

  const [activeTab, setActiveTab] = useState<NotificationType>(
    NOTIFICATION_TYPE.GET_PRICE,
  );

  /* ====================== 数据兜底 ====================== */

  const notificationsList: AdminNotification[] = Array.isArray(notifications)
    ? notifications
    : [];

  /* ====================== 分组 + 未读统计（一次遍历） ====================== */

  const { grouped, unread } = useMemo(() => {
    const grouped: Record<NotificationType, AdminNotification[]> = {
      [NOTIFICATION_TYPE.GET_PRICE]: [],
      [NOTIFICATION_TYPE.CHAT]: [],
    };

    const unread: Record<NotificationType, number> = {
      [NOTIFICATION_TYPE.GET_PRICE]: 0,
      [NOTIFICATION_TYPE.CHAT]: 0,
    };

    notificationsList.forEach((item) => {
      const type = item.notification_type as NotificationType;
      if (!grouped[type]) return;

      grouped[type].push(item);
      if (!item.is_read) unread[type]++;
    });

    return { grouped, unread };
  }, [notificationsList]);

  /* ====================== 点击通知 ====================== */

  const handleNotificationClick = async (notification: AdminNotification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.notification_type === NOTIFICATION_TYPE.GET_PRICE) {
      navigate('/order/get-price');
    }

    if (notification.notification_type === NOTIFICATION_TYPE.CHAT) {
      const { chat_type, room_id } = notification.extra_data || {};

      if (chat_type === 'wechat-chat') {
        navigate('/customer-service/client-chat-page', {
          state: { roomId: room_id },
        });
      }

      if (chat_type === 'craftsman-chat') {
        navigate('/customer-service/craftsman-chat-page', {
          state: { roomId: room_id },
        });
      }
    }

    removeNotification(notification.id);
  };

  /* ====================== 全部已读 ====================== */

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(activeTab);
  };

  /* ====================== 渲染列表 ====================== */

  const renderList = (list: AdminNotification[], showAvatar = false) => {
    if (!list.length) {
      return <Empty description="暂无通知" style={{ padding: '20px 0' }} />;
    }

    return (
      <List
        split
        itemLayout="horizontal"
        dataSource={list}
        style={{ maxHeight: 400, overflowY: 'auto' }}
        renderItem={(item, index) => (
          <List.Item
            onClick={() => handleNotificationClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <List.Item.Meta
              avatar={
                showAvatar ? (
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                ) : null
              }
              title={item.title}
              description={dayjs(item.notification_time).format(
                'YYYY-MM-DD HH:mm:ss',
              )}
            />
          </List.Item>
        )}
      />
    );
  };

  /* ====================== Tabs ====================== */

  const tabItems = [
    {
      key: NOTIFICATION_TYPE.GET_PRICE,
      label: (
        <>
          获取报价 <Badge count={unread[NOTIFICATION_TYPE.GET_PRICE]} />
        </>
      ),
      children: renderList(grouped[NOTIFICATION_TYPE.GET_PRICE]),
    },
    {
      key: NOTIFICATION_TYPE.CHAT,
      label: (
        <>
          消息通知 <Badge count={unread[NOTIFICATION_TYPE.CHAT]} />
        </>
      ),
      children: renderList(grouped[NOTIFICATION_TYPE.CHAT], true),
    },
  ];

  /* ====================== 渲染 ====================== */

  return (
    <Popover
      trigger="hover"
      placement="bottomRight"
      content={
        <NotificationList>
          <Tabs
            items={tabItems}
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as NotificationType)}
            tabBarExtraContent={
              unread[activeTab] > 0 && (
                <Button type="link" onClick={handleMarkAllAsRead}>
                  全部已读
                </Button>
              )
            }
          />
        </NotificationList>
      }
    >
      <TipsButton
        badge={{
          count: unreadCount,
          size: 'small',
          offset: [-6, 6],
        }}
      >
        🔔
      </TipsButton>
    </Popover>
  );
};

export default HeaderActions;
