// import { useRef, useCallback, useEffect, useState } from "react";
// import { useInterviewFlow } from "../hooks/useInterviewFlow";
// import { RoleSelect } from "../components/interview/RoleSelect";
// import { IntroScreen } from "../components/interview/IntroScreen";
// import { CameraPermission } from "../components/interview/CameraPermission";
// import { InterviewPanel } from "../components/interview/InterviewPanel";
// import { ResultScreen } from "../components/interview/ResultScreen";
// import { ROLE_QUESTIONS } from "../constants/roles";
// import {
//   TIMER_CONFIG,
//   SILENCE_THRESHOLD_MS,
//   THINKING_DELAY_MIN_MS,
//   THINKING_DELAY_MAX_MS,
//   EYE_CONTACT_HINTS,
//   HINT_SHOW_DELAY_MIN_MS,
//   HINT_SHOW_DELAY_RANGE_MS,
//   HINT_VISIBLE_DURATION_MS,
// } from "../constants/config";
// import { generateFollowUp, getAIFeedback } from "../services/aiService";
// import { saveRecord } from "../services/storageService";
// import { buildInterviewRecord, getEndMessage, getScoreTonePrefix } from "../services/interviewService";
// import { deriveScores } from "../utils/scoring";
// import { checkSTAR } from "../utils/starAnalysis";
// import { detectFilters } from "../utils/filterDetection";
// import type { Answer } from "../services/interviewService";

// // useVoice is an existing JS hook
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// import { useVoice } from "../hooks/useVoice";

// export default function InterviewRoom() {
//   const flow = useInterviewFlow();
//   const { speak, startListening, stopListening, stopSpeaking } = useVoice();

//   // ── Local UI state ───────────────────────────────────────────────────────
//   const [aiMessage, setAiMessage] = useState("");
//   const [aiSubMessage, setAiSubMessage] = useState("");
//   const [isAiTalking, setIsAiTalking] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
//   const [cameraError, setCameraError] = useState("");
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [timerActive, setTimerActive] = useState(false);
//   const [thinkingDots, setThinkingDots] = useState("");
//   const [starLive, setStarLive] = useState({ situation: false, task: false, action: false, result: false });
//   const [fillerAlert, setFillerAlert] = useState(false);
//   const [eyeHint, setEyeHint] = useState("");
//   const [showEyeHint, setShowEyeHint] = useState(false);
//   const [typedAnswer, setTypedAnswer] = useState("");

//   // ── Refs ─────────────────────────────────────────────────────────────────
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // ── Cleanup on unmount ───────────────────────────────────────────────────
//   useEffect(() => {
//     return () => {
//       streamRef.current?.getTracks().forEach((t) => t.stop());
//       stopSpeaking?.();
//       stopListening?.();
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
//       if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
//       if (dotsRef.current) clearInterval(dotsRef.current);
//     };
//   }, [stopSpeaking, stopListening]);

//   // ── Timer ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (timerActive && timeLeft > 0) {
//       timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
//     } else if (timeLeft === 0 && timerActive) {
//       setTimerActive(false);
//       stopListening?.();
//       setIsListening(false);
//     }
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [timerActive, timeLeft, stopListening]);

//   // ── Live STAR + filler tracking ──────────────────────────────────────────
//   useEffect(() => {
//     if (flow.liveTranscript) {
//       setStarLive(checkSTAR(flow.liveTranscript));
//       setFillerAlert(detectFilters(flow.liveTranscript) > 3);
//     }
//   }, [flow.liveTranscript]);

//   // ── Eye-contact hints ────────────────────────────────────────────────────
//   useEffect(() => {
//     if (isListening) {
//       const delay = HINT_SHOW_DELAY_MIN_MS + Math.random() * HINT_SHOW_DELAY_RANGE_MS;
//       hintTimerRef.current = setTimeout(() => {
//         setEyeHint(EYE_CONTACT_HINTS[Math.floor(Math.random() * EYE_CONTACT_HINTS.length)]);
//         setShowEyeHint(true);
//         setTimeout(() => setShowEyeHint(false), HINT_VISIBLE_DURATION_MS);
//       }, delay);
//     }
//     return () => { if (hintTimerRef.current) clearTimeout(hintTimerRef.current); };
//   }, [isListening]);

