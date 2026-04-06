'use client';

import styled from 'styled-components';
import { RiCheckLine } from '@remixicon/react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Wrap = styled.label`
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray700};
  &:hover > span:first-of-type { border-color: ${({ theme }) => theme.colors.dark}; }
`;

const Box = styled.span<{ $checked: boolean }>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid ${({ $checked, theme }) => $checked ? theme.colors.dark : theme.colors.gray300};
  background: ${({ $checked, theme }) => $checked ? theme.colors.dark : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.12s, background 0.12s;
  color: white;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <Wrap>
      <HiddenInput type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <Box $checked={checked}>
        {checked && <RiCheckLine size={11} />}
      </Box>
      <span>{label}</span>
    </Wrap>
  );
}
