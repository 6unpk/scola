'use client';

import styled from 'styled-components';

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray900};
  background: ${({ theme }) => theme.colors.white};
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    border-width: 2px;
  }
`;

export default StyledSelect;
