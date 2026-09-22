'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { RiShareLine, RiCheckLine } from '@remixicon/react';
import { sharePlace } from '@/lib/share';

const Btn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
  padding: 10px;
  background: white;
  color: ${({ theme }) => theme.colors.gray700};
  border: 1.5px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  &:hover { border-color: ${({ theme }) => theme.colors.dark}; color: ${({ theme }) => theme.colors.dark}; }
`;

export default function ShareButton({ id, name }: { id: number; name: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const r = await sharePlace(id, name);
    if (r === 'copied') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Btn onClick={onClick}>
      {copied
        ? <><RiCheckLine size={13} /> 링크 복사됨</>
        : <><RiShareLine size={13} /> 공유하기</>}
    </Btn>
  );
}
