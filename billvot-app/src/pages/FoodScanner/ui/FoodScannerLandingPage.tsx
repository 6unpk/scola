import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

import { styled, keyframes } from "@app/styles";
import MainHeader from "@app/components/MainHeader";
import BaseButton from "@app/components/BaseButton";
import googlePlayImage from "@app/assets/google_play.png";
import googlePlayImageWhite from "@app/assets/google_play_white.png";
import appleStoreImage from "@app/assets/apple_store.png";
import appleStoreImageWhite from "@app/assets/apple_store_white.png";
import instagramIcon from "@app/assets/instagram.png";
import youtubeIcon from "@app/assets/youtube.png";
import tiktokIcon from "@app/assets/tiktok.png";
import heroPhone1 from "@app/assets/hero-phone-1.png";
import heroPhone2 from "@app/assets/hero-phone-2.png";
import heroPhone3 from "@app/assets/hero-phone-3.png";
import heroLogo1 from "@app/assets/hero-logo-1.png";
import heroLogo2 from "@app/assets/hero-logo-2.png";
import heroLogo3 from "@app/assets/hero-logo-3.png";
import heroLogo4 from "@app/assets/hero-logo-4.png";
import heroLogo5 from "@app/assets/hero-logo-5.png";
import sectionBackFruit1 from "@app/assets/section-back-fruit1.png";
import sectionBackFruit2 from "@app/assets/section-back-fruit2.png";
import sectionWave from "@app/assets/section-wave.png";

import { foodSearchService } from "@foodscanner/shared";

// Keyframes 정의
const scrollAnimation = keyframes({
  "0%": { transform: "translateX(0)" },
  "100%": { transform: "translateX(-50%)" },
});

const scrollLogoAnimation = keyframes({
  "0%": { transform: "translateX(0)" },
  "100%": { transform: "translateX(-50%)" },
});

const scrollBottomAnimation = keyframes({
  "0%": { transform: "translateX(0)" },
  "100%": { transform: "translateX(-50%)" },
});

const bounceAnimation = keyframes({
  "0%, 100%": { transform: "translateY(0)" },
  "50%": { transform: "translateY(-10px)" },
});

// 애니메이션을 위한 커스텀 훅
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

const Container = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "#095933",
  overflowX: "hidden",
  overflowY: "scroll",
  WebkitOverflowScrolling: "touch",
  boxSizing: "border-box",
});

const HeroSection = styled("section", {
  width: "100%",
  minHeight: "80vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  backgroundColor: "#095933",
  paddingTop: "80px",
  paddingBottom: "24px",
  position: "relative",
});

const ScrollBanner = styled("div", {
  width: "100%",
  overflow: "hidden",
  marginBottom: "24px",
  boxSizing: "border-box",
});

const ScrollBannerInner = styled("div", {
  display: "flex",
  animation: `${scrollAnimation} 20s linear infinite`,
});

const ScrollBannerText = styled("div", {
  fontFamily: "SUIT",
  fontSize: "26px",
  fontWeight: 900,
  letterSpacing: "0.1em",
  opacity: 0.7,
  color: "#15D278",
  flexShrink: 0,
  margin: "0 16px",
  whiteSpace: "nowrap",
});

const Title = styled("h1", {
  fontFamily: "Pretendard",
  fontSize: "24px",
  fontWeight: 500,
  lineHeight: "1.193",
  color: "#FFFFFF",
  margin: 0,
  textAlign: "center",
  paddingLeft: "20px",
  paddingRight: "20px",
  boxSizing: "border-box",
});

const AppPreviewContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "48px",
  marginBottom: "24px",
  justifyContent: "center",
  alignItems: "stretch",
  width: "100%",
  paddingLeft: "20px",
  paddingRight: "20px",
  boxSizing: "border-box",
});

const AppDownloadButton = styled(BaseButton, {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  border: "1px solid #FFFFFF",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 20px",
  width: "100%",
  height: "56px",
  textDecoration: "none",
  boxSizing: "border-box",
  "&:hover": {
    opacity: 0.9,
  },
});

const AppButtonImage = styled("img", {
  width: "120px",
  height: "36px",
  objectFit: "contain",
  flexShrink: 0,
});

const SocialContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  marginBottom: "32px",
  justifyContent: "center",
});

