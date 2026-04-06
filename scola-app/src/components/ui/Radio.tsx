'use client';

import styled from 'styled-components';

interface RadioProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
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

const Dot = styled.span<{ $checked: boolean }>`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${({ $checked, theme }) => $checked ? theme.colors.dark : theme.colors.gray300};
  background: ${({ $checked, theme }) => $checked ? theme.colors.dark : 'white'};
  position: relative;
  transition: border-color 0.12s, background 0.12s;

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: white;
    opacity: ${({ $checked }) => $checked ? 1 : 0};
    transition: opacity 0.12s;
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export default function Radio({ name, value, checked, onChange, label }: RadioProps) {
  return (
    <Wrap>
      <HiddenInput type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <Dot $checked={checked} />
      <span>{label}</span>
    </Wrap>
  );
}
