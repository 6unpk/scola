'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import {
  RiUserLine, RiMailLine, RiStarFill, RiMapPin2Line,
  RiCalendarLine, RiDeleteBin6Line, RiArrowLeftLine, RiArrowRightLine,
  RiArrowDownSLine, RiLockPasswordLine, RiPencilLine,
} from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
  id: number;
  body: string;
  rating: number;
  visited_at: string | null;
  created_at: string;
  place: {
    id: number;
    name: string;
    thumbnail: string | null;
    road_address: string | null;
    address: string | null;
    naver_place_id: string;
  };
}

interface Meta { total: number; total_pages: number; page: number; }

// ─── Styled ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
`;

const ProfileHeader = styled.div`
  background: ${({ theme }) => theme.colors.dark};
  padding: 48px 24px 44px;
`;

const ProfileInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border: 2px solid rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
`;

const ProfileInfo = styled.div`flex: 1;`;

const Nickname = styled.h1`
  font-size: 20px;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
`;

const EmailRow = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LogoutBtn = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  background: transparent;
  border: 1.5px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  &:hover { color: white; border-color: rgba(255,255,255,0.4); }
`;

const Body = styled.div`
  max-width: 860px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

// ── 설정 카드 ──

const Card = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const CardHeader = styled.h2`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray400};
  padding: 20px 22px 14px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
`;

const AccordionRow = styled.div`
  & + & { border-top: 1px solid ${({ theme }) => theme.colors.gray100}; }
`;

const AccordionTrigger = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }

  span {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.dark};
  }

  svg.chevron {
    transition: transform 0.2s;
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
    color: ${({ theme }) => theme.colors.gray400};
    flex-shrink: 0;
  }
`;

const AccordionBody = styled.div`
  padding: 4px 22px 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray100};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
`;

const FieldInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-family: inherit;
  background: white;
  outline: none;
  transition: border-color 0.15s;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
  &::placeholder { color: ${({ theme }) => theme.colors.gray400}; }
`;

const FormMsg = styled.p<{ $error?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $error, theme }) => $error ? theme.colors.danger : '#16a34a'};
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
`;

const PrimaryBtn = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 13px;
  font-weight: 700;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryHover}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const GhostBtn = styled.button`
  padding: 10px 16px;
  background: white;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 13px;
  font-weight: 600;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.gray50}; }
`;

// ── 후기 ──

const SectionLabel = styled.h2`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray300};
    text-transform: none;
    letter-spacing: 0;
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReviewCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const PlaceThumb = styled.div`
  width: 100px;
  flex-shrink: 0;
  border-right: 2px solid ${({ theme }) => theme.colors.dark};
  background: ${({ theme }) => theme.colors.gray100};
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.2s;
  }
  &:hover img { transform: scale(1.04); }
`;

const ReviewContent = styled.div`
  flex: 1;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const PlaceName = styled.p`
  font-size: 14px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.dark};
  cursor: pointer;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const PlaceAddr = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
`;

const ReviewBody = styled.p`
  font-size: 13px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.gray700};
