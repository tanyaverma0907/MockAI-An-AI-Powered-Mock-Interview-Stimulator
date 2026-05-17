

// import { Router } from "express";
// import { callGroq } from "../services/gemini.service.js";

// const router = Router();

// router.post("/", async (req, res) => {
//   const { question, answer, role, followUpQ, followUpA, mode } = req.body;

//   if (!question || !answer || !role) {
//     return res.status(400).json({ error: "question, answer, and role are required" });
//   }

//   try {
//     // ─── FOLLOW-UP MODE ────────────────────────────────────────────────────
//     if (mode === "followup") {
//       const lowerAnswer = answer.toLowerCase().trim();

//       // If candidate clearly doesn't know, skip follow-up
//       const dontKnowPhrases = ["i don't know", "i dont know", "not sure", "no idea", "i have no", "don't know", "idk"];
//       const isDontKnow = dontKnowPhrases.some((p) => lowerAnswer.includes(p));

//       if (isDontKnow || lowerAnswer.length < 20) {
//         return res.json({ followUp: null }); // Signal to skip follow-up
//       }

//       const prompt = `
// You are a senior ${role} interviewer conducting a live interview.
// The candidate just answered this question:

// Q: "${question}"
// A: "${answer}"

// Your job: Ask ONE sharp, specific follow-up question based on what they said.
// - If they mentioned a specific technology, tool, or method — dig deeper into it.
// - If they were vague — ask for a concrete example.
// - Keep it under 20 words.
// - Return ONLY the follow-up question text, nothing else.
//       `.trim();

//       const raw = await callGroq(prompt);
//       return res.json({ followUp: raw.trim() });
//     }

//     // ─── FEEDBACK MODE ─────────────────────────────────────────────────────
//     if (mode === "feedback") {
//       const lowerAnswer = answer.toLowerCase().trim();
//       const wordCount = answer.trim().split(/\s+/).length;

//       const dontKnowPhrases = ["i don't know", "i dont know", "not sure", "no idea", "i have no", "don't know", "idk"];
//       const isDontKnow = dontKnowPhrases.some((p) => lowerAnswer.includes(p));
//       const isTooShort = wordCount < 15;

//       let prompt: string;

//       if (isDontKnow) {
//         prompt = `
// You are a supportive but honest ${role} interviewer.
// The candidate was asked: "${question}"
// Their answer was: "${answer}"

// They clearly don't know the answer. Respond with:
// 1. Encouragement — don't make them feel bad
// 2. A brief hint about what they should study or focus on
// 3. A low score reflecting they didn't answer

// You MUST respond with ONLY valid JSON, no extra text:
// {"feedback": "your encouraging feedback here", "score": 25}
//         `.trim();
//       } else if (isTooShort) {
//         prompt = `
// You are a ${role} interviewer.
// The candidate gave a very short/incomplete answer to: "${question}"
// Their answer: "${answer}"

// Give constructive feedback asking them to elaborate more, and assign a low-mid score.

// You MUST respond with ONLY valid JSON, no extra text:
// {"feedback": "your feedback here", "score": 40}
//         `.trim();
//       } else {
//         const context = followUpQ
//           ? `\nFollow-up Question: "${followUpQ}"\nFollow-up Answer: "${followUpA || "No answer given"}"`
//           : "";

//         prompt = `
// You are an expert ${role} Hiring Manager evaluating a mock interview response.

// Main Question: "${question}"
// Candidate Answer: "${answer}"${context}

// Evaluate based on:
// - Clarity and structure (did they use STAR method?)
// - Technical depth and correctness
// - Confidence and completeness
// - How well they handled the follow-up (if any)

// Give honest, specific feedback in 2-3 sentences. Mention what was good and what to improve.
// Score range: 0-100 (be realistic — a decent answer is 60-75, excellent is 80+)

// You MUST respond with ONLY valid JSON, no extra text:
// {"feedback": "your detailed feedback here", "score": 70}
//         `.trim();
//       }

//       const raw = await callGroq(prompt, true); // JSON mode
//       const clean = raw.replace(/```json\n?|```\n?/g, "").trim();