const SocialLink = styled("a", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  textDecoration: "none",
});

const SocialIcon = styled("img", {
  width: "48px",
  height: "48px",
  objectFit: "contain",
});

const SocialText = styled("span", {
  fontFamily: "Pretendard",
  fontSize: "10px",
  fontWeight: 500,
  color: "#FFFFFF",
  textAlign: "center",
});

const Subtitle = styled("div", {
  fontFamily: "Pretendard",
  fontSize: "13px",
  fontWeight: 500,
  color: "#FFFFFF",
  textAlign: "center",
  marginTop: "16px",
  paddingLeft: "20px",
  paddingRight: "20px",
  boxSizing: "border-box",
  animation: `${bounceAnimation} 2s ease-in-out infinite`,
});

const ContentSection = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  paddingTop: "60px",
  paddingBottom: "60px",
  transition: "opacity 1s ease-out, transform 1s ease-out",
  position: "relative",
  overflow: "hidden",
});

const ContentWrapper = styled("div", {
  width: "100%",
  maxWidth: "100%",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  paddingLeft: "20px",
  paddingRight: "20px",
  boxSizing: "border-box",
});

const SectionTitle = styled("h2", {
  fontFamily: "Pretendard",
  fontSize: "20px",
  fontWeight: 700,
  lineHeight: "1.4",
  color: "#FFFFFF",
  marginBottom: "8px",
});

const SectionTitleDark = styled("h2", {
  fontFamily: "Pretendard",
  fontSize: "20px",
  fontWeight: 700,
  lineHeight: "1.4",
  color: "#12161A",
  marginBottom: "8px",
});

const Paragraph = styled("p", {
  fontFamily: "Pretendard",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1.6",
  color: "#E4EAF0",
  marginBottom: "0",
});

const ParagraphDark = styled("p", {
  fontFamily: "Pretendard",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "1.6",
  color: "#525C66",
  marginBottom: "12px",
});

const PhonePreviewImage = styled("img", {
  width: "200px",
  maxWidth: "100%",
  margin: "24px auto 0",
  display: "block",
});

const LogoCarousel = styled("div", {
  width: "100%",
  padding: "24px 0",
  marginTop: "24px",
  backgroundColor: "white",
  overflow: "hidden",
  boxSizing: "border-box",
});

const LogoCarouselInner = styled("div", {
  display: "flex",
  animation: `${scrollLogoAnimation} 15s linear infinite`,
});

const LogoImage = styled("img", {
  flexShrink: 0,
  margin: "0 16px",
  height: "48px",
  width: "auto",
  objectFit: "contain",
});

const AppPreviewRow = styled("div", {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  marginTop: "24px",
});

const AppPreviewBox = styled("img", {
  width: "120px",
  height: "240px",
  borderRadius: "16px",
  objectFit: "cover",
});

const SmallText = styled("div", {
  fontFamily: "Pretendard",
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "1.193",
  color: "#6C7680",
  textAlign: "center",
  marginTop: "16px",
});

const BackgroundImage = styled("img", {
  position: "absolute",
  zIndex: 0,
  pointerEvents: "none",
  objectFit: "contain",
});

const BottomBanner = styled("section", {
  width: "100%",
  overflow: "hidden",
  padding: "16px 0",
  backgroundColor: "#F7F9FA",
  boxSizing: "border-box",
});

const BottomBannerInner = styled("div", {
  display: "flex",
  animation: `${scrollBottomAnimation} 20s linear infinite`,
});

const BottomBannerText = styled("div", {
  fontFamily: "SUIT",
  fontSize: "26px",
  fontWeight: 900,
  letterSpacing: "0.1em",
  opacity: 0.7,
  color: "#15D278",
  flexShrink: 0,
  margin: "0 16px",
  whiteSpace: "nowrap",
});

