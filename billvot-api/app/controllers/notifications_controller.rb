class NotificationsController < ApplicationController
  def index
    user_id = params[:user_id]
    return render json: { error: "user_id required" }, status: :bad_request if user_id.blank?

    @notifications = Notification.where(user_id: user_id).recent.limit(50)
    render json: {
      data: @notifications,
      unread_count: Notification.where(user_id: user_id).unread.count
    }
  end

  def mark_read
    notification = Notification.find(params[:id])
    notification.update(is_read: true)
    render json: notification
  end

  def mark_all_read
    user_id = params[:user_id]
    return render json: { error: "user_id required" }, status: :bad_request if user_id.blank?

    Notification.where(user_id: user_id, is_read: false).update_all(is_read: true)
    render json: { success: true }
  end
end
