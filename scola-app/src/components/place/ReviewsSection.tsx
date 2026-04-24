'use client';

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  RiStarFill, RiStarLine, RiUserLine, RiDeleteBinLine,
  RiPencilLine, RiCalendarLine,
} from '@remixicon/react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: number;
  body: string;
  rating: number;
  visited_at: string | null;
  created_at: string;
  user: { id: number; nickname: string };
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Wrap = styled.div``;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Card = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 22px;
`;

// ── 작성 폼 ──
const FormCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gray50};
  border-color: ${({ theme }) => theme.colors.gray200};
`;

const FormTitle = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: 14px;
`;

const StarRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
`;

const StarBtn = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${({ $active }) => $active ? '#EAB308' : '#D1D5DB'};
  transition: color 0.1s;
  &:hover { color: #EAB308; }
`;

const VisitedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const DateInput = styled.input`
  padding: 6px 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.dark};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.dark};
  resize: vertical;
  outline: none;
  font-family: inherit;
  line-height: 1.6;
  box-sizing: border-box;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  &::placeholder { color: ${({ theme }) => theme.colors.gray300}; }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const CharCount = styled.span`font-size: 12px; color: ${({ theme }) => theme.colors.gray400};`;

const SubmitBtn = styled.button`
  padding: 8px 20px;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover:not(:disabled) { opacity: 0.88; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

const LoginNudge = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
  padding: 18px 0 4px;
  a { color: ${({ theme }) => theme.colors.primary}; text-decoration: none; font-weight: 600; &:hover { text-decoration: underline; } }
`;

const ErrMsg = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger ?? '#EF4444'};
  margin-top: 6px;
`;

// ── 후기 목록 ──
const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ReviewItem = styled.div`
  padding: 18px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  &:last-child { border-bottom: none; }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

const ReviewUser = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

const ReviewMeta = styled.div`display: flex; flex-direction: column; gap: 2px;`;

const ReviewNick = styled.span`font-size: 14px; font-weight: 700; color: ${({ theme }) => theme.colors.dark};`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
  display: flex;
  align-items: center;
  gap: 3px;
`;

const ReviewRight = styled.div`display: flex; align-items: center; gap: 10px;`;

const Stars = styled.div`display: flex; gap: 2px;`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray300};
  padding: 2px;
  &:hover { color: ${({ $danger }) => $danger ? '#EF4444' : '#424242'}; }
`;

const EditForm = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EditActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelBtn = styled.button`
  padding: 6px 14px;
  background: none;
  border: 1.5px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray500};
  cursor: pointer;
`;

const SaveBtn = styled(SubmitBtn)`padding: 6px 14px;`;

const ReviewBody = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray700};
`;

const VisitedTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-top: 6px;
`;

