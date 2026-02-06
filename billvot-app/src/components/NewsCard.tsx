import { styled } from "@app/styles";

const CardContainer = styled("div", {
  backgroundColor: "$white",
  borderRadius: "16px",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  boxSizing: "border-box",
  cursor: "pointer",
});

const Thumbnail = styled("div", {
  width: "64px",
  height: "64px",
  borderRadius: "12px",
  backgroundColor: "$cg100",
  flexShrink: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const ContentContainer = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minWidth: 0,
});

const Title = styled("p", {
  fontSize: "14px",
  fontWeight: 500,
  color: "$cg900",
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  lineHeight: "1.4",
});

const Date = styled("p", {
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg500",
  margin: 0,
});

export type NewsCardProps = {
  title: string;
  date: string;
  thumbnailUrl?: string;
  onClick?: () => void;
};

function NewsCard({ title, date, thumbnailUrl, onClick }: NewsCardProps) {
  return (
    <CardContainer onClick={onClick}>
      <Thumbnail
        css={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : {}}
      />
      <ContentContainer>
        <Title>{title}</Title>
        <Date>{date}</Date>
      </ContentContainer>
    </CardContainer>
  );
}

export default NewsCard;
