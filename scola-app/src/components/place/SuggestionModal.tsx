'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { RiCheckboxCircleFill } from '@remixicon/react';
import Dialog, { DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/Dialog';
import { Input, Textarea, Label, FieldGroup } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Place } from '@/types/place';

const SAUNA_TYPES = ['건식', '습식', '건식+습식'];
const GENDER_TYPES = ['남성전용', '여성전용', '남녀공용'];

const TEXT_FIELDS: { key: keyof Place; label: string; placeholder?: string }[] = [
  { key: 'sauna_temp', label: '사우나 온도', placeholder: '예: 80~100°C' },
  { key: 'hot_bath_temp', label: '온탕 온도', placeholder: '예: 42°C' },
  { key: 'cold_bath_temp', label: '냉탕 온도', placeholder: '예: 15°C' },
  { key: 'open_hours', label: '영업시간', placeholder: '예: 24시간 / 06:00 - 23:00' },
  { key: 'admission_fee', label: '입장료', placeholder: '예: 성인 10,000원' },
  { key: 'age_restriction', label: '이용 연령', placeholder: '예: 만 13세 이상' },
];
const NUMBER_FIELDS: { key: keyof Place; label: string; placeholder?: string }[] = [
  { key: 'room_count', label: '방 개수', placeholder: '예: 5' },
  { key: 'parking_count', label: '주차 대수', placeholder: '예: 50' },
];
const BOOL_FIELDS: { key: keyof Place; label: string }[] = [
  { key: 'is_24hours', label: '24시간' },
  { key: 'has_restaurant', label: '식당/매점' },
  { key: 'has_sleep_room', label: '수면실' },
  { key: 'has_massage', label: '마사지' },
  { key: 'has_gym', label: '헬스장' },
  { key: 'kids_facility', label: '키즈 시설' },
  { key: 'membership_available', label: '회원권' },
];
const ARRAY_FIELDS: { key: keyof Place; label: string; placeholder?: string }[] = [
  { key: 'bath_types', label: '탕 종류', placeholder: '예: 온탕, 냉탕, 노천탕' },
  { key: 'special_rooms', label: '특수 시설', placeholder: '예: 소금방, 황토방, 숯가마' },
  { key: 'amenities', label: '기타 편의시설', placeholder: '예: 이발소, PC방, 카페' },
  { key: 'tags', label: '태그', placeholder: '예: 불한증막, 프리미엄, 루프탑' },
];

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray900};
  background: ${({ theme }) => theme.colors.white};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; border-width: 2px; }
