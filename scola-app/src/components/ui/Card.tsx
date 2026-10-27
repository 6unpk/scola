'use client';

import styled, { css } from 'styled-components';

export const cardBase = css`
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.dark};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const cardHover = css`
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

export const cardThumbDivider = css`
  border-bottom: 2px solid ${({ theme }) => theme.colors.dark};
`;

export const Card = styled.div`
  ${cardBase}
`;

export const CardHeader = styled.div<{ $clickable?: boolean }>`
  padding: 16px 20px;
  ${({ $clickable, theme }) =>
    $clickable &&
    `
    cursor: pointer;
    &:hover { background: ${theme.colors.gray50}; }
    &:active { background: ${theme.colors.gray100}; }
  `}
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray900};
`;

export const CardDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 4px;
`;

export const CardContent = styled.div`
  padding: 0 20px 20px;
`;
