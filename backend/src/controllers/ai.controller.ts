// import type { Request, Response } from "express";

// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// export async function evaluateAnswer(req: Request, res: Response): Promise<void> {
//   try {
//     const { question, answer, role, followUpQ, followUpA } = req.body;
    
//     const wordCount = answer.trim().split(/\s+/).length;

//     // Logic: Agar ye initial answer hai aur chota hai, toh follow-up pucho.
//     // Agar follow-up ka answer aa gaya hai, ya answer kafi bada (> 80 words), toh sidha feedback do.
//     const isReadyForFeedback = (followUpQ && followUpA) || wordCount >= 80;

//     if (!isReadyForFeedback) {
//       console.log("❓ Generating Follow-up...");
//       const followUp = await generateFollowUp(question, answer, role);
      
//       // Agar Gemini 'NO_FOLLOWUP' bole, toh skip karke feedback generate karo
//       if (followUp) {
//         res.json({ followUp });
//         return;
//       }
//     }

//     console.log("📊 Generating Comprehensive Feedback...");
//     const result = await generateFeedback(question, answer, role, followUpQ, followUpA);
//     res.json(result);

//   } catch (error) {
//     console.error("💥 Controller Error:", error);
//     res.status(500).json({ error: "Failed to process interview data" });
//   }
// }

// // ─── Follow-up Logic ─────────────────────────────────────────────────────────
// async function generateFollowUp(question: string, answer: string, role: string): Promise<string | null> {
//   const prompt = `You are a senior ${role} interviewer.
//   Question: "${question}"
//   Candidate Answer: "${answer}"
  
//   Task: If the answer is vague or lacks specific tech details, ask ONE deep-dive follow-up. 
//   If the answer is already perfect, reply with: NO_FOLLOWUP.
//   Stay conversational and professional. Max 20 words.`;

//   try {
//     const text = await callGemini(prompt);
//     if (text.includes("NO_FOLLOWUP")) return null;
//     return text.trim();
//   } catch (err) {
//     console.error("Follow-up Gemini error:", err);
//     return null;
//   }
// }

// // ─── Feedback Logic ──────────────────────────────────────────────────────────
// async function generateFeedback(question: string, answer: string, role: string, fQ?: string, fA?: string) {
//   const context = fQ ? `\nFollow-up was: ${fQ}\nFollow-up Answer: ${fA}` : "";
  
//   const prompt = `You are an expert ${role} Hiring Manager.
//   Evaluate this interview:
//   Q: ${question}
//   A: ${answer}${context}

//   Provide a score (0-100) and conversational feedback (2-4 sentences). 
//   Be specific about technical terms mentioned.
  
//   IMPORTANT: Return ONLY a valid JSON object:
//   {"score": number, "feedback": "string"}`;

//   try {
//     const rawText = await callGemini(prompt);
//     return parseGeminiJson(rawText);
//   } catch (err) {
//     console.error("Feedback Gemini error:", err);
//     return { score: 65, feedback: "Good effort, but I'd like to see more specific examples of your impact." };
//   }
// }

// // ─── Helper: Gemini API Call ──────────────────────────────────────────────────
// async function callGemini(fullPrompt: string): Promise<string> {
//   const response = await fetch(GEMINI_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ parts: [{ text: fullPrompt }] }],
//       generationConfig: { 
//         temperature: 0.4, 
//         maxOutputTokens: 500,
//         // Force response format if your API version supports it:
//         // response_mime_type: "application/json" 
//       },
//     }),
//   });

//   const data = await response.json() as any;
//   if (!response.ok) throw new Error(data.error?.message || "Gemini API Error");

//   return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
// }

// // ─── Helper: Safe JSON Parsing ───────────────────────────────────────────────
// function parseGeminiJson(text: string) {
//   try {
//     // Extract JSON if Gemini adds markdown code blocks
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     const cleanJson = jsonMatch ? jsonMatch[0] : text;
//     return JSON.parse(cleanJson);
//   } catch (e) {
//     console.error("JSON Clean Parse Failed:", text);
//     throw new Error("Invalid JSON format from AI");
//   }
// }





import type { Request, Response } from "express";

// Groq ka standard endpoint
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function evaluateAnswer(req: Request, res: Response): Promise<void> {
  try {
    const { question, answer, role, followUpQ, followUpA } = req.body;
    const wordCount = answer.trim().split(/\s+/).length;

    // Ready check
    const isReadyForFeedback = (followUpQ && followUpA) || wordCount >= 80;

    if (!isReadyForFeedback) {
      console.log("❓ Generating Follow-up via Groq...");
      const followUp = await generateFollowUp(question, answer, role);
      if (followUp) {
        res.json({ followUp });
        return;
      }
    }

    console.log("📊 Generating Feedback via Groq...");
    const result = await generateFeedback(question, answer, role, followUpQ, followUpA);
    res.json(result);

  } catch (error) {
    console.error("💥 Controller Error:", error);
    res.status(500).json({ error: "Failed to process interview data" });
  }
}

// ─── Groq API Call Helper (Gemini ki jagah) ───────────────────────────────────
async function callGroq(prompt: string, isJson: boolean = false): Promise<string> {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192", // Fast & Free model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      // Agar JSON chahiye toh Groq ko force karna
      response_format: isJson ? { type: "json_object" } : undefined,
    }),
  });

  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || "Groq API Error");

  return data.choices[0]?.message?.content || "";
}

// ─── Logic Functions (Only calling callGroq now) ──────────────────────────────
async function generateFollowUp(question: string, answer: string, role: string): Promise<string | null> {
  const prompt = `You are a senior ${role} interviewer. 
  Question: "${question}" Candidate Answer: "${answer}"
  Task: Ask ONE deep-dive follow-up or reply NO_FOLLOWUP. Max 20 words.`;

  const text = await callGroq(prompt);
  return text.includes("NO_FOLLOWUP") ? null : text.trim();
}

async function generateFeedback(question: string, answer: string, role: string, fQ?: string, fA?: string) {
  const context = fQ ? `\nFollow-up: ${fQ}\nFollow-up Ans: ${fA}` : "";
  const prompt = `You are an expert ${role} Hiring Manager.
  Evaluate: Q: ${question} A: ${answer}${context}
  Return ONLY JSON: {"score": number, "feedback": "string"}`;

  const rawText = await callGroq(prompt, true); // JSON mode enabled
  return JSON.parse(rawText);
}