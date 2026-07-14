'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiUserLine, RiMailLine, RiStarFill, RiMapPin2Line,
  RiCalendarLine, RiDeleteBin6Line, RiArrowLeftLine, RiArrowRightLine,
  RiArrowDownSLine, RiLockPasswordLine, RiPencilLine,
} from '@remixicon/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import {
  Page, ProfileHeader, ProfileInner, Avatar, ProfileInfo, Nickname, EmailRow, LogoutBtn,
  Body, Card, CardHeader, AccordionRow, AccordionTrigger, AccordionBody,
  FieldGroup, FieldLabel, FieldInput, FormMsg, FormActions, PrimaryBtn, GhostBtn,
  SectionLabel, ReviewList, ReviewCard, PlaceThumb, ReviewContent, ReviewTop,
  PlaceName, PlaceAddr, Stars, ReviewBody, ReviewFooter, ReviewMeta, MetaItem,
  DeleteBtn, EmptyState, Pagination, PageBtn,
} from './styles';

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
    place.thumbnail ?? '/place-placeholder.svg';

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
                        onError={(e) => { (e.target as HTMLImageElement).src = '/place-placeholder.svg'; }}
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