//   // ── Thinking dots ────────────────────────────────────────────────────────
//   const startDots = useCallback(() => {
//     let i = 0;
//     dotsRef.current = setInterval(() => { i = (i + 1) % 4; setThinkingDots(".".repeat(i)); }, 400);
//   }, []);
//   const stopDots = useCallback(() => {
//     if (dotsRef.current) clearInterval(dotsRef.current);
//     setThinkingDots("");
//   }, []);

//   // ── Helpers ──────────────────────────────────────────────────────────────
//   const getRole = () => flow.selectedRoleRef.current || "general";
//   const getRoleData = () => ROLE_QUESTIONS[getRole()] || ROLE_QUESTIONS["general"];
//   const getQuestions = () => getRoleData().questions;

//   const randomDelay = () =>
//     THINKING_DELAY_MIN_MS + Math.random() * (THINKING_DELAY_MAX_MS - THINKING_DELAY_MIN_MS);

//   // ── Camera ───────────────────────────────────────────────────────────────
//   const startCamera = useCallback(async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
//       streamRef.current = stream;
//       if (videoRef.current) videoRef.current.srcObject = stream;
//       flow.setPhase("asking");
//       askQuestion(0);
//     } catch {
//       setCameraError("Camera access denied. Please allow camera access in browser settings.");
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Core interview flow ──────────────────────────────────────────────────

//   const askQuestion = useCallback((index: number) => {
//     const qs = getQuestions();
//     if (index >= qs.length) {
//       endInterview(flow.answersRef.current);
//       return;
//     }
//     flow.setCurrentFollowUp(null);
//     flow.setLiveTranscript("");
//     setStarLive({ situation: false, task: false, action: false, result: false });
//     setFillerAlert(false);

//     const q = qs[index];
//     setAiMessage(q);
//     setAiSubMessage(`Question ${index + 1} of ${qs.length}`);
//     setIsAiTalking(true);
//     flow.setPhase("asking");

//     speak(q, () => {
//       setIsAiTalking(false);
//       flow.setPhase("listening");
//       const maxTime = TIMER_CONFIG[flow.interviewMode].question;
//       setTimeLeft(maxTime);
//       listenAnswer(index, false);
//     });
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [speak, flow.interviewMode]);

//   const listenAnswer = useCallback((index: number, isFollowUp: boolean) => {
//     setIsListening(true);
//     setTimerActive(true);
//     setAiSubMessage(isFollowUp ? "Answering follow-up…" : "Your answer…");

//     startListening(
//       (result: string) => {
//         if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
//         flow.setLiveTranscript(result);
//         silenceTimerRef.current = setTimeout(() => {
//           setTimerActive(false);
//           if (timerRef.current) clearInterval(timerRef.current);
//           flow.setTranscript(result);
//           setIsListening(false);
//           flow.setLiveTranscript("");

//           if (isFollowUp) {
//             processFollowUpAnswer(index, result);
//           } else {
//             flow.setPhase("processing");
//             setAiSubMessage("");
//             startDots();
//             setTimeout(() => processAnswer(index, result), randomDelay());
//           }
//         }, SILENCE_THRESHOLD_MS);
//       },
//       () => { setIsListening(false); setTimerActive(false); }
//     );
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [startListening, startDots]);

//   const processAnswer = useCallback(async (index: number, userAnswer: string) => {
//     const role = getRoleData();
//     const qs = getQuestions();
//     setIsProcessingFeedback(true);
//     setAiMessage("Analyzing your answer…");

//     const followUpQ = await generateFollowUp(qs[index], userAnswer, role.label);
//     stopDots();

//     if (followUpQ && flow.answersRef.current.length < qs.length) {
//       flow.setPendingFollowUp(followUpQ);
//       flow.setCurrentFollowUp(followUpQ);
//       setIsProcessingFeedback(false);
//       setAiMessage(followUpQ);
//       setAiSubMessage("Follow-up question");
//       setIsAiTalking(true);
//       flow.setPhase("followup");

//       speak(followUpQ, () => {
//         setIsAiTalking(false);
//         flow.setPhase("listening");
//         setTimeLeft(TIMER_CONFIG[flow.interviewMode].followUp);
//         listenAnswer(index, true);
//       });
//     } else {
//       const { text: feedback, score } = await getAIFeedback(qs[index], userAnswer, role.label);
//       setIsProcessingFeedback(false);
//       finalizeFeedback(index, qs[index], userAnswer, feedback, score, null, null);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [speak, listenAnswer, stopDots, flow.interviewMode]);

