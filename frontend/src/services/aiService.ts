

// import { checkSTAR } from "../utils/starAnalysis";
// import { detectFilters } from "../utils/filterDetection";

// export interface AIFeedbackResult {
//   text: string;
//   score: number;
// }

// const BACKEND_URL = "http://localhost:5000";

// // ─── SMART FALLBACK LOGIC ──────────────────────────────────────────────────

// /**
//  * Updated Fallback: 
//  * Round 1: Asks ONE smart cross-question based on keywords.
//  * Round 2: Signals to move to the next main question.
//  */
// function getVariedFallback(answer: string, retryCount: number): string {
//   // CRITICAL: Agar retryCount 1 ya usse zyada hai, iska matlab hum 
//   // pehle hi ek cross-question puch chuke hain. Move to next question.
//   if (retryCount >= 1) {
//     return "NEXT_QUESTION_SIGNAL"; 
//   }

//   const lower = answer.toLowerCase();
  
//   const aiFillers = [
//     "I see. ",
//     "That makes sense. ",
//     "Got it, thanks for the context. ",
//     "I follow your reasoning. ",
//     "Clear. "
//   ];
  
//   const prefix = aiFillers[answer.length % aiFillers.length];

//   // Keyword-based Smart Cross-Questions
//   if (lower.includes("team") || lower.includes("collaborat")) {
//     return `${prefix}How did you handle any technical disagreements within the team during that time?`;
//   }
//   if (lower.includes("challeng") || lower.includes("difficult") || lower.includes("problem")) {
//     return `${prefix}What was the hardest part of that challenge, and how did you personally overcome it?`;
//   }
//   if (lower.includes("tool") || lower.includes("framework") || lower.includes("library") || lower.includes("tech")) {
//     return `${prefix}Why did you choose that specific technology over other alternatives?`;
//   }
//   if (lower.includes("improv") || lower.includes("optimiz") || lower.includes("perform")) {
//     return `${prefix}How did you measure the actual improvement after those changes were implemented?`;
//   }
//   if (lower.includes("user") || lower.includes("client") || lower.includes("customer")) {
//     return `${prefix}How did you gather feedback to ensure your solution actually met the user's needs?`;
//   }

//   // Generic deep-dive if no keywords match
//   const fallbacks = [
//     "What trade-offs did you have to consider before settling on that specific approach?",
//     "If you were to do this again today, what would you do differently?",
//     "How did you validate that your solution was the right one for that situation?",
//     "What were the main constraints you were working under at the time?",
//     "Could you share a specific outcome or result that came from this experience?"
//   ];

//   const idx = answer.length % fallbacks.length;
//   return `${prefix}${fallbacks[idx]}`;
// }

// // ─── FOLLOW-UP GENERATION ──────────────────────────────────────────────────────

// export async function generateFollowUp(
//   question: string,
//   answer: string,
//   roleLabel: string,
//   retryCount: number = 0 
// ): Promise<string> {
  
//   // Guard Clause: Agar retryCount >= 1 hai toh API call hi mat karo, 
//   // seedha signal bhej do ki ab next question ki baari hai.
//   if (retryCount >= 1) {
//     return "NEXT_QUESTION_SIGNAL";
//   }

//   try {
//     const res = await fetch(`${BACKEND_URL}/ai`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ question, answer, role: roleLabel, mode: 'followup' }),
//     });

//     if (!res.ok) throw new Error("Backend Unreachable");

//     const data = await res.json();
    
//     if (data?.followUp) return data.followUp;
//     throw new Error("Empty AI Response");

//   } catch (err) {
//     // API fail hone par fallback logic trigger hoga
//     const fallback = getVariedFallback(answer, retryCount);
//     return fallback; 
//   }
// }

// // ─── FEEDBACK GENERATION ──────────────────────────────────────────────────────

// export async function getAIFeedback(
//   question: string,
//   answer: string,
//   roleLabel: string,
//   followUpQ?: string,
//   followUpA?: string
// ): Promise<AIFeedbackResult> {
//   const words = (answer.trim().split(/\s+/).length) + (followUpA?.trim().split(/\s+/).length || 0);
//   const star = checkSTAR(answer);
//   const fillers = detectFilters(answer);

//   try {
//     const res = await fetch(`${BACKEND_URL}/ai`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         question,
//         answer,
//         role: roleLabel,
//         followUpQ: followUpQ ?? null,
//         followUpA: followUpA ?? null,
//         mode: 'feedback'
//       }),
//     });

//     if (!res.ok) throw new Error("Feedback API Error");

//     const data = await res.json();
//     return {
//       text: data.feedback || "Good response. Your structured thinking is evident.",
//       score: Math.max(0, Math.min(100, Number(data.score) || 60)),
//     };

//   } catch (err) {
//     // Fallback scoring logic agar API down hai
//     const score = words < 40 ? 50 : words < 100 ? 75 : 88;
    
//     let text = "Based on your main response and the follow-up, you have a solid grasp of the subject. ";
    
//     if (!star.result) {
//       text += "To improve, try to emphasize the final impact (the Result) more clearly.";
//     } else {
//       text += "Your structure was good and you handled the cross-questioning well.";
//     }

//     if (fillers > 4) {
//       text += " Note: Your fluency was slightly affected by filler words.";
//     }

//     return { text, score };
//   }
// }



import { checkSTAR } from "../utils/starAnalysis";
import { detectFilters } from "../utils/filterDetection";

