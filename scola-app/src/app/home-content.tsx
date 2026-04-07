'use client';

import styled from 'styled-components';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CuratedPlacesSection from '@/components/home/CuratedPlacesSection';
import PromoBannerSection from '@/components/home/PromoBannerSection';
import GuideBannerSection from '@/components/home/GuideBannerSection';
import ReviewsSection from '@/components/home/ReviewsSection';

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray50};
  display: flex;
  flex-direction: column;
`;

export default function HomePage() {
  return (
    <Page>
      <Navbar />
      <HeroSection />
      <CuratedPlacesSection />
      <PromoBannerSection />
      <GuideBannerSection />
      <ReviewsSection />
      <Footer />
    </Page>
  );
}
