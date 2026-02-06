import Heart from "@app/assets/border_favorite.svg";
import Share from "@app/assets/share.svg";
import { styled } from "@app/styles";
import { formatBusinessCategory } from "@app/utils/format";
import { createShare } from "@app/utils/device";

import { CSS } from "@stitches/react";

const ArticleContainer = styled("article", {
  padding: "8px 16px",
  borderBottom: "1px solid $cg20",
  backgroundColor: "$cg20",
  width: "calc(100% - 32px)",
  color: "$cg700",
});

const ArticleHeader = styled("div", {
  color: "$cg600",
  fontSize: "8px",
  marginBottom: "4px",
});

const Title = styled("h2", {
  fontSize: "16px",
  fontWeight: "500",
  marginTop: "0px",
  marginBottom: "4px",
  color: "$cg900",
});

const CategoryList = styled("div", {
  display: "flex",
  gap: "8px",
  marginBottom: "4px",
});

const Category = styled("span", {
  color: "$cg600",
  fontWeight: "500",
  fontSize: "8px",
});

const ContentPreview = styled("div", {
  marginBottom: "4px",
  fontSize: "12px",
  fontWeight: "500",
});

const ImageContainer = styled("div", {
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
});

const PreviewImage = styled("img", {
  width: "40px",
  height: "40px",
  borderRadius: "4px",
});

const ActionContainer = styled("div", {
  display: "flex",
  gap: "16px",
});

const ActionButton = styled("button", {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  background: "none",
  border: "none",
  padding: "4px",
  cursor: "pointer",
  color: "$cg600",
  fontSize: "14px",
});

interface ArticleListItemProps {
  articleId: number;
  date: string;
  author: string;
  businessCategory: string;
  title: string;
  categories: string[];
  content: string;
  images: { imageId: number; imageUrl: string }[];
  imageCount?: number;
  likeCount?: number;
  css?: CSS;
  onClick?: (articleId: number) => void;
}

function ArticleListItem({
  articleId,
  date,
  author,
  title,
  categories,
  images,
  content,
  businessCategory,
  imageCount = 0,
  likeCount = 0,
  onClick,
  css,
}: ArticleListItemProps) {
  const handleShare = async () => {
    await createShare(title, content);
  };

  return (
    <ArticleContainer css={css} onClick={() => onClick?.(articleId)}>
      <ArticleHeader>
        {date} · {author} · {formatBusinessCategory(businessCategory)}
      </ArticleHeader>
      <Title>{title}</Title>
      <CategoryList>
        {categories.map((category, index) => (
          <Category key={index}>{category}</Category>
        ))}
      </CategoryList>
      <ContentPreview>{content.slice(0, 100)}...</ContentPreview>
      {imageCount > 0 && (
        <ImageContainer>
          {images.map((image, index) => (
            <PreviewImage src={image.imageUrl} key={index} />
          ))}
        </ImageContainer>
      )}
      <ActionContainer>
        <ActionButton>
          <img src={Heart} alt="좋아요" width={16} height={16} />
          좋아요
          {likeCount > 0 && ` ${likeCount}`}
        </ActionButton>
        {/* <ActionButton onClick={handleShare}>
          <img src={Share} alt="공유하기" width={16} height={16} />
          공유하기
        </ActionButton> */}
      </ActionContainer>
    </ArticleContainer>
  );
}

export default ArticleListItem;
