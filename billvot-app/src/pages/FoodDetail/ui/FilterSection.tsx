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

const SelectAllButton = styled("button", {
  background: "none",
  border: "none",
  color: "$cg600",
  fontSize: "14px",
  textDecoration: "underline",
  cursor: "pointer",
});

const FilterGroup = styled("div", {
  marginBottom: "16px",
});

const FilterLabel = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "$cg900",
  marginBottom: "8px",
});

const FilterChips = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
});

const FilterChip = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "4px 8px",
  border: "1px solid #98A5B3",
  borderRadius: "20px",
  backgroundColor: "white",
  fontSize: "14px",
  color: "#98A5B3",
  cursor: "pointer",

  variants: {
    active: {
      true: {
        color: "#525C66",
        borderColor: "#525C66",
      },
    },
    type: {
      safe: { color: "#22C55E", borderColor: "#22C55E" },
      caution: { color: "#F59E0B", borderColor: "#F59E0B" },
      danger: { color: "#EF4444", borderColor: "#EF4444" },
      unknown: { color: "#0099FF", borderColor: "#0099FF" },
      all: { color: "#6B7280", borderColor: "#6B7280" },
    },
  },
});

const ColorDot = styled("div", {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  flexShrink: 0,
  variants: {
    type: {
      safe: { backgroundColor: "#22C55E" },
      caution: { backgroundColor: "#F59E0B" },
      danger: { backgroundColor: "#EF4444" },
      unknown: { backgroundColor: "#0099FF" },
      all: { backgroundColor: "#6B7280" },
    },
  },
});

interface FilterSectionProps {
  selectedFilters: {
    safety: string[];
    usage: string[];
    organization: string[];
  };
  onFilterClick: (
    category: "safety" | "usage" | "organization",
    filter: string,
  ) => void;
  onSelectAll: () => void;
}

function FilterSection({
  selectedFilters,
  onFilterClick,
  onSelectAll,
}: FilterSectionProps) {
  return (
    <Section>
      <SectionHeader>
        <SectionTitle>성분 등급</SectionTitle>
        <SelectAllButton onClick={onSelectAll}>선택 초기화</SelectAllButton>
      </SectionHeader>

      <FilterGroup>
        <FilterChips>
          {["전체", "보통", "주의", "경고", "미상"].map((filter) => (
            <FilterChip
              key={filter}
              type={
                filter === "전체"
                  ? "all"
                  : filter === "보통"
                  ? "safe"
                  : filter === "주의"
                  ? "caution"
                  : filter === "경고"
                  ? "danger"
                  : filter === "미상"
                  ? "unknown"
                  : "all"
              }
              active={selectedFilters.safety.includes(filter)}
              onClick={() => onFilterClick("safety", filter)}
            >
              <ColorDot
                type={
                  filter === "전체"
                    ? "all"
                    : filter === "보통"
                    ? "safe"
                    : filter === "주의"
                    ? "caution"
                    : filter === "경고"
                    ? "danger"
                    : filter === "미상"
                    ? "unknown"
                    : "all"
                }
              />
              {filter}
            </FilterChip>
          ))}
        </FilterChips>
      </FilterGroup>
      {/* 
      <FilterGroup>
        <FilterLabel>주요 용도</FilterLabel>
        <FilterChips>
          {["전체", "용매", "감미료", "조미"].map((filter) => (
            <FilterChip
              key={filter}
              active={selectedFilters.usage.includes(filter)}
              onClick={() => onFilterClick("usage", filter)}
            >
              {filter}
            </FilterChip>
          ))}
        </FilterChips>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>기관</FilterLabel>
        <FilterChips>
          {["전체", "EWG", "CSPI", "WHO", "JECFA", "FDA", "EFSA"].map(
            (filter) => (
              <FilterChip
                key={filter}
                active={selectedFilters.organization.includes(filter)}
                onClick={() => onFilterClick("organization", filter)}
              >
                {filter}
              </FilterChip>
            ),
          )}
        </FilterChips>
      </FilterGroup> */}
    </Section>
  );
}

export default FilterSection;