//       let parsed: { feedback: string; score: number };
//       try {
//         parsed = JSON.parse(clean);
//       } catch {
//         console.error("❌ Failed to parse Groq JSON:", raw);
//         return res.json({
//           feedback: isDontKnow
//             ? "No worries! This topic is worth revisiting. Focus on understanding the core concepts and try again."
//             : "Good effort! Try to structure your answer more clearly using the STAR method.",
//           score: isDontKnow ? 20 : 50,
//         });
//       }

//       return res.json({
//         feedback: parsed.feedback ?? "Good attempt. Keep practicing!",
//         score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
//       });
//     }

//     // ─── LEGACY FALLBACK (no mode specified) ──────────────────────────────
//     const isFeedbackRequest = "followUpQ" in req.body;

//     if (!isFeedbackRequest) {
//       const prompt = `
// You are a senior ${role} interviewer.
// Question: "${question}"
// Candidate Answer: "${answer}"
// Generate ONE sharp follow-up question (max 20 words) based on their answer.
// Return ONLY the question text.
//       `.trim();

//       const raw = await callGroq(prompt);
//       return res.json({ followUp: raw.trim() });
//     } else {
//       const context = followUpQ ? `\nFollow-up Q: "${followUpQ}"\nFollow-up A: "${followUpA}"` : "";
//       const prompt = `
// Evaluate this ${role} interview:
// Q: "${question}"
// A: "${answer}"${context}
// Return ONLY valid JSON: {"feedback": "2-3 sentences", "score": number}
//       `.trim();

//       const raw = await callGroq(prompt, true);
//       const clean = raw.replace(/```json\n?|```\n?/g, "").trim();

//       let parsed: { feedback: string; score: number };
//       try {
//         parsed = JSON.parse(clean);
//       } catch {
//         return res.json({
//           feedback: "The response was good, but focus more on technical depth.",
//           score: 70,
//         });
//       }

//       return res.json({
//         feedback: parsed.feedback ?? "No feedback returned.",
//         score: Math.max(0, Math.min(100, Number(parsed.score) || 60)),
//       });
//     }
//   } catch (err) {
//     console.error("❌ Groq route error:", err);
//     return res.status(500).json({ error: "Groq call failed", detail: String(err) });
//   }
// });

// export default router;



import { Router } from "express";
import { callGroq } from "../services/gemini.service.js";

const router = Router();

