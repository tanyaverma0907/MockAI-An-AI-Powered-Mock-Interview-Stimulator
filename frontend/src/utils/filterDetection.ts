const FILTER_WORDS = [
  "um", "uh", "like", "basically", "you know",
  "sort of", "kind of", "right", "okay so", "literally",
  "actually", "honestly", "whatever",
];

export function detectFilters(text: string): number {
  const lower = text.toLowerCase();
  return FILTER_WORDS.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return count + (lower.match(regex)?.length || 0);
  }, 0);
}

export function getFilterWords(text: string): string[] {
  const lower = text.toLowerCase();
  return FILTER_WORDS.filter((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    return regex.test(lower);
  });
}