`;

const ReviewFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 2px;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const DeleteBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
  background: white;
  border: 1.5px solid ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s;
  &:hover { background: ${({ theme }) => theme.colors.dangerLight}; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 14px;
  border: 2px dashed ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: white;
  line-height: 1.8;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  border: 2px solid ${({ $active, theme }) => $active ? theme.colors.dark : theme.colors.gray200};
  background: ${({ $active, theme }) => $active ? theme.colors.dark : 'white'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.colors.gray500};
  transition: all 0.12s;

  &:disabled { opacity: 0.35; cursor: not-allowed; }
  &:not(:disabled):hover {
    border-color: ${({ theme }) => theme.colors.dark};
    background: ${({ $active, theme }) => $active ? theme.colors.dark : theme.colors.gray50};
    color: ${({ theme }) => theme.colors.dark};
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyPage() {
  const router = useRouter();
  const { user, token, logout, setAuth } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, total_pages: 1, page: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [nameOpen, setNameOpen] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameMsg, setNameMsg] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (!token) router.replace('/login?redirect=/mypage');
  }, [token, router]);

  const fetchReviews = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get('/api/v1/me/reviews', { params: { page, per: 10 } });
      setReviews(res.data.data);
      setMeta(res.data.meta);
    } finally {
      setLoading(false);
    }
  }, [page, token]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (placeId: number, reviewId: number) => {
    if (!confirm('후기를 삭제할까요?')) return;
    await api.delete(`/places/${placeId}/reviews/${reviewId}`);
    fetchReviews();
  };

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;
    setNameSaving(true); setNameMsg('');
    try {
      await api.patch('/api/v1/users', { user: { name: nameValue.trim() } });
      setAuth({ ...user!, nickname: nameValue.trim() }, token!);
      setNameOpen(false);
    } catch {
      setNameMsg('변경에 실패했습니다.');
    } finally {
      setNameSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPw !== newPwConfirm) { setPwMsg('새 비밀번호가 일치하지 않습니다.'); return; }
    if (newPw.length < 6) { setPwMsg('비밀번호는 6자 이상이어야 합니다.'); return; }
    setPwSaving(true); setPwMsg('');
    try {
      await api.patch('/api/v1/users', {
        user: { current_password: currentPw, password: newPw, password_confirmation: newPwConfirm },
      });
      setCurrentPw(''); setNewPw(''); setNewPwConfirm('');
      setPwOpen(false);
    } catch (e: any) {
      const msgs = e.response?.data?.errors;
      setPwMsg(msgs?.join(', ') ?? '현재 비밀번호를 확인해주세요.');
    } finally {
      setPwSaving(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const thumb = (place: Review['place']) =>
    place.thumbnail ?? `https://picsum.photos/seed/${place.naver_place_id}/200/200`;

  if (!token) return null;

  return (
    <Page>
      <Navbar />

      <ProfileHeader>
        <ProfileInner>
          <Avatar><RiUserLine size={28} /></Avatar>
          <ProfileInfo>
            <Nickname>{user?.nickname ?? '이름 없음'}</Nickname>
            <EmailRow><RiMailLine size={12} />{user?.email}</EmailRow>
          </ProfileInfo>
          <LogoutBtn onClick={() => { logout(); router.push('/'); }}>로그아웃</LogoutBtn>
        </ProfileInner>
      </ProfileHeader>

      <Body>
        {/* ── 계정 설정 ── */}
        <Card>
          <CardHeader>계정 설정</CardHeader>

          <AccordionRow>
            <AccordionTrigger
              $open={nameOpen}
              onClick={() => { setNameOpen((v) => !v); setNameMsg(''); setNameValue(user?.nickname ?? ''); }}
            >
              <span><RiPencilLine size={15} />이름 변경</span>
              <RiArrowDownSLine size={16} className="chevron" />
            </AccordionTrigger>
            {nameOpen && (
              <AccordionBody>
                <FieldGroup>
                  <FieldLabel htmlFor="name-input">새 이름</FieldLabel>
                  <FieldInput
                    id="name-input"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="변경할 이름을 입력하세요"
                  />
                </FieldGroup>
                {nameMsg && <FormMsg $error>{nameMsg}</FormMsg>}
                <FormActions>
                  <PrimaryBtn onClick={handleSaveName} disabled={nameSaving || !nameValue.trim()}>
                    {nameSaving ? '저장 중...' : '저장'}
                  </PrimaryBtn>
                  <GhostBtn onClick={() => setNameOpen(false)}>취소</GhostBtn>
                </FormActions>
              </AccordionBody>
            )}
          </AccordionRow>

          <AccordionRow>
            <AccordionTrigger
              $open={pwOpen}
              onClick={() => { setPwOpen((v) => !v); setPwMsg(''); setCurrentPw(''); setNewPw(''); setNewPwConfirm(''); }}
            >
              <span><RiLockPasswordLine size={15} />비밀번호 변경</span>
              <RiArrowDownSLine size={16} className="chevron" />
            </AccordionTrigger>
            {pwOpen && (
              <AccordionBody>
                <FieldGroup>
                  <FieldLabel htmlFor="current-pw">현재 비밀번호</FieldLabel>
                  <FieldInput id="current-pw" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="현재 비밀번호 입력" />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="new-pw">새 비밀번호</FieldLabel>
                  <FieldInput id="new-pw" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="6자 이상" />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel htmlFor="new-pw-confirm">새 비밀번호 확인</FieldLabel>
                  <FieldInput id="new-pw-confirm" type="password" value={newPwConfirm} onChange={(e) => setNewPwConfirm(e.target.value)} placeholder="새 비밀번호 재입력" />
                </FieldGroup>
                {pwMsg && <FormMsg $error>{pwMsg}</FormMsg>}
                <FormActions>
                  <PrimaryBtn onClick={handleSavePassword} disabled={pwSaving || !currentPw || !newPw || !newPwConfirm}>
                    {pwSaving ? '변경 중...' : '변경'}
                  </PrimaryBtn>
                  <GhostBtn onClick={() => setPwOpen(false)}>취소</GhostBtn>
                </FormActions>
              </AccordionBody>
            )}
          </AccordionRow>
        </Card>

        {/* ── 내 후기 ── */}
        <div>
          <SectionLabel>
            내가 쓴 후기
            {meta.total > 0 && <span>{meta.total}개</span>}
          </SectionLabel>

          {loading ? (
            <ReviewList>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{
                  height: 110,
                  background: 'white',
                  border: '2px solid #E8E8E8',
                  borderRadius: 16,
                }} />
              ))}
            </ReviewList>
          ) : reviews.length === 0 ? (
            <EmptyState>
              아직 작성한 후기가 없어요.<br />방문한 장소에 첫 후기를 남겨보세요.
            </EmptyState>
          ) : (
            <>
              <ReviewList>
                {reviews.map((r) => (
                  <ReviewCard key={r.id}>
                    <PlaceThumb onClick={() => router.push(`/place/${r.place.id}`)}>
                      <img
                        src={thumb(r.place)}
                        alt={r.place.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${r.place.naver_place_id}/200/200`; }}
                      />
                    </PlaceThumb>
                    <ReviewContent>
                      <ReviewTop>
                        <div>
                          <PlaceName onClick={() => router.push(`/place/${r.place.id}`)}>{r.place.name}</PlaceName>
                          <PlaceAddr>
                            <RiMapPin2Line size={11} />
                            {r.place.road_address ?? r.place.address ?? ''}
                          </PlaceAddr>
                        </div>
                        <Stars>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <RiStarFill key={i} size={13} color={i < r.rating ? '#EAB308' : '#E8E8E8'} />
                          ))}
                        </Stars>
                      </ReviewTop>
                      <ReviewBody>{r.body}</ReviewBody>
                      <ReviewFooter>
                        <ReviewMeta>
                          {r.visited_at && (
                            <MetaItem><RiCalendarLine size={11} />방문 {formatDate(r.visited_at)}</MetaItem>
                          )}
                          <MetaItem>작성 {formatDate(r.created_at)}</MetaItem>
                        </ReviewMeta>
                        <DeleteBtn onClick={() => handleDelete(r.place.id, r.id)}>
                          <RiDeleteBin6Line size={12} />삭제
                        </DeleteBtn>
                      </ReviewFooter>
                    </ReviewContent>
                  </ReviewCard>
                ))}
              </ReviewList>

              {meta.total_pages > 1 && (
                <Pagination>
                  <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    <RiArrowLeftLine size={14} />
                  </PageBtn>
                  {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((p) => (
                    <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
                  ))}
                  <PageBtn disabled={page === meta.total_pages} onClick={() => setPage((p) => p + 1)}>
                    <RiArrowRightLine size={14} />
                  </PageBtn>
                </Pagination>
              )}
            </>
          )}
        </div>
      </Body>

      <Footer />
    </Page>
  );
}
