import request from '@/utils/request';
import type { ApiResponse } from '@/types';

export interface AdminNotification {
  id: number;
  title: string;
  content: string;
  notification_type: 'get-price' | 'chat-message' | 'other';
  notification_time: string;
  is_read: boolean;
  extra_data?: any;
  createdAt: string;
  updatedAt: string;
}

interface GetNotificationListParams {
  notificationType?: string;
  isRead?: boolean;
}

interface UnreadCountResponse {
  count: number;
}

/**
 * 获取通知列表
 */
export const getNotificationList = async (
  params?: GetNotificationListParams,
): Promise<ApiResponse<AdminNotification[]>> => {
  return await request.get('/admin-notification/list', { params });
};

/**
 * 获取未读通知数量
 */
export const getUnreadCount = async (
  notificationType?: string,
): Promise<ApiResponse<UnreadCountResponse>> => {
  return await request.get('/admin-notification/unread-count', {
    params: notificationType ? { notificationType } : undefined,
  });
};

/**
 * 标记通知为已读
 */
export const markNotificationAsRead = async (
  notificationId: number,
): Promise<ApiResponse<void>> => {
  return await request.put(`/admin-notification/read/${notificationId}`);
};

/**
 * 标记所有通知为已读
 */
export const markAllNotificationsAsRead = async (
  notificationType?: string,
): Promise<ApiResponse<void>> => {
  return await request.put('/admin-notification/read-all', {
    params: notificationType ? { notificationType } : undefined,
  });
};
