import { restClient } from "../rest/client";

export type Notification = {
  id: number;
  user_id: number;
  notification_type: string;
  message: string;
  related_id: number | null;
  is_read: boolean;
  created_at: string;
};

export type NotificationsResponse = {
  data: Notification[];
  unread_count: number;
};

export const notificationsService = {
  getAll: async (userId: number): Promise<NotificationsResponse> => {
    const response = await restClient.get<NotificationsResponse>("/notifications", {
      params: { user_id: userId },
    });
    return response.data;
  },

  markRead: async (id: number): Promise<Notification> => {
    const response = await restClient.post<Notification>(`/notifications/${id}/mark_read`);
    return response.data;
  },

  markAllRead: async (userId: number): Promise<void> => {
    await restClient.post("/notifications/mark_all_read", { user_id: userId });
  },
};