//   const processFollowUpAnswer = useCallback(async (index: number, followUpAnswer: string) => {
//     const role = getRoleData();
//     const qs = getQuestions();
//     const followUpQ = flow.pendingFollowUp;
//     const originalAnswer = flow.transcript;

//     flow.setPhase("processing");
//     setAiMessage("Evaluating both responses…");
//     startDots();
//     setIsProcessingFeedback(true);

//     await new Promise((r) => setTimeout(r, randomDelay() + 500));

//     const { text: feedback, score } = await getAIFeedback(
//       qs[index], originalAnswer, role.label,
//       followUpQ || undefined, followUpAnswer
//     );
//     stopDots();
//     setIsProcessingFeedback(false);
//     finalizeFeedback(index, qs[index], originalAnswer, feedback, score, followUpQ, followUpAnswer);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [flow.pendingFollowUp, flow.transcript, startDots, stopDots]);

//   const finalizeFeedback = useCallback((
//     index: number,
//     question: string,
//     userAnswer: string,
//     feedback: string,
//     score: number,
//     followUpQ: string | null,
//     followUpA: string | null
//   ) => {
//     const newAnswer: Answer = {
//       question,
//       answer: userAnswer,
//       feedback,
//       score,
//       followUpAsked: followUpQ || undefined,
//       followUpAnswer: followUpA || undefined,
//       starAnalysis: checkSTAR(userAnswer),
//       fillerCount: detectFilters(userAnswer),
//     };

//     const allAnswers = flow.addAnswer(newAnswer);
//     const fullFeedback = getScoreTonePrefix(score) + feedback;

//     setAiMessage(fullFeedback);
//     setAiSubMessage("Feedback");
//     setIsAiTalking(true);
//     flow.setPhase("feedback");

//     speak(fullFeedback, () => {
//       setIsAiTalking(false);
//       const next = index + 1;
//       flow.setCurrentQ(next);
//       const qs = getQuestions();

//       if (next < qs.length) {
//         setTimeout(() => {
//           setAiMessage("Moving to the next question…");
//           setAiSubMessage("");
//           setTimeout(() => askQuestion(next), 1200);
//         }, 800);
//       } else {
//         endInterview(allAnswers);
//       }
//     });
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [speak, askQuestion, flow]);

//   const endInterview = useCallback((finalAnswers: Answer[]) => {
//     flow.setPhase("done");
//     const avg = finalAnswers.length
//       ? Math.round(finalAnswers.reduce((s, a) => s + a.score, 0) / finalAnswers.length)
//       : 0;
//     flow.setOverallScore(avg);

//     const msg = getEndMessage(avg);
//     setAiMessage(msg);
//     speak(msg);

//     try {
//       const derived = deriveScores(finalAnswers);
//       const record = buildInterviewRecord(getRole(), finalAnswers, derived);
//       saveRecord(record);
//       flow.setSaved(true);
//     } catch (err) {
//       console.error("Save error:", err);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [speak]);

//   // ── Typed submit ─────────────────────────────────────────────────────────
//   const handleTypedSubmit = useCallback(() => {
//     if (!typedAnswer.trim() || flow.phase !== "listening") return;
//     stopListening?.();
//     setIsListening(false);
//     setTimerActive(false);
//     flow.setTranscript(typedAnswer);
//     setTypedAnswer("");
//     flow.setPhase("processing");
//     setAiSubMessage("");
//     startDots();
//     setTimeout(() => processAnswer(flow.currentQ, typedAnswer), randomDelay());
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [typedAnswer, flow.phase, flow.currentQ, stopListening, startDots, processAnswer]);

//   // ── Mic toggle ───────────────────────────────────────────────────────────
//   const handleMicToggle = useCallback(() => {
//     if (isListening) {
//       stopListening?.();
//       setIsListening(false);
//       setTimerActive(false);
//     } else if (flow.phase === "listening") {
//       listenAnswer(flow.currentQ, flow.currentFollowUp !== null);
//     }
//   }, [isListening, flow.phase, flow.currentQ, flow.currentFollowUp, stopListening, listenAnswer]);

