'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
`;

const Panel = styled.div<{ $maxWidth?: string }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth || '500px'};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.gray400};
  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray600};
  }
`;

export const DialogHeader = styled.div`
  padding: 20px 20px 0;
`;

export const DialogTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

export const DialogBody = styled.div`
  padding: 16px 20px;
`;

export const DialogFooter = styled.div`
  padding: 0 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

interface DialogProps {
  open: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
}

export default function Dialog({ open, onClose, maxWidth, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Panel $maxWidth={maxWidth}>
        <CloseButton onClick={onClose}>
          <X size={18} />
        </CloseButton>
        {children}
      </Panel>
    </Overlay>
  );
}
