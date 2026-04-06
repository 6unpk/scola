'use client';

import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray900};
  background: ${({ theme }) => theme.colors.white};
  transition: border-color 0.15s ease;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    border-width: 2px;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray900};
  background: ${({ theme }) => theme.colors.white};
  transition: border-color 0.15s ease;
  outline: none;
  resize: vertical;
  min-height: 80px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    border-width: 2px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: 4px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export { StyledInput as Input, StyledTextarea as Textarea, Label, FieldGroup };