//   // ── Derived data for render ──────────────────────────────────────────────
//   const roleData = ROLE_QUESTIONS[flow.selectedRole] || ROLE_QUESTIONS["general"];
//   const questions = roleData.questions;

//   // ── Render ───────────────────────────────────────────────────────────────

//   if (flow.phase === "role-select") {
//     return (
//       <RoleSelect
//         selectedRole={flow.selectedRole}
//         onSelectRole={flow.setSelectedRole}
//         interviewMode={flow.interviewMode}
//         onSetMode={flow.setInterviewMode}
//         onNext={() => flow.setPhase("intro")}
//       />
//     );
//   }

//   if (flow.phase === "intro") {
//     return (
//       <IntroScreen
//         roleData={roleData}
//         questionCount={questions.length}
//         interviewMode={flow.interviewMode}
//         useTyping={flow.useTyping}
//         onToggleTyping={() => flow.setUseTyping((v) => !v)}
//         onBack={() => flow.setPhase("role-select")}
//         onNext={() => flow.setPhase("camera-permission")}
//       />
//     );
//   }

//   if (flow.phase === "camera-permission") {
//     return (
//       <CameraPermission
//         error={cameraError}
//         onAllow={startCamera}
//         onBack={() => flow.setPhase("intro")}
//       />
//     );
//   }

//   if (["asking", "listening", "processing", "feedback", "followup"].includes(flow.phase)) {
//     return (
//       <InterviewPanel
//         phase={flow.phase}
//         roleData={roleData}
//         questions={questions}
//         currentQ={flow.currentQ}
//         answers={flow.answers}
//         aiMessage={aiMessage}
//         aiSubMessage={aiSubMessage}
//         isAiTalking={isAiTalking}
//         isListening={isListening}
//         isProcessingFeedback={isProcessingFeedback}
//         liveTranscript={flow.liveTranscript}
//         transcript={flow.transcript}
//         thinkingDots={thinkingDots}
//         starLive={starLive}
//         fillerAlert={fillerAlert}
//         eyeHint={eyeHint}
//         showEyeHint={showEyeHint}
//         timeLeft={timeLeft}
//         interviewMode={flow.interviewMode}
//         useTyping={flow.useTyping}
//         typedAnswer={typedAnswer}
//         onSetTypedAnswer={setTypedAnswer}
//         onTypedSubmit={handleTypedSubmit}
//         onMicToggle={handleMicToggle}
//         videoRef={videoRef}
//       />
//     );
//   }

//   if (flow.phase === "done") {
//     return (
//       <ResultScreen
//         roleData={roleData}
//         answers={flow.answers}
//         overallScore={flow.overallScore}
//         saved={flow.saved}
//         onChangeRole={() => { flow.reset(); }}
//         onRestart={() => window.location.reload()}
//       />
//     );
//   }

//   return null;
// }



import { useRef, useCallback, useEffect, useState } from "react";
import { useInterviewFlow } from "../hooks/useInterviewFlow";
import { RoleSelect } from "../components/interview/RoleSelect";
import { IntroScreen } from "../components/interview/IntroScreen";
import { CameraPermission } from "../components/interview/CameraPermission";
import { InterviewPanel } from "../components/interview/InterviewPanel";
import { ResultScreen } from "../components/interview/ResultScreen";
import { ROLE_QUESTIONS } from "../constants/roles";
import {
  TIMER_CONFIG,
  SILENCE_THRESHOLD_MS,
  THINKING_DELAY_MIN_MS,
  THINKING_DELAY_MAX_MS,
  EYE_CONTACT_HINTS,
  HINT_SHOW_DELAY_MIN_MS,
  HINT_SHOW_DELAY_RANGE_MS,
  HINT_VISIBLE_DURATION_MS,
} from "../constants/config";
import { generateFollowUp, getAIFeedback } from "../services/aiService";
import { saveRecord } from "../services/storageService";
import { buildInterviewRecord, getEndMessage, getScoreTonePrefix } from "../services/interviewService";
import { deriveScores } from "../utils/scoring";
import { checkSTAR } from "../utils/starAnalysis";
import { detectFilters } from "../utils/filterDetection";
import type { Answer } from "../services/interviewService";

// useVoice is an existing JS hook
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useVoice } from "../hooks/useVoice";

