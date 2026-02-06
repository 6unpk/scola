import { styled } from "@app/styles";

const ImagePreviewListContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  margin: "16px 0px",
  overflowX: "auto",
  overflowY: "hidden",
  whiteSpace: "nowrap",
  WebkitOverflowScrolling: "touch", // 모바일에서 부드러운 스크롤 지원
  msOverflowStyle: "none", // IE와 Edge에서 스크롤바 숨기기
  scrollbarWidth: "none", // Firefox에서 스크롤바 숨기기

  "&::-webkit-scrollbar": {
    display: "none", // Chrome, Safari, Opera에서 스크롤바 숨기기
  },

  // 스크롤이 가능하다는 것을 시각적으로 표시
  "&::after": {
    content: "",
    flex: "0 0 8px", // 오른쪽에 작은 여백 추가
  },
});

const ImagePreview = styled("div", {
  position: "relative",
  flexShrink: 0, // 이미지가 축소되지 않도록 설정
  width: "80px",
  height: "80px",
  borderRadius: "8px",
  overflow: "hidden",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  "& button": {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "none",
    color: "white",
    fontSize: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",

    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
  },
});

interface ImagePreviewListProps {
  images: string[];
  onRemove: (index: number) => void;
}

function ImagePreviewList({ images, onRemove }: ImagePreviewListProps) {
  return (
    <ImagePreviewListContainer>
      {images.map((url, index) => (
        <ImagePreview key={url}>
          <img src={url} alt={`업로드된 이미지 ${index + 1}`} />
          <button onClick={() => onRemove(index)}>×</button>
        </ImagePreview>
      ))}
    </ImagePreviewListContainer>
  );
}

export default ImagePreviewList;
