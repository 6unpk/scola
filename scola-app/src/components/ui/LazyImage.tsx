'use client';

import { useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray100};
`;

const Img = styled.img<{ $loaded: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.4s ease, filter 0.5s ease, transform 0.5s ease;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  filter: ${({ $loaded }) => ($loaded ? 'blur(0)' : 'blur(6px)')};
  transform: ${({ $loaded }) => ($loaded ? 'scale(1)' : 'scale(1.04)')};
  will-change: opacity, filter, transform;
`;

interface Props {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export default function LazyImage({ src, alt, fallback, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const actualSrc = errored && fallback ? fallback : src;

  return (
    <Wrap className={className}>
      <Img
        src={actualSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        $loaded={loaded}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!errored && fallback && fallback !== src) {
            setErrored(true);
          } else {
            setLoaded(true);
          }
        }}
      />
    </Wrap>
  );
}
