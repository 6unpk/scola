import { HTMLAttributes } from "react";

import { styled } from "@app/styles";
import { CSS, VariantProps } from "@stitches/react";

import arrowBack from "@app/assets/arrow_back.svg";
import heartLine from "@app/assets/heart-line.svg";
import filledFavorite from "@app/assets/filled_favorite.svg";
import share from "@app/assets/share.svg";

const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "54px",
  backgroundColor: "white",
  boxSizing: "border-box",

  variants: {
    bottomBorder: {
      true: { borderBottom: "1px solid $cg100" },
    },
    overlay: {
      true: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        backgroundColor: "transparent",
        borderBottom: "none",
      },
    },
  },
});

const HeaderTitle = styled("h1", {
  fontSize: "18px",
  color: "$cg900",
  margin: 0,
  flex: 1,
  textAlign: "center",
});

const LeftButtonsContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

const RightButtonsContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

const LikeButtonContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "54px", // 헤더 높이와 동일하게 고정
  paddingTop: "8px", // 아이콘을 원래 위치에 고정
});

const LikeCount = styled("span", {
  fontSize: "10px",
  color: "white",
  fontWeight: "500",
  marginTop: "2px", // 아이콘과의 간격
  lineHeight: 1,
});

const Button = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "$cg900",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",

  "&:disabled": {
    color: "$cg300",
    cursor: "not-allowed",
  },

  variants: {
    iconColor: {
      white: {
        color: "white",
        "& img": {
          filter: "brightness(0) invert(1)", // SVG를 흰색으로 변경
        },
      },
      black: {
        color: "$cg900",
        "& img": {
          filter: "none", // 기본 색상 유지
        },
      },
    },
  },
});

interface ButtonConfig {
  icon?: string;
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  iconColor?: "white" | "black";
}

interface PageHeaderProps {
  title: string;
  bottomBorder?: boolean;
  overlay?: boolean;
  isScrolled?: boolean;
  leftButton?: ButtonConfig;
  rightButton?: ButtonConfig;
  onLikeClick?: () => void;
  onShareClick?: () => void;
  likeCount?: number;
  isBookmarked?: boolean;
  css?: CSS;
}

function PageHeader({
  title,
  leftButton,
  rightButton,
  bottomBorder,
  overlay,
  isScrolled,
  onLikeClick,
  onShareClick,
  likeCount,
  isBookmarked,
  css,
}: PageHeaderProps) {
  return (
    <HeaderContainer
      css={{
        ...css,
        // 스크롤 상태에 따른 동적 스타일
        ...(overlay &&
          isScrolled && {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            "& img": {
              filter: "none !important",
            },
            "& button": {
              color: "$cg900 !important",
            },
          }),
      }}
      bottomBorder={bottomBorder}
      overlay={overlay}
    >
      <LeftButtonsContainer>
        <Button
          onClick={leftButton?.onClick}
          disabled={leftButton?.disabled}
          iconColor={leftButton?.iconColor}
        >
          {leftButton?.icon === "back" && (
            <img src={arrowBack} alt="뒤로가기" width={24} height={24} />
          )}
          {leftButton?.text}
        </Button>
      </LeftButtonsContainer>
      <HeaderTitle>{title}</HeaderTitle>
      <RightButtonsContainer>
        {onLikeClick && (
          <LikeButtonContainer>
            <Button onClick={onLikeClick} iconColor={leftButton?.iconColor}>
              <img 
                src={isBookmarked ? filledFavorite : heartLine} 
                alt={isBookmarked ? "북마크됨" : "북마크"} 
                width={24} 
                height={24} 
              />
            </Button>
            {likeCount !== undefined && <LikeCount>{likeCount}</LikeCount>}
          </LikeButtonContainer>
        )}
        {/* {onShareClick && (
          <Button onClick={onShareClick} iconColor={leftButton?.iconColor}>
            <img src={share} alt="공유" width={48} height={48} />
          </Button>
        )} */}
      </RightButtonsContainer>
    </HeaderContainer>
  );
}

export default PageHeader;