// ─── Helper: check if a string is a real follow-up question ───────────────
function isValidFollowUp(text: string | null | undefined): boolean {
  if (!text) return false;
  if (text.trim() === "NEXT_QUESTION_SIGNAL") return false;
  if (text.trim().length < 5) return false;
  return true;
}

export default function InterviewRoom() {
  const flow = useInterviewFlow();
  const { speak, startListening, stopListening, stopSpeaking } = useVoice();

  // ── Local UI state ───────────────────────────────────────────────────────
  const [aiMessage, setAiMessage] = useState("");
  const [aiSubMessage, setAiSubMessage] = useState("");
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingFeedback, setIsProcessingFeedback] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [thinkingDots, setThinkingDots] = useState("");
  const [starLive, setStarLive] = useState({ situation: false, task: false, action: false, result: false });
  const [fillerAlert, setFillerAlert] = useState(false);
  const [eyeHint, setEyeHint] = useState("");
  const [showEyeHint, setShowEyeHint] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");

  // ── Refs ─────────────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotsRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      stopSpeaking?.();
      stopListening?.();
      if (timerRef.current) clearInterval(timerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (dotsRef.current) clearInterval(dotsRef.current);
    };
  }, [stopSpeaking, stopListening]);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      stopListening?.();
      setIsListening(false);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft, stopListening]);

  // ── Live STAR + filler tracking ──────────────────────────────────────────
  useEffect(() => {
    if (flow.liveTranscript) {
      setStarLive(checkSTAR(flow.liveTranscript));
      setFillerAlert(detectFilters(flow.liveTranscript) > 3);
    }
  }, [flow.liveTranscript]);

  // ── Eye-contact hints ────────────────────────────────────────────────────
  useEffect(() => {
    if (isListening) {
      const delay = HINT_SHOW_DELAY_MIN_MS + Math.random() * HINT_SHOW_DELAY_RANGE_MS;
      hintTimerRef.current = setTimeout(() => {
        setEyeHint(EYE_CONTACT_HINTS[Math.floor(Math.random() * EYE_CONTACT_HINTS.length)]);
        setShowEyeHint(true);
        setTimeout(() => setShowEyeHint(false), HINT_VISIBLE_DURATION_MS);
      }, delay);
    }
    return () => { if (hintTimerRef.current) clearTimeout(hintTimerRef.current); };
  }, [isListening]);

  // ── Thinking dots ────────────────────────────────────────────────────────
  const startDots = useCallback(() => {
    let i = 0;
    dotsRef.current = setInterval(() => { i = (i + 1) % 4; setThinkingDots(".".repeat(i)); }, 400);
  }, []);
  const stopDots = useCallback(() => {
    if (dotsRef.current) clearInterval(dotsRef.current);
    setThinkingDots("");
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getRole = () => flow.selectedRoleRef.current || "general";
  const getRoleData = () => ROLE_QUESTIONS[getRole()] || ROLE_QUESTIONS["general"];
  const getQuestions = () => getRoleData().questions;

  const randomDelay = () =>
    THINKING_DELAY_MIN_MS + Math.random() * (THINKING_DELAY_MAX_MS - THINKING_DELAY_MIN_MS);

  // ── Camera ───────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      flow.setPhase("asking");
      askQuestion(0);
    } catch {
      setCameraError("Camera access denied. Please allow camera access in browser settings.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Core interview flow ──────────────────────────────────────────────────

  const askQuestion = useCallback((index: number) => {
    const qs = getQuestions();
    if (index >= qs.length) {
      endInterview(flow.answersRef.current);
      return;
    }
    flow.setCurrentFollowUp(null);
    flow.setLiveTranscript("");
    setStarLive({ situation: false, task: false, action: false, result: false });
    setFillerAlert(false);

    const q = qs[index];
    setAiMessage(q);
    setAiSubMessage(`Question ${index + 1} of ${qs.length}`);
    setIsAiTalking(true);
    flow.setPhase("asking");

    speak(q, () => {
      setIsAiTalking(false);
      flow.setPhase("listening");
      const maxTime = TIMER_CONFIG[flow.interviewMode].question;
      setTimeLeft(maxTime);
      listenAnswer(index, false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speak, flow.interviewMode]);

  const listenAnswer = useCallback((index: number, isFollowUp: boolean) => {
    setIsListening(true);
    setTimerActive(true);
    setAiSubMessage(isFollowUp ? "Answering follow-up…" : "Your answer…");

    startListening(
      (result: string) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        flow.setLiveTranscript(result);
        silenceTimerRef.current = setTimeout(() => {
          setTimerActive(false);
          if (timerRef.current) clearInterval(timerRef.current);
          flow.setTranscript(result);
          setIsListening(false);
          flow.setLiveTranscript("");

          if (isFollowUp) {
            processFollowUpAnswer(index, result);
          } else {
            flow.setPhase("processing");
            setAiSubMessage("");
            startDots();
            setTimeout(() => processAnswer(index, result), randomDelay());
          }
        }, SILENCE_THRESHOLD_MS);
      },
      () => { setIsListening(false); setTimerActive(false); }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startListening, startDots]);

  const processAnswer = useCallback(async (index: number, userAnswer: string) => {
    const role = getRoleData();
    const qs = getQuestions();
    setIsProcessingFeedback(true);
    setAiMessage("Analyzing your answer…");

    // ── FIX: Check for NEXT_QUESTION_SIGNAL before using followUpQ ─────────
    const followUpQ = await generateFollowUp(qs[index], userAnswer, role.label);
    stopDots();

    const shouldAskFollowUp =
      isValidFollowUp(followUpQ) &&
      flow.answersRef.current.length < qs.length;

    if (shouldAskFollowUp && followUpQ) {
      // Valid follow-up received — show it
      flow.setPendingFollowUp(followUpQ);
      flow.setCurrentFollowUp(followUpQ);
      setIsProcessingFeedback(false);
      setAiMessage(followUpQ);                  // safe — guaranteed not NEXT_QUESTION_SIGNAL
      setAiSubMessage("Follow-up question");
      setIsAiTalking(true);
      flow.setPhase("followup");

      speak(followUpQ, () => {
        setIsAiTalking(false);
        flow.setPhase("listening");
        setTimeLeft(TIMER_CONFIG[flow.interviewMode].followUp);
        listenAnswer(index, true);
      });
    } else {
      // No follow-up (signal received or "I don't know") — go straight to feedback
      const { text: feedback, score } = await getAIFeedback(
        qs[index], userAnswer, role.label
      );
      setIsProcessingFeedback(false);
      finalizeFeedback(index, qs[index], userAnswer, feedback, score, null, null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speak, listenAnswer, stopDots, flow.interviewMode]);

  const processFollowUpAnswer = useCallback(async (index: number, followUpAnswer: string) => {
    const role = getRoleData();
    const qs = getQuestions();
    const followUpQ = flow.pendingFollowUp;
    const originalAnswer = flow.transcript;

    flow.setPhase("processing");
    setAiMessage("Evaluating both responses…");
    startDots();
    setIsProcessingFeedback(true);

    await new Promise((r) => setTimeout(r, randomDelay() + 500));

    const { text: feedback, score } = await getAIFeedback(
      qs[index], originalAnswer, role.label,
      followUpQ || undefined, followUpAnswer
    );
    stopDots();
    setIsProcessingFeedback(false);
    finalizeFeedback(index, qs[index], originalAnswer, feedback, score, followUpQ, followUpAnswer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.pendingFollowUp, flow.transcript, startDots, stopDots]);

  const finalizeFeedback = useCallback((
    index: number,
    question: string,
    userAnswer: string,
    feedback: string,
    score: number,
    followUpQ: string | null,
    followUpA: string | null
  ) => {
    const newAnswer: Answer = {
      question,
      answer: userAnswer,
      feedback,
      score,
      followUpAsked: followUpQ || undefined,
      followUpAnswer: followUpA || undefined,
      starAnalysis: checkSTAR(userAnswer),
      fillerCount: detectFilters(userAnswer),
    };

    const allAnswers = flow.addAnswer(newAnswer);
    const fullFeedback = getScoreTonePrefix(score) + feedback;

    setAiMessage(fullFeedback);
    setAiSubMessage("Feedback");
    setIsAiTalking(true);
    flow.setPhase("feedback");

    speak(fullFeedback, () => {
      setIsAiTalking(false);
      const next = index + 1;
      flow.setCurrentQ(next);
      const qs = getQuestions();

      if (next < qs.length) {
        setTimeout(() => {
          setAiMessage("Moving to the next question…");
          setAiSubMessage("");
          setTimeout(() => askQuestion(next), 1200);
        }, 800);
      } else {
        endInterview(allAnswers);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speak, askQuestion, flow]);

  const endInterview = useCallback((finalAnswers: Answer[]) => {
    flow.setPhase("done");
    const avg = finalAnswers.length
      ? Math.round(finalAnswers.reduce((s, a) => s + a.score, 0) / finalAnswers.length)
      : 0;
    flow.setOverallScore(avg);

    const msg = getEndMessage(avg);
    setAiMessage(msg);
    speak(msg);

    try {
      const derived = deriveScores(finalAnswers);
      const record = buildInterviewRecord(getRole(), finalAnswers, derived);
      saveRecord(record);
      flow.setSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speak]);

  // ── Typed submit ─────────────────────────────────────────────────────────
  const handleTypedSubmit = useCallback(() => {
    if (!typedAnswer.trim() || flow.phase !== "listening") return;
    stopListening?.();
    setIsListening(false);
    setTimerActive(false);
    flow.setTranscript(typedAnswer);
    setTypedAnswer("");
    flow.setPhase("processing");
    setAiSubMessage("");
    startDots();
    setTimeout(() => processAnswer(flow.currentQ, typedAnswer), randomDelay());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedAnswer, flow.phase, flow.currentQ, stopListening, startDots, processAnswer]);

  // ── Mic toggle ───────────────────────────────────────────────────────────
  const handleMicToggle = useCallback(() => {
    if (isListening) {
      stopListening?.();
      setIsListening(false);
      setTimerActive(false);
    } else if (flow.phase === "listening") {
      listenAnswer(flow.currentQ, flow.currentFollowUp !== null);
    }
  }, [isListening, flow.phase, flow.currentQ, flow.currentFollowUp, stopListening, listenAnswer]);

  // ── Derived data for render ──────────────────────────────────────────────
  const roleData = ROLE_QUESTIONS[flow.selectedRole] || ROLE_QUESTIONS["general"];
  const questions = roleData.questions;

  // ── Render ───────────────────────────────────────────────────────────────

  if (flow.phase === "role-select") {
    return (
      <RoleSelect
        selectedRole={flow.selectedRole}
        onSelectRole={flow.setSelectedRole}
        interviewMode={flow.interviewMode}
        onSetMode={flow.setInterviewMode}
        onNext={() => flow.setPhase("intro")}
      />
    );
  }

  if (flow.phase === "intro") {
    return (
      <IntroScreen
        roleData={roleData}
        questionCount={questions.length}
        interviewMode={flow.interviewMode}
        useTyping={flow.useTyping}
        onToggleTyping={() => flow.setUseTyping((v) => !v)}
        onBack={() => flow.setPhase("role-select")}
        onNext={() => flow.setPhase("camera-permission")}
      />
    );
  }

  if (flow.phase === "camera-permission") {
    return (
      <CameraPermission
        error={cameraError}
        onAllow={startCamera}
        onBack={() => flow.setPhase("intro")}
      />
    );
  }

  if (["asking", "listening", "processing", "feedback", "followup"].includes(flow.phase)) {
    return (
      <InterviewPanel
        phase={flow.phase}
        roleData={roleData}
        questions={questions}
        currentQ={flow.currentQ}
        answers={flow.answers}
        aiMessage={aiMessage}
        aiSubMessage={aiSubMessage}
        isAiTalking={isAiTalking}
        isListening={isListening}
        isProcessingFeedback={isProcessingFeedback}
        liveTranscript={flow.liveTranscript}
        transcript={flow.transcript}
        thinkingDots={thinkingDots}
        starLive={starLive}
        fillerAlert={fillerAlert}
        eyeHint={eyeHint}
        showEyeHint={showEyeHint}
        timeLeft={timeLeft}
        interviewMode={flow.interviewMode}
        useTyping={flow.useTyping}
        typedAnswer={typedAnswer}
        onSetTypedAnswer={setTypedAnswer}
        onTypedSubmit={handleTypedSubmit}
        onMicToggle={handleMicToggle}
        videoRef={videoRef}
      />
    );
  }

  if (flow.phase === "done") {
    return (
      <ResultScreen
        roleData={roleData}
        answers={flow.answers}
        overallScore={flow.overallScore}
        saved={flow.saved}
        onChangeRole={() => { flow.reset(); }}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return null;
}