import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService, NotificationsResponse, Notification } from "@app/api/services/notifications";
import dayjs from "dayjs";

export const useNotifications = (userId: number | undefined) => {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications", userId],
    queryFn: () => notificationsService.getAll(userId!),
    enabled: !!userId,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => notificationsService.markAllRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const formatNotificationDate = (dateString: string) => {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffInMinutes = now.diff(date, "minute");
  const diffInHours = now.diff(date, "hour");
  const diffInDays = now.diff(date, "day");

  if (diffInMinutes < 1) {
    return "방금 전";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return date.format("YYYY.MM.DD");
  }
};

export type { Notification };