export interface AIFeedbackResult {
  text: string;
  score: number;
}

const BACKEND_URL = "http://localhost:5000";

// ─── SMART FALLBACK (only used if backend is completely down) ──────────────

function getVariedFallback(answer: string, retryCount: number): string {
  if (retryCount >= 1) {
    return "NEXT_QUESTION_SIGNAL";
  }

  const lower = answer.toLowerCase();

  const dontKnowPhrases = ["i don't know", "i dont know", "not sure", "no idea", "idk"];
  const isDontKnow = dontKnowPhrases.some((p) => lower.includes(p));

  if (isDontKnow) {
    return "NEXT_QUESTION_SIGNAL"; // Don't ask follow-up if they don't know
  }

  const aiFillers = [
    "I see. ",
    "That makes sense. ",
    "Got it, thanks for the context. ",
    "I follow your reasoning. ",
    "Clear. ",
  ];

  const prefix = aiFillers[answer.length % aiFillers.length];

  if (lower.includes("team") || lower.includes("collaborat")) {
    return `${prefix}How did you handle any technical disagreements within the team during that time?`;
  }
  if (lower.includes("challeng") || lower.includes("difficult") || lower.includes("problem")) {
    return `${prefix}What was the hardest part of that challenge, and how did you personally overcome it?`;
  }
  if (lower.includes("tool") || lower.includes("framework") || lower.includes("library") || lower.includes("tech")) {
    return `${prefix}Why did you choose that specific technology over other alternatives?`;
  }
  if (lower.includes("improv") || lower.includes("optimiz") || lower.includes("perform")) {
    return `${prefix}How did you measure the actual improvement after those changes were implemented?`;
  }
  if (lower.includes("user") || lower.includes("client") || lower.includes("customer")) {
    return `${prefix}How did you gather feedback to ensure your solution actually met the user's needs?`;
  }

  const fallbacks = [
    "What trade-offs did you consider before settling on that approach?",
    "If you were to do this again today, what would you do differently?",
    "How did you validate that your solution was the right one?",
    "What were the main constraints you were working under?",
    "Could you share a specific outcome or result from this experience?",
  ];

  return `${prefix}${fallbacks[answer.length % fallbacks.length]}`;
}

// ─── FOLLOW-UP GENERATION ─────────────────────────────────────────────────────

export async function generateFollowUp(
  question: string,
  answer: string,
  roleLabel: string,
  retryCount: number = 0
): Promise<string> {
  // After one follow-up, always move to next question
  if (retryCount >= 1) {
    return "NEXT_QUESTION_SIGNAL";
  }

  // If candidate doesn't know, skip follow-up entirely
  const lower = answer.toLowerCase().trim();
  const dontKnowPhrases = ["i don't know", "i dont know", "not sure", "no idea", "idk", "don't know"];
  const isDontKnow = dontKnowPhrases.some((p) => lower.includes(p));

  if (isDontKnow || lower.length < 20) {
    return "NEXT_QUESTION_SIGNAL";
  }

  try {
    const res = await fetch(`${BACKEND_URL}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer, role: roleLabel, mode: "followup" }),
    });

    if (!res.ok) throw new Error("Backend Unreachable");

    const data = await res.json();

    // If backend says no follow-up needed
    if (!data?.followUp) return "NEXT_QUESTION_SIGNAL";

    return data.followUp;
  } catch (err) {
    console.warn("⚠️ Follow-up API failed, using fallback:", err);
    return getVariedFallback(answer, retryCount);
  }
}

// ─── FEEDBACK GENERATION ──────────────────────────────────────────────────────

export async function getAIFeedback(
  question: string,
  answer: string,
  roleLabel: string,
  followUpQ?: string,
  followUpA?: string
): Promise<AIFeedbackResult> {
  const words =
    answer.trim().split(/\s+/).length + (followUpA?.trim().split(/\s+/).length || 0);
  const star = checkSTAR(answer);
  const fillers = detectFilters(answer);

  const lower = answer.toLowerCase().trim();
  const dontKnowPhrases = ["i don't know", "i dont know", "not sure", "no idea", "idk", "don't know"];
  const isDontKnow = dontKnowPhrases.some((p) => lower.includes(p));

  try {
    const res = await fetch(`${BACKEND_URL}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        answer,
        role: roleLabel,
        followUpQ: followUpQ ?? null,
        followUpA: followUpA ?? null,
        mode: "feedback",
      }),
    });

    if (!res.ok) throw new Error("Feedback API Error");

    const data = await res.json();
    return {
      text: data.feedback || "Good response. Your structured thinking is evident.",
      score: Math.max(0, Math.min(100, Number(data.score) || 60)),
    };
  } catch (err) {
    console.warn("⚠️ Feedback API failed, using fallback:", err);

    // Fallback scoring
    if (isDontKnow) {
      return {
        text: "No worries! This is a common topic worth studying. Try to look up the core concepts and practice explaining them in simple terms.",
        score: 20,
      };
    }

    const score = words < 40 ? 50 : words < 100 ? 70 : 85;

    let text = "Based on your response, you demonstrated a reasonable understanding of the topic. ";

    if (!star.result) {
      text += "To improve, structure your answer using the STAR method — Situation, Task, Action, Result.";
    } else {
      text += "Your structured approach was clear and easy to follow.";
    }

    if (fillers > 4) {
      text += " Try to reduce filler words to sound more confident.";
    }

    return { text, score };
  }
}