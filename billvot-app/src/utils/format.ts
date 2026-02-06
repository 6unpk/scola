export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function formatBusinessCategory(
  businessCategory: string | null,
): string {
  return businessCategory ?? "일반";
}
