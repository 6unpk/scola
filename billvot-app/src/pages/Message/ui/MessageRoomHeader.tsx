import { styled } from "@app/styles";
import { CSS } from "@stitches/react";

import ArrowBack from "@app/assets/arrow_back.svg";
import More from "@app/assets/more_horiz.svg";

const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "54px",
  backgroundColor: "white",
  borderBottom: "1px solid $cg100",
});

const HeaderTitle = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flex: 1,
});

const Title = styled("h1", {
  fontSize: "18px",
  color: "$cg900",
  margin: 0,
});

const Subtitle = styled("span", {
  fontSize: "12px",
  color: "$cg600",
  marginTop: "2px",
});

const Button = styled("button", {
  background: "none",
  border: "none",
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "46px",
});

interface MessageRoomHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMore?: () => void;
  css?: CSS;
}

function MessageRoomHeader({
  title,
  subtitle,
  onBack,
  onMore,
  css,
}: MessageRoomHeaderProps) {
  return (
    <HeaderContainer css={css}>
      <Button onClick={onBack}>
        <img src={ArrowBack} alt="뒤로가기" width={24} height={24} />
      </Button>
      <HeaderTitle>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </HeaderTitle>
      <Button onClick={onMore}>
        <img src={More} alt="더보기" width={24} height={24} />
      </Button>
    </HeaderContainer>
  );
}

export default MessageRoomHeader;