const EmptyState = styled.p`
  text-align: center;
  padding: 32px 0 16px;
  color: ${({ theme }) => theme.colors.gray300};
  font-size: 14px;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewsSection({ placeId }: { placeId: number }) {
  const { user, token, isAuthenticated } = useAuthStore();
  const authed = isAuthenticated();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [body, setBody] = useState('');
  const [visitedAt, setVisitedAt] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editVisitedAt, setEditVisitedAt] = useState('');
  const [editError, setEditError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get(`/places/${placeId}/reviews`);
      setReviews(res.data.data);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const hasMyReview = !!user && reviews.some((r) => r.user.id === user.id);

  const handleSubmit = async () => {
    if (!body.trim() || body.length < 10) { setError('후기는 10자 이상 작성해주세요.'); return; }
    setError('');
    setSubmitting(true);
    try {
      await api.post(
        `/places/${placeId}/reviews`,
        { review: { body, rating, visited_at: visitedAt || null } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBody('');
      setRating(5);
      setVisitedAt('');
      await fetchReviews();
    } catch (e: any) {
      const msgs = e.response?.data?.errors;
      setError(msgs ? msgs.join(', ') : '오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setEditBody(r.body);
    setEditRating(r.rating);
    setEditVisitedAt(r.visited_at ? r.visited_at.slice(0, 10) : '');
    setEditError('');
  };

  const cancelEdit = () => { setEditingId(null); setEditError(''); };

  const handleUpdate = async (id: number) => {
    if (editBody.trim().length < 10) { setEditError('후기는 10자 이상 작성해주세요.'); return; }
    setEditSubmitting(true);
    setEditError('');
    try {
      const res = await api.patch(
        `/places/${placeId}/reviews/${id}`,
        { review: { body: editBody, rating: editRating, visited_at: editVisitedAt || null } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews((prev) => prev.map((r) => r.id === id ? res.data.data : r));
      setEditingId(null);
    } catch (e: any) {
      const msgs = e.response?.data?.errors;
      setEditError(msgs ? msgs.join(', ') : '오류가 발생했습니다.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('후기를 삭제할까요?')) return;
    try {
      await api.delete(`/places/${placeId}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Wrap>
      <Card>
        <SectionTitle>
          <RiPencilLine size={14} />
          스콜라 이용 후기 {reviews.length > 0 && `(${reviews.length})`}
        </SectionTitle>

        {/* 작성 폼 */}
        {authed && !hasMyReview && (
          <FormCard style={{ marginBottom: 20 }}>
            <FormTitle>후기 남기기</FormTitle>
            <StarRow>
              {[1, 2, 3, 4, 5].map((n) => (
                <StarBtn
                  key={n}
                  $active={n <= (hovered || rating)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
                >
                  <RiStarFill size={22} />
                </StarBtn>
              ))}
            </StarRow>
            <VisitedRow>
              <RiCalendarLine size={13} />
              <span>방문일 (선택)</span>
              <DateInput
                type="date"
                value={visitedAt}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setVisitedAt(e.target.value)}
              />
            </VisitedRow>
            <Textarea
              placeholder="이 곳에서의 경험을 자유롭게 적어주세요. (10자 이상)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={1000}
            />
            {error && <ErrMsg>{error}</ErrMsg>}
            <FormActions>
              <CharCount>{body.length} / 1000</CharCount>
              <SubmitBtn onClick={handleSubmit} disabled={submitting || body.length < 10}>
                {submitting ? '등록 중...' : '후기 등록'}
              </SubmitBtn>
            </FormActions>
          </FormCard>
        )}

        {authed && hasMyReview && (
          <FormCard style={{ marginBottom: 20 }}>
            <LoginNudge style={{ padding: '4px 0' }}>이미 후기를 작성했습니다.</LoginNudge>
          </FormCard>
        )}

        {!authed && (
          <LoginNudge>
            <a href="/login">로그인</a> 후 후기를 남길 수 있습니다.
          </LoginNudge>
        )}

        {/* 후기 목록 */}
        {loading ? (
          <EmptyState>불러오는 중...</EmptyState>
        ) : reviews.length === 0 ? (
          <EmptyState>아직 후기가 없습니다. 첫 번째 후기를 남겨보세요!</EmptyState>
        ) : (
          <ReviewList>
            {reviews.map((r) => (
              <ReviewItem key={r.id}>
                <ReviewHeader>
                  <ReviewUser>
                    <Avatar><RiUserLine size={15} /></Avatar>
                    <ReviewMeta>
                      <ReviewNick>{r.user.nickname}</ReviewNick>
                      <ReviewDate>
                        {formatDate(r.created_at)}
                      </ReviewDate>
                    </ReviewMeta>
                  </ReviewUser>
                  <ReviewRight>
                    {editingId !== r.id && (
                      <Stars>
                        {[1, 2, 3, 4, 5].map((n) => (
                          n <= r.rating
                            ? <RiStarFill key={n} size={14} color="#EAB308" />
                            : <RiStarLine key={n} size={14} color="#D1D5DB" />
                        ))}
                      </Stars>
                    )}
                    {user?.id === r.user.id && editingId !== r.id && (
                      <>
                        <ActionBtn onClick={() => startEdit(r)}><RiPencilLine size={14} /></ActionBtn>
                        <ActionBtn $danger onClick={() => handleDelete(r.id)}><RiDeleteBinLine size={14} /></ActionBtn>
                      </>
                    )}
                  </ReviewRight>
                </ReviewHeader>

                {editingId === r.id ? (
                  <EditForm>
                    <StarRow style={{ marginBottom: 0 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <StarBtn key={n} $active={n <= editRating} onClick={() => setEditRating(n)}>
                          <RiStarFill size={20} />
                        </StarBtn>
                      ))}
                    </StarRow>
                    <VisitedRow>
                      <RiCalendarLine size={13} />
                      <span>방문일</span>
                      <DateInput
                        type="date"
                        value={editVisitedAt}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEditVisitedAt(e.target.value)}
                      />
                    </VisitedRow>
                    <Textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      maxLength={1000}
                      style={{ minHeight: 80 }}
                    />
                    {editError && <ErrMsg>{editError}</ErrMsg>}
                    <EditActions>
                      <CharCount>{editBody.length} / 1000</CharCount>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <CancelBtn onClick={cancelEdit}>취소</CancelBtn>
                        <SaveBtn onClick={() => handleUpdate(r.id)} disabled={editSubmitting || editBody.length < 10}>
                          {editSubmitting ? '저장 중...' : '저장'}
                        </SaveBtn>
                      </div>
                    </EditActions>
                  </EditForm>
                ) : (
                  <>
                    <ReviewBody>{r.body}</ReviewBody>
                    {r.visited_at && (
                      <VisitedTag>
                        <RiCalendarLine size={11} />
                        {new Date(r.visited_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })} 방문
                      </VisitedTag>
                    )}
                  </>
                )}
              </ReviewItem>
            ))}
          </ReviewList>
        )}
      </Card>
    </Wrap>
  );
}
