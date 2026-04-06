'use client';

import styled from 'styled-components';

export const Section = styled.section`
  padding: 48px 0;
`;

export const SectionInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.dark};
  letter-spacing: -0.5px;
`;

export const SectionMore = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  background: none;
  border: none;

  &:hover { text-decoration: underline; }
`;
