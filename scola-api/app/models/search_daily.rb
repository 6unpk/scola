class SearchDaily < ApplicationRecord
  def self.record(raw, zero:)
    term = SearchQuery.normalize(raw)
    return if term.blank? || term.length > 50

    upsert(
      { term: term, date: Time.zone.today, count: 1, zero_count: zero ? 1 : 0 },
      unique_by: [:term, :date],
      on_duplicate: Arel.sql("count = search_dailies.count + 1, zero_count = search_dailies.zero_count + EXCLUDED.zero_count")
    )
  rescue ActiveRecord::ActiveRecordError => e
    Rails.logger.error("SearchDaily.record: #{e.message}")
  end

  def self.within(days, shift: 0)
    finish = Time.zone.today - (shift * days)
    where(date: (finish - days + 1)..finish)
  end
end
