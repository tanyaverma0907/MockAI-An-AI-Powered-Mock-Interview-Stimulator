export type InterviewMode = "normal" | "strict";

export const TIMER_CONFIG: Record<InterviewMode, { question: number; followUp: number }> = {
  normal: { question: 120, followUp: 60 },
  strict: { question: 90, followUp: 45 },
};

export const SILENCE_THRESHOLD_MS = 1500;
export const THINKING_DELAY_MIN_MS = 1500;
export const THINKING_DELAY_MAX_MS = 3000;

export const EYE_CONTACT_HINTS = [
  "Maintain eye contact with the camera.",
  "Sit up straight — posture matters.",
  "Speak at a measured pace, don't rush.",
  "Take a breath before you answer.",
  "Keep your hands relaxed and visible.",
];

export const HINT_SHOW_DELAY_MIN_MS = 15000;
export const HINT_SHOW_DELAY_RANGE_MS = 20000;
export const HINT_VISIBLE_DURATION_MS = 4500;

export const AI_MODEL = "claude-sonnet-4-20250514";
export const AI_MAX_TOKENS = 1000;
export const FOLLOWUP_MAX_TOKENS = 150;

export const LS_KEY = "mock_interview_records";