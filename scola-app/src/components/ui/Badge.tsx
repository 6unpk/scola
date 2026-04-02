'use client';

import styled, { css } from 'styled-components';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const variantStyles = {
  default: css`
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray700};
  `,
  success: css`
    background: ${({ theme }) => theme.colors.successLight};
    color: #15803D;
  `,
  warning: css`
    background: ${({ theme }) => theme.colors.warningLight};
    color: #A16207;
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.dangerLight};
    color: #B91C1C;
  `,
  info: css`
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
  `,
};

const StyledBadge = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  ${({ $variant }) => variantStyles[$variant]}
`;

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant = 'default', children }: BadgeProps) {
  return <StyledBadge $variant={variant}>{children}</StyledBadge>;
}
