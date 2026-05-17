import type { STARResult } from "../utils/starAnalysis";
import type { DerivedScores } from "../utils/scoring";

// ─── Core Types ──────────────────────────────────────────────────────────────

export interface Answer {
  question: string;
  answer: string;
  feedback: string;
  score: number;
  followUpAsked?: string;
  followUpAnswer?: string;
  starAnalysis?: STARResult;
  fillerCount?: number;
}

export interface InterviewRecord {
  id: string;
  role: string;
  questions: string[];
  answers: string[];
  feedbacks: string[];
  scores: number[];
  overallScore: number;
  createdAt: string;
  clarityScore: number;
  fluencyScore: number;
  confidenceScore: number;
  relevanceScore: number;
  depthScore: number;
}

export type Phase =
  | "role-select"
  | "intro"
  | "camera-permission"
  | "asking"
  | "listening"
  | "processing"
  | "feedback"
  | "followup"
  | "done";

export type InterviewMode = "normal" | "strict";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function buildInterviewRecord(
  role: string,
  answers: Answer[],
  derivedScores: DerivedScores
): InterviewRecord {
  const avg = answers.length
    ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length)
    : 0;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    questions: answers.map((a) => a.question),
    answers: answers.map((a) => a.answer),
    feedbacks: answers.map((a) => a.feedback),
    scores: answers.map((a) => a.score),
    overallScore: avg,
    createdAt: new Date().toISOString(),
    ...derivedScores,
  };
}

export function getEndMessage(score: number): string {
  if (score >= 80) return "Excellent performance. You demonstrated strong depth and clarity throughout.";
  if (score >= 60) return "Solid interview. A few areas to sharpen, but you showed good fundamentals.";
  return "Good practice session. Review the feedback below and focus on structured answers.";
}

export function getScoreTonePrefix(score: number): string {
  if (score >= 80) return "Strong answer. ";
  if (score >= 65) return "Good effort. ";
  if (score >= 50) return "Thanks for that. ";
  return "I appreciate the attempt. "
}






