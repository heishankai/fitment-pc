import request from '@/utils/request';

/**
 * 获取管理员的聊天房间列表
 */
export const getAdminRooms = () => {
  return request.get('/craftsman-chat/rooms');
};

/**
 * 获取房间内的消息列表
 * @param roomId 房间ID
 * @param getAll 是否获取全部消息，默认true
 */
export const getRoomMessages = (roomId: number, getAll: boolean = true) => {
  if (getAll) {
    return request.get(`/craftsman-chat/rooms/${roomId}/messages`, {
      params: { all: 'true' },
    });
  }

  return request.get(`/craftsman-chat/rooms/${roomId}/messages`, {
    params: { page: 1, pageSize: 50 },
  });
};

/**
 * 删除聊天房间
 */
export const deleteRoom = (roomId: number) => {
  return request.delete(`/craftsman-chat/rooms/${roomId}`);
};
