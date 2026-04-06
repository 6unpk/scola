'use client';

import { useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const Track = styled.div<{ $duration: number; $paused: boolean }>`
  display: flex;
  width: max-content;
  animation: ${scroll} ${({ $duration }) => $duration}s linear infinite;
  ${({ $paused }) => $paused && css`animation-play-state: paused;`}
`;

const Viewport = styled.div`
  overflow: hidden;
  width: 100%;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Group = styled.div`
  display: flex;
  gap: 16px;
  padding-right: 16px;
`;

interface Props {
  children: React.ReactNode;
  duration?: number;       // 전체 루프 시간(초) — 명시하면 그대로 사용
  secPerItem?: number;     // 카드 1개당 이동 시간(초) — duration 미지정 시 사용
  pauseOnHover?: boolean;
}

export default function AutoCarousel({ children, duration, secPerItem = 4, pauseOnHover = true }: Props) {
  const pausedRef = useRef(false);
  const count = Array.isArray(children) ? children.length : 1;
  const actualDuration = duration ?? count * secPerItem;

  return (
    <Viewport
      onMouseEnter={() => { if (pauseOnHover) pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <Track
        $duration={actualDuration}
        $paused={false}
        style={{ '--paused': 'running' } as React.CSSProperties}
        onMouseEnter={(e) => {
          if (pauseOnHover) (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
        }}
      >
        {/* 두 번 렌더링해서 seamless loop */}
        <Group>{children}</Group>
        <Group aria-hidden="true">{children}</Group>
      </Track>
    </Viewport>
  );
}
