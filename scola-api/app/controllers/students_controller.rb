class StudentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_student, only: [:show, :update, :destroy]

  def index
    @students = current_user.students.order(created_at: :desc)
    render json: { status: { code: 200 }, data: @students }
  end

  def show
    render json: { status: { code: 200 }, data: @student }
  end

  def create
    @student = current_user.students.build(student_params)
    if @student.save
      render json: { status: { code: 201, message: '학생이 등록되었습니다.' }, data: @student }, status: :created
    else
      render json: { status: { code: 422 }, errors: @student.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @student.update(student_params)
      render json: { status: { code: 200, message: '학생 정보가 수정되었습니다.' }, data: @student }
    else
      render json: { status: { code: 422 }, errors: @student.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @student.destroy
    render json: { status: { code: 200, message: '학생이 삭제되었습니다.' } }
  end

  private

  def set_student
    @student = current_user.students.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { status: { code: 404, message: '학생을 찾을 수 없습니다.' } }, status: :not_found
  end

  def student_params
    params.require(:student).permit(
      :name, :birth_date, :gender, :school, :grade,
      :phone, :parent_name, :parent_phone, :parent_relationship,
      :enrollment_date, :status, :notes
    )
  end
end