export default function FoodScannerLandingPage() {
  const navigate = useNavigate();
  const [foodCount, setFoodCount] = useState(756950);
  const [displayCount, setDisplayCount] = useState(756950);

  const section2 = useScrollAnimation();
  const section3 = useScrollAnimation();
  const section4 = useScrollAnimation();
  const section5 = useScrollAnimation();
  const section6 = useScrollAnimation();

  useEffect(() => {
    const loadFoodCount = async () => {
      try {
        const data = await foodSearchService.getFoodCount();
        setFoodCount(data.total);
      } catch (error) {
        console.error("식품 수 조회 실패:", error);
      }
    };
    loadFoodCount();
  }, []);

  useEffect(() => {
    const startCount = displayCount;
    const endCount = foodCount;

    if (startCount === endCount) return;

    const difference = endCount - startCount;
    const duration = 800;
    const steps = 50;
    const stepValue = difference / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayCount(endCount);
        clearInterval(timer);
      } else {
        setDisplayCount(startCount + Math.round(stepValue * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [foodCount]);

  return (
    <Container>
      <MainHeader />
      {/* 히어로 섹션 */}
      <HeroSection>
        <ScrollBanner>
          <ScrollBannerInner>
            {[...Array(20)].map((_, i) => (
              <ScrollBannerText key={i}>FOOD SCANNER</ScrollBannerText>
            ))}
          </ScrollBannerInner>
        </ScrollBanner>

        <Title>
          사진 한 번으로 투명하게, 푸드스캐너
          <br />
          {displayCount.toLocaleString()}개의 식품을 바로 검색하기
        </Title>

        <AppPreviewContainer>
          <AppDownloadButton
            as="a"
            href="https://play.google.com/store/apps/details?id=com.prbridge.foodscanner&pli=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppButtonImage src={googlePlayImageWhite} alt="Google Play" />
          </AppDownloadButton>
          <AppDownloadButton
            as="a"
            href="https://apps.apple.com/us/app/%ED%91%B8%EB%93%9C%EC%8A%A4%EC%BA%90%EB%84%88/id6753624429"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppButtonImage src={appleStoreImageWhite} alt="Apple Store" />
          </AppDownloadButton>
        </AppPreviewContainer>

        <SocialContainer>
          <SocialLink
            href="https://www.instagram.com/foodscanner_official/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon src={instagramIcon} alt="Instagram" />
            <SocialText>인스타 바로가기</SocialText>
          </SocialLink>

          <SocialLink
            href="https://www.youtube.com/@foodscanner_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon src={youtubeIcon} alt="YouTube" />
            <SocialText>유튜브 바로가기</SocialText>
          </SocialLink>

          <SocialLink
            href="https://www.tiktok.com/@foodscanner_official"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialIcon src={tiktokIcon} alt="TikTok" />
            <SocialText>틱톡 바로가기</SocialText>
          </SocialLink>
        </SocialContainer>

        <Subtitle>푸드스캐너를 더 알아보세요!</Subtitle>
      </HeroSection>

      {/* 푸드스캐너는 푸드 성분 분석과 기사 정보를 제공해요 섹션 */}
      <ContentSection
        ref={section2.ref}
        style={{
          backgroundColor: "#095933",
          backgroundImage: `url(${sectionWave})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: section2.isVisible ? 1 : 0,
          transform: section2.isVisible ? "translateY(0)" : "translateY(60px)",
        }}
      >
        <ContentWrapper style={{ gap: "12px" }}>
          <SectionTitle>
            푸드스캐너는 푸드 성분 분석과
            <br /> 기사 정보를 제공해요
          </SectionTitle>

          <Paragraph>
            여러분들은 자신이 먹고 마시는 음식에
            <br /> 대해 얼마나 알고 계신가요
          </Paragraph>

          <Paragraph>
            현재 화학물질로 사용되는 식품성분 수가
            <br /> 수천 수만 개에 이르고 있으나, 실제 현실은
            <br /> 소비자들이 식품의 포함된 원재료 및 첨가물의 안전성을
            <br /> 직접 확인하기 어렵고 위험도를 평가하는 기준도
            <br /> 통일되어 있지 않은 상태입니다.
          </Paragraph>

          <Paragraph>
            각 식품마다 원재료명이 표기되어 있으나
            <br /> 해당 성분들이 정확히 어떤 의미를 가지는지
            <br /> 이해하고 분석할 수 있는 사람은 거의 없습니다.
            <br /> 또한, 원재료 및 첨가물이 어떤 용도로 사용되고
            <br /> 어느 정도 주의를 해야 하는지에 대한
            <br /> 공신력이 있는 기관의 정보도 손쉽게 접근할 수 있어야 합니다.
          </Paragraph>

          <Paragraph>
            푸드스캐너는 사람들이 자신들이 먹고 있는
            <br /> 성분들을 직관적으로 알 수 있도록 해<br /> 좋은 식품을 선택할
            수 있는 권리를 찾아주고자
            <br /> AI 기반의 식품 데이터 분석 시스템 및 정보 서비스를
            <br /> 제공하며 계속적인 고도화를 이루어나갈 것입니다.
          </Paragraph>
        </ContentWrapper>
      </ContentSection>

      {/* 알고 먹는것과 모르고 먹는건 다르니까 섹션 */}
      <ContentSection
        ref={section3.ref}
        style={{
          backgroundColor: "#F7F9FA",
          opacity: section3.isVisible ? 1 : 0,
          transform: section3.isVisible ? "translateY(0)" : "translateY(60px)",
          transition: "opacity 1s ease-out 0.2s, transform 1s ease-out 0.2s",
          paddingBottom: "0",
        }}
      >
        <ContentWrapper>
          <SectionTitleDark>
            알고 먹는 것과 모르고 먹는 건 다르니까
            <br />
            푸드스캐너가 읽어드릴게요
          </SectionTitleDark>
          <ParagraphDark>
            수천 수만개의 식품 성분들을 직접 확인하고 피하는 것은
            <br /> 매우 복잡한일이죠. 푸드스캐너는 우리가 먹는 식품 성분을 보다
            <br /> 직관적으로 보여줍니다.
            <br />
            <br />
            3초만 투자해서 소중한 식문화를 함께 만들어가요!
          </ParagraphDark>
          <PhonePreviewImage src={heroPhone1} alt="푸드스캐너 앱 미리보기" />
        </ContentWrapper>
      </ContentSection>

      {/* 국내 식약처 데이터 분석 섹션 */}
      <ContentSection
        ref={section4.ref}
        style={{
          backgroundColor: "#095933",
          opacity: section4.isVisible ? 1 : 0,
          transform: section4.isVisible ? "translateY(0)" : "translateY(60px)",
          transition: "opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s",
        }}
      >
        <ContentWrapper>
          <Paragraph style={{ fontSize: "20px", fontWeight: 700 }}>
            국내 식약처 {displayCount.toLocaleString()}개 식품 데이터를
            <br />
            세계적인 6개 이상의 기관 및 공식적인
            <br />
            논문 자료를 기반으로 분석해요
            <br />
            <br />
            푸드스캐너는 늘 과학적 임상 및 연구 발표에
            <br />귀 기울이고 있어요
          </Paragraph>
        </ContentWrapper>

          <LogoCarousel>
            <LogoCarouselInner>
              {[...Array(8)].map((_, i) =>
              [heroLogo1, heroLogo2, heroLogo3, heroLogo4, heroLogo5].map(
                (logo, j) => (
                  <LogoImage
                    key={`${i}-${j}`}
                    src={logo}
                    alt={`기관 로고 ${j + 1}`}
                  />
                ),
              ),
              )}
            </LogoCarouselInner>
          </LogoCarousel>
      </ContentSection>

      {/* 더 쉽게 현명할 수 있도록 섹션 */}
      <ContentSection
        ref={section5.ref}
        style={{
          backgroundColor: "#F7F9FA",
          opacity: section5.isVisible ? 1 : 0,
          transform: section5.isVisible ? "translateY(0)" : "translateY(60px)",
          transition: "opacity 1s ease-out 0.4s, transform 1s ease-out 0.4s",
        }}
      >
        <ContentWrapper>
          <SectionTitleDark>
            더 쉽게 현명하게 판단할 수 있도록
            <br />
            사진 한 장으로 분석해 드려요
          </SectionTitleDark>
          <ParagraphDark>
            AI를 활용한 이미지 분석과 식약처 및 국제적 기반 데이터로 <br />
            등록된 성분을 분석하고 시각화합니다.
            <br />
            더 이상 식품 뒷면 작은 글씨를 일일이 확인할 필요 없이
            <br />
            푸드스캐너에서 빠르게 확인하세요
          </ParagraphDark>
          <SmallText>
            *푸드 성분 스캐너 기능은 모바일 앱(App) 설치 시 사용 가능합니다.
          </SmallText>
          <AppPreviewRow>
            <AppPreviewBox src={heroPhone2} alt="푸드스캐너 앱 화면 1" />
            <AppPreviewBox src={heroPhone3} alt="푸드스캐너 앱 화면 2" />
          </AppPreviewRow>
        </ContentWrapper>
      </ContentSection>

      {/* 건강한 푸드 라이프, 이제 푸드스캐너와 함께해요! 섹션 */}
      <ContentSection
        ref={section6.ref}
        style={{
          backgroundColor: "#095933",
          opacity: section6.isVisible ? 1 : 0,
          transform: section6.isVisible ? "translateY(0)" : "translateY(60px)",
          transition: "opacity 1s ease-out 0.5s, transform 1s ease-out 0.5s",
        }}
      >
        <BackgroundImage
          src={sectionBackFruit2}
          alt=""
          style={{
            left: 0,
            bottom: "30%",
            transform: "translateY(50%)",
            width: "160px",
            height: "auto",
          }}
        />
        <BackgroundImage
          src={sectionBackFruit1}
          alt=""
          style={{
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "280px",
            height: "auto",
          }}
        />
        <ContentWrapper style={{ position: "relative", zIndex: 1 }}>
          <SectionTitle>
            건강한 푸드 라이프,
            <br /> 이제 푸드스캐너와 함께해요!
          </SectionTitle>

          <Paragraph>
            세계적으로도 주의가 필요한 식품 첨가물들은
            <br /> 가이드 및 기준 허용치가있어요.
            <br /> 또한, 이미 질환을 앓고 있는 분들이라면
            <br /> 더더욱 피해야 할 성분들도 존재합니다.
          </Paragraph>

          <Paragraph>
            식품 성분에는 블랙홀이 존재한다는 것 알고 계신가요?
            <br /> 일례로 FDA는 1990년 당시 식용 색소 적색 3호가
            <br /> 동물에게 암을 유발한다고 결정했으나
            <br /> 30년이 지난 지금도 여전히 우리는
            <br /> 적색 3호를 식품에 사용하고 있어요.
          </Paragraph>

          <Paragraph>
            뿐만 아닙니다.
            <br /> 금지 결정이 내려진다 해도 정보를 알지 못해
            <br /> 무방비로 섭취중인 경우도 있습니다.
          </Paragraph>

          <Paragraph>
            푸드스캐너는 더 나은 푸드라이프 환경을
            <br /> 만들기 위해, 여러분이 제대로 알고 구매 결정을
            <br />할 수 있도록 전 여정을 함께하기 위해 노력할게요.
          </Paragraph>
        </ContentWrapper>
      </ContentSection>

      {/* 하단 CTA 섹션 */}
      <ContentSection style={{ backgroundColor: "#F7F9FA" }}>
        <ContentWrapper>
          <SectionTitleDark>
            나와 우리의 식문화 형성을 위해
            <br />
            푸드스캐너와 함께 해요
          </SectionTitleDark>
          <ParagraphDark>
            똑똑한 소비자가 늘어날 수록
            <br />
            좋은 제품을 만드는 플레이어도 늘어날 거에요.
            <br />
            푸드스캐너와 함께 맛있는 문화를 만들어요!
          </ParagraphDark>
          <AppPreviewContainer>
            <AppDownloadButton
              as="a"
              href="https://play.google.com/store/apps/details?id=com.prbridge.foodscanner&pli=1"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #15D278" }}
            >
              <AppButtonImage src={googlePlayImage} alt="Google Play" />
            </AppDownloadButton>
            <AppDownloadButton
              as="a"
              href="https://apps.apple.com/us/app/%ED%91%B8%EB%93%9C%EC%8A%A4%EC%BA%90%EB%84%88/id6753624429"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #15D278" }}
            >
              <AppButtonImage src={appleStoreImage} alt="Apple Store" />
            </AppDownloadButton>
          </AppPreviewContainer>
        </ContentWrapper>
      </ContentSection>

      {/* FOOD SCANNER 캐로셀 배너 - 하단 */}
      <BottomBanner>
        <BottomBannerInner>
          {[...Array(20)].map((_, i) => (
            <BottomBannerText key={i}>FOOD SCANNER</BottomBannerText>
          ))}
        </BottomBannerInner>
      </BottomBanner>
    </Container>
  );
}
