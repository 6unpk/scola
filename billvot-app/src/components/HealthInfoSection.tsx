import { styled } from "@app/styles";

const Section = styled("div", {
  padding: "20px 0",
  borderBottom: "1px solid #F3F4F6",

  "&:last-child": {
    borderBottom: "none",
  },
});

const SectionTitle = styled("div", {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#1F2937",
  marginBottom: "12px",
});

const TagsContainer = styled("div", {
  display: "flex",
  gap: "8px",
  marginBottom: "8px",
  flexWrap: "wrap",
});

const Tag = styled("button", {
  padding: "8px 16px",
  borderRadius: "20px",
  border: "1px solid #E5E7EB",
  backgroundColor: "white",
  fontSize: "12px",
  color: "#6B7280",
  cursor: "pointer",
  transition: "all 0.2s",

  "&:hover": {
    backgroundColor: "#F9FAFB",
  },

  variants: {
    selected: {
      true: {
        backgroundColor: "white",
        border: "1px solid #1F2937",
        color: "#1F2937",
      },
    },
  },
});

const AddLink = styled("div", {
  fontSize: "12px",
  color: "#9CA3AF",
  textAlign: "right",
  textDecoration: "underline",
  cursor: "pointer",

  "&:hover": {
    color: "#6B7280",
  },
});

interface HealthInfoSectionProps {
  title: string;
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  onAddClick: () => void;
  addText: string;
}

const HealthInfoSection = ({
  title,
  tags,
  selectedTags,
  onTagClick,
  onAddClick,
  addText,
}: HealthInfoSectionProps) => {
  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      <TagsContainer>
        {tags.map((tag) => (
          <Tag
            key={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </Tag>
        ))}
      </TagsContainer>
      <AddLink onClick={onAddClick}>{addText}</AddLink>
    </Section>
  );
};

export default HealthInfoSection;
