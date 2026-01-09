import request from '@/utils/request';

/**
 * 获取客服的聊天房间列表
 * @param phone 微信用户手机号（可选，用于搜索）
 * @param pageIndex 页码，默认1
 * @param pageSize 每页数量，默认10
 */
export const getServiceRooms = (
  phone?: string,
  pageIndex: number = 1,
  pageSize: number = 10,
) => {
  return request.get('/chat/rooms', {
    params: {
      ...(phone && { phone }),
      pageIndex,
      pageSize,
    },
  });
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
 * 标记房间消息为已读
 * @param roomId 房间ID
 */
export const markRoomAsRead = (roomId: number) => {
  return request.post(`/chat/rooms/${roomId}/read`);
};

/**
 * 删除聊天房间
 */
export const deleteRoom = (roomId: number) => {
  return request.delete(`/chat/rooms/${roomId}`);
};
