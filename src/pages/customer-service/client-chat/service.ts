import request from '@/utils/request';

/**
 * 获取客服的聊天房间列表
 */
export const getServiceRooms = () => {
  return request.get('/chat/rooms');
};

/**
 * 获取房间内的消息列表
 * @param roomId 房间ID
 * @param getAll 是否获取全部消息，默认true
 */
export const getRoomMessages = (roomId: number, getAll: boolean = true) => {
  if (getAll) {
    return request.get(`/chat/rooms/${roomId}/messages`, {
      params: { all: 'true' },
    });
  }
  
  return request.get(`/chat/rooms/${roomId}/messages`, {
    params: { page: 1, pageSize: 50 },
  });
};

/**
 * 删除聊天房间
 */
export const deleteRoom = (roomId: number) => {
  return request.delete(`/chat/rooms/${roomId}`);
};

