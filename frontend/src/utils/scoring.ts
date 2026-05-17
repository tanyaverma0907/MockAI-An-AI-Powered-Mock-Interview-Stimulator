import type { Answer } from "../services/interviewService";

export interface DerivedScores {
  clarityScore: number;
  fluencyScore: number;
  confidenceScore: number;
  relevanceScore: number;
  depthScore: number;
}

export function deriveScores(answers: Answer[]): DerivedScores {
  if (!answers.length) {
    return { clarityScore: 0, fluencyScore: 0, confidenceScore: 0, relevanceScore: 0, depthScore: 0 };
  }

  const avg = (fn: (a: Answer) => number) =>
    Math.round(answers.reduce((s, a) => s + fn(a), 0) / answers.length);

  return {
    clarityScore: avg((a) => Math.min(100, a.score + 3)),
    fluencyScore: avg((a) => {
      const wc = a.answer.trim().split(/\s+/).filter(Boolean).length;
      return Math.min(100, Math.round((wc / 80) * 100));
    }),
    confidenceScore: avg((a) => Math.max(20, a.score - (a.fillerCount || 0) * 3)),
    relevanceScore: avg((a) => Math.min(100, a.score + 2)),
    depthScore: avg((a) => {
      const wc = a.answer.trim().split(/\s+/).filter(Boolean).length;
      return Math.min(100, Math.round((wc / 100) * 100));
    }),
  };
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return "Exceptional";
  if (score >= 75) return "Strong";
  if (score >= 62) return "Solid";
  if (score >= 50) return "Adequate";
  return "Needs Work";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#34d399";
  if (score >= 60) return "#fbbf24";
  return "#f87171";
}