`;

const GroupTitle = styled.p`
  font-size: 12px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 18px 0 10px;
  &:first-child { margin-top: 0; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const CheckGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const Intro = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 4px;
`;

const ErrMsg = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 8px;
`;

const Success = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 24px 8px;
  color: ${({ theme }) => theme.colors.gray700};
  svg { color: ${({ theme }) => theme.colors.success}; }
  strong { font-size: 16px; color: ${({ theme }) => theme.colors.dark}; }
  span { font-size: 13.5px; line-height: 1.6; color: ${({ theme }) => theme.colors.gray500}; }
`;

interface Props {
  place: Place;
  open: boolean;
  onClose: () => void;
}

type FormState = Record<string, string | boolean>;

function buildInitial(place: Place): FormState {
  const s: FormState = {};
  [...TEXT_FIELDS, ...NUMBER_FIELDS].forEach(({ key }) => {
    const v = place[key];
    s[key] = v === null || v === undefined ? '' : String(v);
  });
  s.sauna_type = place.sauna_type ?? '';
  s.gender_type = place.gender_type ?? '';
  BOOL_FIELDS.forEach(({ key }) => { s[key] = place[key] === true; });
  ARRAY_FIELDS.forEach(({ key }) => { s[key] = ((place[key] as string[]) ?? []).join(', '); });
  return s;
}

function splitComma(v: string): string[] {
  return v.split(',').map((x) => x.trim()).filter(Boolean);
}

export default function SuggestionModal({ place, open, onClose }: Props) {
  const { user, isAuthenticated } = useAuthStore();
  const authed = isAuthenticated();

  const initial = useMemo(() => buildInitial(place), [place]);
  const [form, setForm] = useState<FormState>(initial);
  const [authorName, setAuthorName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const buildPayload = (): Record<string, unknown> => {
    const p: Record<string, unknown> = {};
    [...TEXT_FIELDS, ...NUMBER_FIELDS].forEach(({ key }) => {
      const v = (form[key] as string).trim();
      if (v && v !== initial[key]) p[key] = v;
    });
    (['sauna_type', 'gender_type'] as const).forEach((key) => {
      const v = form[key] as string;
      if (v && v !== initial[key]) p[key] = v;
    });
    BOOL_FIELDS.forEach(({ key }) => {
      if (form[key] !== initial[key]) p[key] = form[key];
    });
    ARRAY_FIELDS.forEach(({ key }) => {
      const arr = splitComma(form[key] as string);
      if (arr.length && arr.join(', ') !== initial[key]) p[key] = arr;
    });
    return p;
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    if (Object.keys(payload).length === 0) {
      setError('추가하거나 수정할 정보를 입력해주세요.');
      return;
    }
    if (!authed && !authorName.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post(`/places/${place.id}/suggestions`, {
        suggestion: {
          payload,
          author_name: authed ? undefined : authorName.trim(),
          note: note.trim() || undefined,
        },
      });
      setDone(true);
    } catch (e) {
      const err = e as { response?: { data?: { errors?: string[] } } };
      setError(err.response?.data?.errors?.join(', ') ?? '오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(initial);
    setAuthorName('');
    setNote('');
    setError('');
    setDone(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="560px">
      <DialogHeader>
        <DialogTitle>{done ? '제보 완료' : `${place.name} 정보 제보`}</DialogTitle>
      </DialogHeader>

      {done ? (
        <DialogBody>
          <Success>
            <RiCheckboxCircleFill size={44} />
            <strong>제보 감사합니다!</strong>
            <span>검토 후 실제 정보에 반영됩니다.<br />더 정확한 스콜라를 함께 만들어요.</span>
          </Success>
          <DialogFooter>
            <Button variant="primary" onClick={handleClose}>닫기</Button>
          </DialogFooter>
        </DialogBody>
      ) : (
        <>
          <DialogBody>
            <Intro>알고 계신 정보만 채워주세요. 비어있는 항목은 건드리지 않아도 됩니다.</Intro>

            <GroupTitle>사우나 스펙</GroupTitle>
            <Grid>
              <FieldGroup>
                <Label>사우나 종류</Label>
                <StyledSelect value={form.sauna_type as string} onChange={(e) => set('sauna_type', e.target.value)}>
                  <option value="">-- 선택 --</option>
                  {SAUNA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </StyledSelect>
              </FieldGroup>
              <FieldGroup>
                <Label>성별 구분</Label>
                <StyledSelect value={form.gender_type as string} onChange={(e) => set('gender_type', e.target.value)}>
                  <option value="">-- 선택 --</option>
                  {GENDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </StyledSelect>
              </FieldGroup>
              {[...TEXT_FIELDS.slice(0, 3), ...NUMBER_FIELDS].map(({ key, label, placeholder }) => (
                <FieldGroup key={key}>
                  <Label>{label}</Label>
                  <Input
                    value={form[key] as string}
                    inputMode={NUMBER_FIELDS.some((n) => n.key === key) ? 'numeric' : undefined}
                    placeholder={placeholder}
                    onChange={(e) => set(key, e.target.value)}
                  />
                </FieldGroup>
              ))}
            </Grid>

            <GroupTitle>영업 · 이용</GroupTitle>
            <Grid>
              {TEXT_FIELDS.slice(3).map(({ key, label, placeholder }) => (
                <FieldGroup key={key}>
                  <Label>{label}</Label>
                  <Input value={form[key] as string} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} />
                </FieldGroup>
              ))}
            </Grid>

            <GroupTitle>편의시설 (있는 것만 체크)</GroupTitle>
            <CheckGrid>
              {BOOL_FIELDS.map(({ key, label }) => (
                <Checkbox key={key} label={label} checked={form[key] as boolean} onChange={(c) => set(key, c)} />
              ))}
            </CheckGrid>

            <GroupTitle>탕 · 시설 (쉼표로 구분)</GroupTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ARRAY_FIELDS.map(({ key, label, placeholder }) => (
                <FieldGroup key={key}>
                  <Label>{label}</Label>
                  <Input value={form[key] as string} placeholder={placeholder} onChange={(e) => set(key, e.target.value)} />
                </FieldGroup>
              ))}
            </div>

            <GroupTitle>{authed ? '메모 (선택)' : '작성자'}</GroupTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!authed && (
                <FieldGroup>
                  <Label>닉네임</Label>
                  <Input value={authorName} placeholder="닉네임 (최대 20자)" maxLength={20} onChange={(e) => setAuthorName(e.target.value)} />
                </FieldGroup>
              )}
              <FieldGroup>
                <Label>메모 (선택)</Label>
                <Textarea value={note} placeholder="관리자에게 남길 참고사항이 있다면 적어주세요." maxLength={200} onChange={(e) => setNote(e.target.value)} />
              </FieldGroup>
            </div>

            {error && <ErrMsg>{error}</ErrMsg>}
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={submitting}>취소</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? '제출 중…' : '제보하기'}
            </Button>
          </DialogFooter>
        </>
      )}
    </Dialog>
  );
}
