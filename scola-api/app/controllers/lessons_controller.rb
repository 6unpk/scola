class LessonsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_lesson, only: [:show, :update, :destroy, :enroll, :unenroll, :students]

  def index
    @lessons = current_user.lessons.includes(:students).order(created_at: :desc)
    render json: {
      status: { code: 200 },
      data: @lessons.map { |l| lesson_json(l) }
    }
  end

  def show
    render json: { status: { code: 200 }, data: lesson_json(@lesson) }
  end

  def create
    @lesson = current_user.lessons.build(lesson_params)
    if @lesson.save
      render json: { status: { code: 201, message: '수업이 등록되었습니다.' }, data: lesson_json(@lesson) }, status: :created
    else
      render json: { status: { code: 422 }, errors: @lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @lesson.update(lesson_params)
      render json: { status: { code: 200, message: '수업 정보가 수정되었습니다.' }, data: lesson_json(@lesson) }
    else
      render json: { status: { code: 422 }, errors: @lesson.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @lesson.destroy
    render json: { status: { code: 200, message: '수업이 삭제되었습니다.' } }
  end

  def students
    render json: {
      status: { code: 200 },
      data: @lesson.students.map { |s| s.as_json(only: [:id, :name, :phone, :grade, :school, :status]) }
    }
  end

  def enroll
    student = current_user.students.find(params[:student_id])
    @lesson.lesson_enrollments.find_or_create_by!(student: student)
    render json: { status: { code: 200, message: '학생이 수업에 등록되었습니다.' } }
  rescue ActiveRecord::RecordNotFound
    render json: { status: { code: 404, message: '학생을 찾을 수 없습니다.' } }, status: :not_found
  end

  def unenroll
    student = current_user.students.find(params[:student_id])
    enrollment = @lesson.lesson_enrollments.find_by(student: student)
    if enrollment
      enrollment.destroy
      render json: { status: { code: 200, message: '수업 등록이 취소되었습니다.' } }
    else
      render json: { status: { code: 404, message: '수강 정보를 찾을 수 없습니다.' } }, status: :not_found
    end
  rescue ActiveRecord::RecordNotFound
    render json: { status: { code: 404, message: '학생을 찾을 수 없습니다.' } }, status: :not_found
  end

  private

  def set_lesson
    @lesson = current_user.lessons.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: { code: 404, message: '수업을 찾을 수 없습니다.' } }, status: :not_found
  end

  def lesson_params
    params.require(:lesson).permit(:name, :subject, :start_time, :end_time, :status, :notes, days_of_week: [])
  end

  def lesson_json(lesson)
    lesson.as_json.merge(student_count: lesson.students.size)
  end
end
