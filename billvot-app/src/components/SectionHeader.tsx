import { styled } from "@app/styles";

const Container = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const Title = styled("h2", {
  fontSize: "20px",
  fontWeight: 700,
  color: "$cg900",
  margin: 0,
});

const MoreButton = styled("button", {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
});

const MoreText = styled("span", {
  fontSize: "12px",
  fontWeight: 500,
  color: "$cg700",
  textDecoration: "underline",
});

export type SectionHeaderProps = {
  title: string;
  onMoreClick?: () => void;
};

function SectionHeader({ title, onMoreClick }: SectionHeaderProps) {
  return (
    <Container>
      <Title>{title}</Title>
      {onMoreClick && (
        <MoreButton onClick={onMoreClick}>
          <MoreText>더보기</MoreText>
        </MoreButton>
      )}
    </Container>
  );
}

export default SectionHeader;
