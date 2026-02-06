import { styled } from "../../../styles";

const ProductHeader = styled("div", {
  textAlign: "center",
  marginBottom: "30px",
});

const ProductName = styled("h1", {
  fontSize: "24px",
  fontWeight: "bold",
  color: "$cg900",
  margin: "0 0 8px 0",
});

const CompanyName = styled("div", {
  fontSize: "16px",
  color: "$cg600",
  marginBottom: "20px",
});

const SafetyBar = styled("div", {
  display: "flex",
  height: "18px",
  borderRadius: "3px",
  overflow: "hidden",
  marginBottom: "8px",
});

const SafetySegment = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "8px",
  fontWeight: "bold",
  color: "white",

  variants: {
    type: {
      safe: { backgroundColor: "#22C55E" },
      caution: { backgroundColor: "#F59E0B" },
      danger: { backgroundColor: "#EF4444" },
      specific: { backgroundColor: "#3B82F6" },
      unknown: { backgroundColor: "#0099FF" },
    },
  },
});


const SafetyPercentages = styled("div", {
  display: "flex",
  fontSize: "14px",
  color: "$cg600",
  marginBottom: "20px",
  position: "relative",
  height: "20px",
});

const ShareButton = styled("button", {
  width: "100%",
  padding: "12px",
  border: "1px solid $cg300",
  borderRadius: "8px",
  backgroundColor: "white",
  fontSize: "12px",
  color: "$cg700",
  cursor: "pointer",
  marginBottom: "30px",
});

interface ProductHeaderProps {
  productName: string;
  companyName: string;
  safetyData: {
    safe: number;
    caution: number;
    danger: number;
    specific: number;
    unknown: number;
  };
}

function ProductHeaderComponent({
  productName,
  companyName,
  safetyData,
}: ProductHeaderProps) {
  const { safe, caution, danger, specific, unknown } = safetyData;
  const total = safe + caution + danger + specific + unknown;

  const safePercent = Math.round((safe / total) * 100);
  const cautionPercent = Math.round((caution / total) * 100);
  const dangerPercent = Math.round((danger / total) * 100);
  const specificPercent = Math.round((specific / total) * 100);
  const unknownPercent = Math.round((unknown / total) * 100);

  return (
    <ProductHeader>
      <ProductName>{productName}</ProductName>
      <CompanyName>{companyName}</CompanyName>

      <SafetyBar>
        {safe > 0 && (
          <SafetySegment type="safe" style={{ width: `${safePercent}%` }}>
            보통
          </SafetySegment>
        )}
        {caution > 0 && (
          <SafetySegment type="caution" style={{ width: `${cautionPercent}%` }}>
            주의
          </SafetySegment>
        )}
        {danger > 0 && (
          <SafetySegment type="danger" style={{ width: `${dangerPercent}%` }}>
            경고
          </SafetySegment>
        )}
        {specific > 0 && (
          <SafetySegment
            type="specific"
            style={{ width: `${specificPercent}%` }}
          >
            특정
          </SafetySegment>
        )}
        {unknown > 0 && (
          <SafetySegment type="unknown" style={{ width: `${unknownPercent}%` }}>
            미상
          </SafetySegment>
        )}
      </SafetyBar>

      <SafetyPercentages>
        {safe > 0 && (
          <span
            style={{
              position: "absolute",
              left: `${safePercent / 2}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {safePercent}%
          </span>
        )}
        {caution > 0 && (
          <span
            style={{
              position: "absolute",
              left: `${safePercent + cautionPercent / 2}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {cautionPercent}%
          </span>
        )}
        {danger > 0 && (
          <span
            style={{
              position: "absolute",
              left: `${safePercent + cautionPercent + dangerPercent / 2}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {dangerPercent}%
          </span>
        )}
        {specific > 0 && (
          <span
            style={{
              position: "absolute",
              left: `${
                safePercent +
                cautionPercent +
                dangerPercent +
                specificPercent / 2
              }%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {specificPercent}%
          </span>
        )}
        {unknown > 0 && (
          <span
            style={{
              position: "absolute",
              left: `${
                safePercent +
                cautionPercent +
                dangerPercent +
                specificPercent +
                unknownPercent / 2
              }%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {unknownPercent}%
          </span>
        )}
      </SafetyPercentages>

      {/* <ShareButton>공유 링크 복사하기</ShareButton> */}
    </ProductHeader>
  );
}

export default ProductHeaderComponent;
