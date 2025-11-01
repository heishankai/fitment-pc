import React from 'react';
import { Avatar, Button, Empty, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { theme } from '@/styles/theme';

const RoomListContainer = styled.div`
  width: 320px;
  background: ${theme.colors.white};
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
`;

const RoomHeader = styled.div`
  padding: ${theme.spacing.lg};
  font-weight: 600;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  background: ${theme.colors.white};
`;

const RoomItem = styled.div<{ active?: boolean }>`
  padding: 14px ${theme.spacing.lg};
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  background: ${({ active }) => (active ? '#f0f7ff' : theme.colors.white)};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  transition: ${theme.transitions.fast};

  &:hover {
    background: #f6faff;
  }
`;

const RoomInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const RoomName = styled.div`
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 15px;
  color: #333;
`;

const RoomMsg = styled.div`
  font-size: 13px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface Room {
  id: number;
  wechat_user_id: number;
  wechat_user: { id: number; nickname: string; avatar: string; phone?: string };
  lastMessage?: { content: string };
  unreadCount: number;
}

interface RoomListProps {
  rooms: Room[];
  selectedRoom: number | null;
  onSelectRoom: (id: number) => void;
  onDeleteRoom: (id: number) => void;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  onDeleteRoom,
}) => {
  const handleDelete = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onDeleteRoom(id);
  };

  return (
    <RoomListContainer>
      <RoomHeader>聊天列表</RoomHeader>
      {rooms.length === 0 ? (
        <Empty style={{ marginTop: 60 }} description="暂无聊天" />
      ) : (
        rooms.map((room) => (
          <RoomItem
            key={room.id}
            active={selectedRoom === room.id}
            onClick={() => onSelectRoom(room.id)}
          >
            <Avatar src={room.wechat_user.avatar} size={48}>
              {room.wechat_user.nickname?.[0] || 'U'}
            </Avatar>
            <RoomInfo>
              <RoomName>{room.wechat_user.nickname}</RoomName>
              <RoomMsg>{room.lastMessage?.content || '暂无消息'}</RoomMsg>
            </RoomInfo>
            <Popconfirm
              title="确定删除？"
              onConfirm={(e) => handleDelete(room.id, e)}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </RoomItem>
        ))
      )}
    </RoomListContainer>
  );
};

export default RoomList;
