import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Empty, message } from 'antd';
import request from '@/utils/request';
import { getServiceRooms, getRoomMessages, deleteRoom } from './service';
import { RoomList, MessageList, ChatHeader, ChatInput } from './components';
import { useWebSocket } from './hooks/useWebSocket';
import { ChatWrapper, ChatArea } from './styles';
import storage from '@/utils/storage';
import type { UploadProps } from 'antd';

interface Message {
  id: number;
  chat_room_id?: number;
  roomId?: number;
  sender_type?: string;
  senderType?: string;
  message_type?: string;
  messageType?: string;
  content: string;
  createdAt: string;
}

interface Room {
  id: number;
  wechat_user_id: number;
  wechat_user: { id: number; nickname: string; avatar: string; phone?: string };
  lastMessage?: { content: string };
  unreadCount: number;
}

const ClientChat: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const selectedRoomRef = useRef<number | null>(null);

  const loadRooms = async (phone?: string, currentPageIndex: number = 1) => {
    try {
      const res: any = await getServiceRooms(phone, currentPageIndex, pageSize);
      // 处理新的分页数据格式
      if (res?.data?.data) {
        // 新格式：{ success: true, data: { data: [], total, pageIndex, pageSize, pageTotal } }
        setRooms(res.data.data || []);
        setTotal(res.data.total || 0);
        setPageIndex(res.data.pageIndex || 1);
      } else if (res?.data && Array.isArray(res.data)) {
        // 兼容旧格式：直接返回数组
        setRooms(res.data);
        setTotal(res.data.length);
      } else if (Array.isArray(res)) {
        // 兼容旧格式：直接返回数组
        setRooms(res);
        setTotal(res.length);
      } else {
        setRooms([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const loadMessages = async (roomId: number) => {
    setLoading(true);
    try {
      const res: any = await getRoomMessages(roomId, true);
      const messagesData =
        res?.data?.messages || res?.messages || res?.data || [];
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      message.error('加载消息失败');
    } finally {
      setLoading(false);
    }
  };

  const { sendMessage, joinRoom } = useWebSocket({
    onNewMessage: (msg: Message) => {
      if (
        msg.roomId === selectedRoomRef.current ||
        msg.chat_room_id === selectedRoomRef.current
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      loadRooms(searchPhone, pageIndex);
    },
  });

  const handleSelectRoom = async (id: number) => {
    setSelectedRoom(id);
    selectedRoomRef.current = id;
    await loadMessages(id);
    joinRoom(id);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !selectedRoom || sending) return;

    setSending(true);
    sendMessage(selectedRoom, text, 'text');
    setInputText('');
    setSending(false);
  };

  const handleImageUpload: UploadProps['customRequest'] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    if (!selectedRoom) return;

    try {
      setSending(true);
      const form = new FormData();
      form.append('file', file as File);
      form.append('folder', 'chat');

      const res: any = await request.post('/upload', form);
      const url = res?.data?.url;

      if (url) {
        sendMessage(selectedRoom, url, 'image');
        onSuccess?.(res);
      } else {
        throw new Error('上传失败');
      }
    } catch (e: any) {
      onError?.(e);
      message.error(e?.message || '上传失败');
    } finally {
      setSending(false);
    }
  };

  // eslint-disable-next-line
  const handleDeleteRoom = async (id: number) => {
    try {
      const res = await deleteRoom(id);
      console.log('删除响应:', res);

      // 如果删除的是当前选中的房间，清空选中状态
      if (selectedRoom === id) {
        setSelectedRoom(null);
        setMessages([]);
        selectedRoomRef.current = null;
      }

      // 立即从列表中移除该房间，提供即时反馈
      setRooms((prev) => prev.filter((room) => room.id !== id));

      message.success('删除成功');

      // 然后再刷新列表以确保数据同步
      setTimeout(() => {
        loadRooms(searchPhone, pageIndex);
      }, 100);
    } catch (error: any) {
      console.error('删除失败:', error);
      message.error(
        error?.response?.data?.message || error?.message || '删除失败',
      );
    }
  };

  useEffect(() => {
    loadRooms(searchPhone, pageIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // 搜索处理
  const handleSearch = (phone: string) => {
    setSearchPhone(phone);
    setPageIndex(1);
    loadRooms(phone, 1);
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  const currentRoom = rooms.find((r) => r.id === selectedRoom);

  // 获取当前登录用户信息
  const currentUserInfo = useMemo(() => {
    try {
      return storage.get('ddzz_userInfo') || { avatar: '', username: '客服' };
    } catch (error) {
      console.error('Failed to get user info:', error);
      return { avatar: '', username: '客服' };
    }
  }, []);

  return (
    <ChatWrapper>
      <RoomList
        rooms={rooms}
        selectedRoom={selectedRoom}
        onSelectRoom={handleSelectRoom}
        searchPhone={searchPhone}
        onSearch={handleSearch}
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        // onDeleteRoom={handleDeleteRoom}
      />

      <ChatArea>
        {selectedRoom && currentRoom ? (
          <>
            <ChatHeader
              avatar={currentRoom.wechat_user.avatar}
              nickname={currentRoom.wechat_user.nickname}
              status="在线"
              phone={currentRoom.wechat_user.phone}
            />
            <MessageList
              messages={messages}
              loading={loading}
              currentUserType="service"
              currentUserAvatar={currentUserInfo.avatar}
              currentUserNickname={currentUserInfo.username}
              otherUserAvatar={currentRoom.wechat_user.avatar}
              otherUserNickname={currentRoom.wechat_user.nickname}
            />
            <ChatInput
              value={inputText}
              onChange={setInputText}
              onSend={handleSend}
              onImageUpload={handleImageUpload}
              sending={sending}
              disabled={!selectedRoom}
            />
          </>
        ) : (
          <Empty description="请选择聊天房间" style={{ marginTop: 120 }} />
        )}
      </ChatArea>
    </ChatWrapper>
  );
};

export default ClientChat;
