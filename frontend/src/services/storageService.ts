import { LS_KEY } from "../constants/config";
import type { InterviewRecord } from "./interviewService";

export function loadRecords(): InterviewRecord[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecord(record: InterviewRecord): void {
  const existing = loadRecords();
  localStorage.setItem(LS_KEY, JSON.stringify([record, ...existing]));
}

export function deleteRecord(id: string): void {
  const existing = loadRecords().filter((r) => r.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(existing));
}

export function clearAllRecords(): void {
  localStorage.removeItem(LS_KEY);
}