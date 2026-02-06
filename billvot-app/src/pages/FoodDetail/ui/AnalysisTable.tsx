import { styled } from "../../../styles";

const Section = styled("div", {
  marginBottom: "30px",
});

const SectionHeader = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

const SectionTitle = styled("h2", {
  fontSize: "18px",
  fontWeight: "bold",
  color: "$cg900",
  margin: 0,
});

const AnalysisTable = styled("div", {
  border: "1px solid #DAE0E6",
  overflow: "hidden",
  marginBottom: "20px",
});

const TableHeader = styled("div", {
  display: "grid",
  gridTemplateColumns: "42px 1fr 1fr 0.65fr",
  backgroundColor: "$primary",
  fontWeight: "bold",
  fontSize: "14px",
  color: "#ffffff",
});

const TableHeaderCell = styled("div", {
  padding: "12px 0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRight: "1px solid #DAE0E6",
  boxSizing: "border-box",
  fontSize: "14px",
  fontWeight: "bold",

  "&:last-child": {
    borderRight: "none",
  },
});

const TableRow = styled("div", {
  display: "flex",
  borderBottom: "1px solid #DAE0E6",
  minHeight: "48px",

  "&:last-child": {
    borderBottom: "none",
  },
});

const CategoryCell = styled("div", {
  width: "42px",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "14px",
  fontWeight: "bold",
  color: "white",
  borderRight: "1px solid #DAE0E6",

  variants: {
    type: {
      safe: { backgroundColor: "#06B05029" },
      caution: { backgroundColor: "#FFBF0029" },
      danger: { backgroundColor: "#FF000029" },
      specific: { backgroundColor: "#3B82F629" },
      unknown: { backgroundColor: "#6B728029" },
    },
  },
});

const StatusDot = styled("div", {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  flexShrink: 0,

  variants: {
    type: {
      safe: { backgroundColor: "#06B050" },
      caution: { backgroundColor: "#FFBF00" },
      danger: { backgroundColor: "#FF0000" },
      specific: { backgroundColor: "#3B82F6" },
      unknown: { backgroundColor: "#0099FF" },
    },
  },
});

const ContentCell = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

const ItemRow = styled("div", {
  display: "grid",
  gridTemplateColumns: "42px 1fr 1fr 0.65fr",
  borderBottom: "1px solid #DAE0E6",
  minHeight: "48px",

  "&:last-child": {
    borderBottom: "none",
  },
});

const TableCell = styled("div", {
  padding: "12px 0",
  fontSize: "14px",
  color: "$cg900",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRight: "1px solid #DAE0E6",
  textAlign: "center",
  boxSizing: "border-box",

  "&:last-child": {
    borderRight: "none",
  },

  variants: {
    center: {
      true: {
        justifyContent: "center",
      },
    },
    usage: {
      true: {
        color: "$cg700",
        fontWeight: "500",
      },
    },
    clickable: {
      true: {
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        },
      },
    },
    organizations: {
      true: {
        flexWrap: "wrap",
        gap: "4px",
        padding: "8px 4px",
      },
    },
  },
});

const InfoIcon = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: "#4285F4",
  color: "white",
  fontSize: "10px",
  fontWeight: "bold",
  marginLeft: "4px",
  flexShrink: 0,
});

const OrganizationChip = styled("span", {
  display: "inline-block",
  padding: "2px 8px",
  border: "1px solid $cg300",
  borderRadius: "12px",
  fontSize: "12px",
  color: "$cg600",
  flexShrink: 0,
});

const LoadingSpinner = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  fontSize: "14px",
  color: "$cg600",
});

const Spinner = styled("div", {
  width: "16px",
  height: "16px",
  border: "2px solid $cg300",
  borderTop: "2px solid $primary",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginRight: "8px",

  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
});

interface AnalysisTableProps {
  analysisData: Array<{
    name: string;
    usage: string;
    organizations: string[];
    risk: string;
    content?: string;
  }>;
  isClassifying?: boolean;
  onIngredientClick?: (name: string, content: string) => void;
}

function AnalysisTableComponent({
  analysisData,
  isClassifying = false,
  onIngredientClick
}: AnalysisTableProps) {
  // 총 성분 개수 계산
  const totalIngredients = analysisData.length;

  return (
    <Section>
      <SectionHeader>
        <SectionTitle>분석 결과</SectionTitle>
        <span style={{ fontSize: "14px", color: "#6B7280" }}>
          {totalIngredients}개 성분의 분석표
        </span>
      </SectionHeader>

      {isClassifying ? (
        <LoadingSpinner>
          <Spinner />
          영양성분을 분석하는 중...
        </LoadingSpinner>
      ) : (
        <AnalysisTable>
          <TableHeader>
            <TableHeaderCell>등급</TableHeaderCell>
            <TableHeaderCell>
              <span style={{ padding: "0 8px" }}>원재료명</span>
            </TableHeaderCell>
            <TableHeaderCell>
              <span style={{ padding: "0 8px" }}>주요 용도</span>
            </TableHeaderCell>
            <TableHeaderCell>언급 기관</TableHeaderCell>
          </TableHeader>

          {analysisData.map((item, index) => {
            const categoryType =
              item.risk === "보통"
                ? "safe"
                : item.risk === "주의"
                ? "caution"
                : item.risk === "경고"
                ? "danger"
                : item.risk === "특정인 피해야 함"
                ? "specific"
                : item.risk === "미상"
                ? "unknown"
                : "unknown";

            const hasContent = !!item.content;

            return (
              <ItemRow key={index}>
                <TableCell center>
                  <StatusDot type={categoryType} />
                </TableCell>
                <TableCell
                  center
                  clickable={hasContent}
                  onClick={() => {
                    if (hasContent && onIngredientClick) {
                      onIngredientClick(item.name, item.content!);
                    }
                  }}
                >
                  <span style={{ padding: "0 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                    {item.name}
                  </span>
                </TableCell>
                <TableCell center usage>
                  <span style={{ padding: "0 8px" }}>
                    {item.usage}
                  </span>
                </TableCell>
                <TableCell center organizations>
                  {item.organizations.map((org, orgIndex) => (
                    <OrganizationChip key={orgIndex}>
                      {org}
                    </OrganizationChip>
                  ))}
                </TableCell>
              </ItemRow>
            );
          })}
        </AnalysisTable>
      )}
    </Section>
  );
}

export default AnalysisTableComponent;