router.post("/", async (req, res) => {
  const { question, answer, role, followUpQ, followUpA, mode, questionCount, interviewMode } = req.body;

  // Intro mode doesn't need question/answer
  if (mode !== "intro" && (!question || !answer || !role)) {
    return res.status(400).json({ error: "question, answer, and role are required" });
  }

  try {
    // ─── INTRO MODE ────────────────────────────────────────────────────────
    if (mode === "intro") {
      const prompt = `
You are an AI interviewer named MockAI. A candidate is about to start a ${role} interview with ${questionCount} questions in ${interviewMode} mode.

Write a warm, encouraging greeting in 3-4 sentences. Include:
- Welcome and mention the role, question count, and mode
- A quick tip to use the STAR method (Situation, Task, Action, Result)
- A motivating closing line

End with 🚀. Return ONLY the greeting text — no JSON, no markdown, no extra formatting.
      `.trim();

      const raw = await callGroq(prompt);
      return res.json({ greeting: raw.trim() });
    }

    // ─── FOLLOW-UP MODE ────────────────────────────────────────────────────
    if (mode === "followup") {
      const lowerAnswer = answer.toLowerCase().trim();

      const dontKnowPhrases = ["i don't know", "i dont know", "not sure", "no idea", "i have no", "don't know", "idk"];
      const isDontKnow = dontKnowPhrases.some((p) => lowerAnswer.includes(p));

      if (isDontKnow || lowerAnswer.length < 20) {
        return res.json({ followUp: null });
      }

      const prompt = `
You are a senior ${role} interviewer conducting a live interview.
The candidate just answered this question:

Q: "${question}"
A: "${answer}"

Your job: Ask ONE sharp, specific follow-up question based on what they said.
- If they mentioned a specific technology, tool, or method — dig deeper into it.
- If they were vague — ask for a concrete example.
- Keep it under 20 words.
- Return ONLY the follow-up question text, nothing else.
      `.trim();

      const raw = await callGroq(prompt);
      return res.json({ followUp: raw.trim() });
    }

    // ─── FEEDBACK MODE ─────────────────────────────────────────────────────
    if (mode === "feedback") {
      const lowerAnswer = answer.toLowerCase().trim();
      const wordCount = answer.trim().split(/\s+/).length;

      const dontKnowPhrases = ["i don't know", "i dont know", "not sure", "no idea", "i have no", "don't know", "idk"];
      const isDontKnow = dontKnowPhrases.some((p) => lowerAnswer.includes(p));
      const isTooShort = wordCount < 15;

      let prompt: string;

      if (isDontKnow) {
        prompt = `
You are a supportive but honest ${role} interviewer.
The candidate was asked: "${question}"
Their answer was: "${answer}"

They clearly don't know the answer. Respond with:
1. Encouragement — don't make them feel bad
2. A brief hint about what they should study or focus on
3. A low score reflecting they didn't answer

You MUST respond with ONLY valid JSON, no extra text:
{"feedback": "your encouraging feedback here", "score": 25}
        `.trim();
      } else if (isTooShort) {
        prompt = `
You are a ${role} interviewer.
The candidate gave a very short/incomplete answer to: "${question}"
Their answer: "${answer}"

Give constructive feedback asking them to elaborate more, and assign a low-mid score.

You MUST respond with ONLY valid JSON, no extra text:
{"feedback": "your feedback here", "score": 40}
        `.trim();
      } else {
        const context = followUpQ
          ? `\nFollow-up Question: "${followUpQ}"\nFollow-up Answer: "${followUpA || "No answer given"}"`
          : "";

        prompt = `
You are an expert ${role} Hiring Manager evaluating a mock interview response.

Main Question: "${question}"
Candidate Answer: "${answer}"${context}

Evaluate based on:
- Clarity and structure (did they use STAR method?)
- Technical depth and correctness
- Confidence and completeness
- How well they handled the follow-up (if any)

Give honest, specific feedback in 2-3 sentences. Mention what was good and what to improve.
Score range: 0-100 (be realistic — a decent answer is 60-75, excellent is 80+)

You MUST respond with ONLY valid JSON, no extra text:
{"feedback": "your detailed feedback here", "score": 70}
        `.trim();
      }

      const raw = await callGroq(prompt, true);
      const clean = raw.replace(/```json\n?|```\n?/g, "").trim();

      let parsed: { feedback: string; score: number };
      try {
        parsed = JSON.parse(clean);
      } catch {
        console.error("❌ Failed to parse Groq JSON:", raw);
        return res.json({
          feedback: isDontKnow
            ? "No worries! This topic is worth revisiting. Focus on understanding the core concepts and try again."
            : "Good effort! Try to structure your answer more clearly using the STAR method.",
          score: isDontKnow ? 20 : 50,
        });
      }

      return res.json({
        feedback: parsed.feedback ?? "Good attempt. Keep practicing!",
        score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
      });
    }

    // ─── LEGACY FALLBACK (no mode specified) ──────────────────────────────
    const isFeedbackRequest = "followUpQ" in req.body;

    if (!isFeedbackRequest) {
      const prompt = `
You are a senior ${role} interviewer.
Question: "${question}"
Candidate Answer: "${answer}"
Generate ONE sharp follow-up question (max 20 words) based on their answer.
Return ONLY the question text.
      `.trim();

      const raw = await callGroq(prompt);
      return res.json({ followUp: raw.trim() });
    } else {
      const context = followUpQ ? `\nFollow-up Q: "${followUpQ}"\nFollow-up A: "${followUpA}"` : "";
      const prompt = `
Evaluate this ${role} interview:
Q: "${question}"
A: "${answer}"${context}
Return ONLY valid JSON: {"feedback": "2-3 sentences", "score": number}
      `.trim();

      const raw = await callGroq(prompt, true);
      const clean = raw.replace(/```json\n?|```\n?/g, "").trim();

      let parsed: { feedback: string; score: number };
      try {
        parsed = JSON.parse(clean);
      } catch {
        return res.json({
          feedback: "The response was good, but focus more on technical depth.",
          score: 70,
        });
      }

      return res.json({
        feedback: parsed.feedback ?? "No feedback returned.",
        score: Math.max(0, Math.min(100, Number(parsed.score) || 60)),
      });
    }
  } catch (err) {
    console.error("❌ Groq route error:", err);
    return res.status(500).json({ error: "Groq call failed", detail: String(err) });
  }
});

export default router;