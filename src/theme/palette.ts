export const ACCENTS = {
  cyan: "#00F0FF",
  purple: "#9B5CFF",
  pink: "#FF4FC3",
  green: "#4ADE80",
} as const;
export type AccentToken = keyof typeof ACCENTS;
