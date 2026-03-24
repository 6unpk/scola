class AttendancesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_lesson

  def index
    @attendances = @lesson.attendances.includes(:student)
    @attendances = @attendances.where(date: params[:date]) if params[:date].present?
    render json: {
      status: { code: 200 },
      data: @attendances.map { |a| attendance_json(a) }
    }
  end

  def upsert
    @attendance = @lesson.attendances.find_or_initialize_by(
      student_id: params[:attendance][:student_id],
      date: params[:attendance][:date]
    )
    if @attendance.update(status: params[:attendance][:status], note: params[:attendance][:note])
      render json: { status: { code: 200 }, data: attendance_json(@attendance) }
    else
      render json: { status: { code: 422 }, errors: @attendance.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def bulk_upsert
    date = params[:date]
    records = params[:attendances]

    results = records.map do |record|
      attendance = @lesson.attendances.find_or_initialize_by(
        student_id: record[:student_id],
        date: date
      )
      attendance.status = record[:status]
      attendance.note = record[:note]
      attendance.save
      attendance
    end

    if results.all?(&:persisted?)
      render json: { status: { code: 200 }, data: results.map { |a| attendance_json(a) } }
    else
      render json: { status: { code: 422, message: '일부 출석 저장에 실패했습니다.' } }, status: :unprocessable_entity
    end
  end

  private

  def set_lesson
    @lesson = current_user.lessons.find(params[:lesson_id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: { code: 404, message: '수업을 찾을 수 없습니다.' } }, status: :not_found
  end

  def attendance_json(attendance)
    {
      id: attendance.id,
      student_id: attendance.student_id,
      student_name: attendance.student.name,
      date: attendance.date,
      status: attendance.status,
      note: attendance.note
    }
  end
end
