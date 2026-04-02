'use client';

import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
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
