import { useState, useEffect } from "react";
import { notificationService } from "@app/api/rest/services";
import { Notification, NotificationSummary } from "@app/api/rest/services";
import { useAuthStore } from "@app/store/useAuthStore";

export const useNotifications = (page = 0, size = 20) => {
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getAllNotifications(page, size);
      setNotifications(response.result || []);
      setTotalPages(Math.ceil((response.total || 0) / size));
      setTotalElements(response.total || 0);
    } catch (err: unknown) {
      console.error("알림 로드 중 오류:", err);
      setError("알림을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, size, isAuthenticated]);

  return { 
    notifications, 
    loading, 
    error, 
    totalPages, 
    totalElements, 
    refetch: fetchNotifications 
  };
};

export const useUnreadNotifications = (page = 0, size = 20) => {
  const { isAuthenticated } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUnreadNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getUnreadNotifications(page, size);
      setNotifications(response.result || []);
      setTotalPages(Math.ceil((response.total || 0) / size));
      setTotalElements(response.total || 0);
    } catch (err: unknown) {
      console.error("읽지 않은 알림 로드 중 오류:", err);
      setError("읽지 않은 알림을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, [page, size, isAuthenticated]);

  return { 
    notifications, 
    loading, 
    error, 
    totalPages, 
    totalElements, 
    refetch: fetchUnreadNotifications 
  };
};

export const useNotificationSummary = () => {
  const { isAuthenticated } = useAuthStore();
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    if (!isAuthenticated) {
      setSummary(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotificationSummary();
      setSummary(response);
    } catch (err: unknown) {
      console.error("알림 요약 로드 중 오류:", err);
      setError("알림 요약을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [isAuthenticated]);

  return { summary, loading, error, refetch: fetchSummary };
};

export const useNotificationActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = async (notificationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.markAsRead(notificationId);
      return response;
    } catch (err: unknown) {
      console.error("알림 읽음 처리 중 오류:", err);
      setError("알림 읽음 처리에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markMultipleAsRead = async (notificationIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.markMultipleAsRead(notificationIds);
      return response;
    } catch (err: unknown) {
      console.error("여러 알림 읽음 처리 중 오류:", err);
      setError("여러 알림 읽음 처리에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.markAllAsRead();
      return response;
    } catch (err: unknown) {
      console.error("모든 알림 읽음 처리 중 오류:", err);
      setError("모든 알림 읽음 처리에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await notificationService.deleteNotification(notificationId);
      return true;
    } catch (err: unknown) {
      console.error("알림 삭제 중 오류:", err);
      setError("알림 삭제에 실패했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    markAsRead,
    markMultipleAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
    error,
  };
};
