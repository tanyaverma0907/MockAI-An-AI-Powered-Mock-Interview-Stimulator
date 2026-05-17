import { useState, useRef, useCallback } from "react";
import type { Answer, Phase, InterviewMode } from "../services/interviewService";

export function useInterviewFlow() {
  const [phase, setPhase] = useState<Phase>("role-select");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("normal");
  const [useTyping, setUseTyping] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [transcript, setTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [pendingFollowUp, setPendingFollowUp] = useState<string | null>(null);
  const [currentFollowUp, setCurrentFollowUp] = useState<string | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  const [saved, setSaved] = useState(false);

  // Sync refs so async callbacks always read fresh values
  const answersRef = useRef<Answer[]>([]);
  const selectedRoleRef = useRef<string>("");

  const syncAnswers = useCallback((next: Answer[]) => {
    answersRef.current = next;
    setAnswers(next);
  }, []);

  const syncRole = useCallback((role: string) => {
    selectedRoleRef.current = role;
    setSelectedRole(role);
  }, []);

  const addAnswer = useCallback(
    (a: Answer) => {
      const next = [...answersRef.current, a];
      syncAnswers(next);
      return next;
    },
    [syncAnswers]
  );

  const reset = useCallback(() => {
    answersRef.current = [];
    selectedRoleRef.current = "";
    setPhase("role-select");
    setSelectedRole("");
    setCurrentQ(0);
    setAnswers([]);
    setTranscript("");
    setLiveTranscript("");
    setPendingFollowUp(null);
    setCurrentFollowUp(null);
    setOverallScore(0);
    setSaved(false);
  }, []);

  return {
    // State
    phase, setPhase,
    selectedRole, setSelectedRole: syncRole, selectedRoleRef,
    interviewMode, setInterviewMode,
    useTyping, setUseTyping,
    currentQ, setCurrentQ,
    answers, addAnswer, answersRef, syncAnswers,
    transcript, setTranscript,
    liveTranscript, setLiveTranscript,
    pendingFollowUp, setPendingFollowUp,
    currentFollowUp, setCurrentFollowUp,
    overallScore, setOverallScore,
    saved, setSaved,
    reset,
  };
}