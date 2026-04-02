'use client';

import styled, { css } from 'styled-components';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  outline: css`
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray700};
    border: 1px solid ${({ theme }) => theme.colors.gray200};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray50};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.gray700};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray100};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.white};
    &:hover:not(:disabled) {
      background: #DC2626;
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 6px 12px;
    font-size: 13px;
  `,
  md: css`
    padding: 8px 16px;
    font-size: 14px;
  `,
  lg: css`
    padding: 12px 24px;
    font-size: 16px;
  `,
  icon: css`
    padding: 8px;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,
};

const StyledButton = styled.button<{
  $variant: Variant;
  $size: Size;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
}
