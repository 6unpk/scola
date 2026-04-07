'use client';

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { RiArrowDownSLine } from '@remixicon/react';

// ─── Styled ───────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Trigger = styled.button<{ $open: boolean; $variant: 'default' | 'dark' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  white-space: nowrap;

  ${({ $variant, theme, $open }) =>
    $variant === 'dark'
      ? `
    color: rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.08);
    border: 1.5px solid ${$open ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'};
  `
      : `
    color: ${theme.colors.dark};
    background: ${theme.colors.white};
    border: 1.5px solid ${$open ? theme.colors.primary : theme.colors.dark};
  `}

  svg {
    flex-shrink: 0;
    transition: transform 0.2s;
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  }
`;

const Dropdown = styled.ul<{ $variant: 'default' | 'dark' }>`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 100%;
  list-style: none;
  margin: 0;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  z-index: 200;

  ${({ $variant, theme }) =>
    $variant === 'dark'
      ? `
    background: #1e1e1e;
    border: 1px solid rgba(255,255,255,0.12);
  `
      : `
    background: ${theme.colors.white};
    border: 1.5px solid ${theme.colors.dark};
  `}
`;

const Option = styled.li<{ $selected: boolean; $variant: 'default' | 'dark' }>`
  padding: 8px 12px;
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? '700' : '500')};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.1s;

  ${({ $variant, $selected, theme }) =>
    $variant === 'dark'
      ? `
    color: ${$selected ? '#fff' : 'rgba(255,255,255,0.7)'};
    background: ${$selected ? 'rgba(255,255,255,0.1)' : 'transparent'};
    &:hover { background: rgba(255,255,255,0.08); color: #fff; }
  `
      : `
    color: ${theme.colors.dark};
    background: ${$selected ? theme.colors.gray100 : 'transparent'};
    &:hover { background: ${theme.colors.gray50}; }
  `}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'dark';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Select({ options, value, onChange, variant = 'default' }: SelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger
        type="button"
        $open={open}
        $variant={variant}
        onClick={() => setOpen((v) => !v)}
      >
        {selected?.label}
        <RiArrowDownSLine size={15} />
      </Trigger>

      {open && (
        <Dropdown $variant={variant}>
          {options.map((opt) => (
            <Option
              key={opt.value}
              $selected={opt.value === value}
              $variant={variant}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </Option>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  );
}
