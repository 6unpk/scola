'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    overscroll-behavior: none;
    background: ${({ theme }) => theme.colors.gray50};
  }

  body {
    height: 100%;
    font-family: var(--font-ibm-plex-sans-kr), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    color: ${({ theme }) => theme.colors.dark};
    background: ${({ theme }) => theme.colors.gray50};
    overscroll-behavior: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font: inherit;
  }

  input, textarea, select {
    font: inherit;
  }
`;

export default GlobalStyle;
