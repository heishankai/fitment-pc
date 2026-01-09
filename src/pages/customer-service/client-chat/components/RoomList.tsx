import React from 'react';
import { Avatar, Empty, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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

const SearchWrapper = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid #eee;
`;

const RoomListContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const PaginationWrapper = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnreadBadge = styled.span`
  position: relative;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4d4f;
  flex-shrink: 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff4d4f;
    transform: translate(-50%, -50%);
    animation: ripple 2s ease-out infinite;
  }

  &::after {
    animation-delay: 1s;
  }

  @keyframes ripple {
    0% {
      width: 10px;
      height: 10px;
      opacity: 0.4;
    }
    100% {
      width: 20px;
      height: 20px;
      opacity: 0;
    }
  }
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
  hasUnread?: boolean; // 是否有未读消息（红点提示）
}

interface RoomListProps {
  rooms: Room[];
  selectedRoom: number | null;
  onSelectRoom: (id: number) => void;
  searchPhone?: string;
  onSearch?: (phone: string) => void;
  pageIndex?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  // onDeleteRoom: (id: number) => void;
}

const RoomList: React.FC<RoomListProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
  searchPhone = '',
  onSearch,
  pageIndex = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  // onDeleteRoom,
}) => {
  // const handleDelete = (id: number, e?: React.MouseEvent) => {
  //   e?.stopPropagation();
  //   onDeleteRoom(id);
  // };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <RoomListContainer>
      <RoomHeader>聊天列表</RoomHeader>
      <SearchWrapper>
        <Input
          placeholder="搜索手机号"
          prefix={<SearchOutlined />}
          value={searchPhone}
          onChange={handleSearchChange}
          allowClear
        />
      </SearchWrapper>
      <RoomListContent>
        {rooms?.length === 0 ? (
          <Empty style={{ marginTop: 60 }} description="暂无聊天" />
        ) : (
          (rooms || [])?.map((room) => (
            <RoomItem
              key={room.id}
              active={selectedRoom === room.id}
              onClick={() => onSelectRoom(room.id)}
            >
              <Avatar src={room.wechat_user.avatar} size={48}>
                {room.wechat_user.nickname?.[0] || 'U'}
              </Avatar>
              <RoomInfo>
                <RoomName>
                  {room.wechat_user.nickname}
                  {room.hasUnread && <UnreadBadge />}
                </RoomName>
                <RoomMsg>{room.lastMessage?.content || '暂无消息'}</RoomMsg>
              </RoomInfo>
              {/* <Popconfirm
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
              </Popconfirm> */}
            </RoomItem>
          ))
        )}
      </RoomListContent>
      {total > 0 && (
        <PaginationWrapper>
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total) => `共 ${total} 条`}
            size="small"
          />
        </PaginationWrapper>
      )}
    </RoomListContainer>
  );
};

export default RoomList;
