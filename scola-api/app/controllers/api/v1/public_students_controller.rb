class Api::V1::PublicStudentsController < ApplicationController
  def create
    user = User.find_by(id: params[:user_id])
    return render json: { status: { code: 404, message: '등록 링크가 유효하지 않습니다.' } }, status: :not_found unless user

    student = user.students.build(
      name: params[:name],
      grade: params[:grade],
      school: params[:school],
      phone: params[:phone],
      status: 'pending'
    )

    if student.save
      render json: { status: { code: 201, message: '등록 신청이 완료되었습니다.' } }, status: :created
    else
      render json: { status: { code: 422 }, errors: student.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
