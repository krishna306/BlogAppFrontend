export const CATEGORIES = [
  { value: "technology", label: "Technology", shortLabel: "Technology" },
  { value: "travel", label: "Travel", shortLabel: "Travel" },
  { value: "web-design", label: "Web Design", shortLabel: "Web design" },
  { value: "programming", label: "Programming", shortLabel: "Programming" },
  { value: "ai", label: "Artificial Intelligence", shortLabel: "AI" },
  { value: "other", label: "Other", shortLabel: "Other" },
];

export function categoryLabel(value) {
  return CATEGORIES.find((item) => item.value === value)?.label || "Article";
}
