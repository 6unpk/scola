namespace :places do
  desc '회원 후기가 있는 장소의 rating/review_count를 후기 평균으로 재집계'
  task refresh_ratings: :environment do
    updated = 0
    Place.joins(:reviews).distinct.find_each do |place|
      scope = place.reviews
      avg   = scope.average(:rating)
      place.update_columns(rating: avg&.round(1), review_count: scope.count)
      updated += 1
    end
    puts "재집계 완료: #{updated}곳"
  end
end
