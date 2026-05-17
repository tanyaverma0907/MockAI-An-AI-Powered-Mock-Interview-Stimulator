
// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// export async function callGemini(fullPrompt: string): Promise<string> {
//   const res = await fetch(GEMINI_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       contents: [{ parts: [{ text: fullPrompt }] }], // single prompt, no system_instruction
//       generationConfig: {
//         temperature: 0.4, // lower = more consistent scoring
//         maxOutputTokens: 512,
//       },
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.json() as { error?: { message?: string } };
//     throw new Error(err?.error?.message || `Gemini API error: ${res.status}`);
//   }

//   const data = await res.json() as {
//     candidates?: { content?: { parts?: { text?: string }[] } }[];
//   };

//   const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
//   if (!text) throw new Error("Empty response from Gemini");
//   return text;
// }

// Pehle check karein ki aapka API Key .env mein GROQ_API_KEY ke naam se hai
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// export async function callGroq(fullPrompt: string): Promise<string> {
//   // Error handling agar API key missing ho
//   if (!process.env.GROQ_API_KEY) {
//     throw new Error("GROQ_API_KEY is not defined in environment variables");
//   }

//   const res = await fetch(GROQ_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
//     },
//     body: JSON.stringify({
//       // Llama 3 model Gemini Flash se bhi fast hai aur free tier mein available hai
//       model: "llama3-8b-8192", 
//       messages: [
//         {
//           role: "user",
//           content: fullPrompt,
//         },
//       ],
//       generationConfig: {
//         temperature: 0.4, // Consistent scoring ke liye 0.4 best hai
//         max_tokens: 512,
//       },
//       // Agar aapko sirf JSON chahiye, toh aap ye bhi add kar sakte hain:
//       // response_format: { type: "json_object" }
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.json() as { error?: { message?: string } };
//     throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
//   }

//   const data = await res.json() as {
//     choices?: { message?: { content?: string } }[];
//   };

//   const text = data.choices?.[0]?.message?.content ?? "";
  
//   if (!text) throw new Error("Empty response from Groq");
  
//   return text;
// }


// export async function callGroq(fullPrompt: string): Promise<string> {
//   if (!process.env.GROQ_API_KEY) {
//     throw new Error("GROQ_API_KEY is not defined");
//   }

//   const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "user", content: fullPrompt }],
//       // Yahan dhyaan dein: generationConfig hata kar direct parameters likhne hain
//       temperature: 0.4,
//       max_tokens: 512,
//       top_p: 1,
//     }),
//   });

//   if (!res.ok) {
//     const err = await res.json() as any;
//     throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
//   }

//   const data = await res.json() as any;
//   return data.choices?.[0]?.message?.content ?? "";
// }





export async function callGroq(fullPrompt: string, isJson: boolean = false): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not defined");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: fullPrompt }],
      temperature: 0.4,
      max_tokens: 512,
      top_p: 1,
      ...(isJson && { response_format: { type: "json_object" } }),
    }),
  });

  if (!res.ok) {
    const err = await res.json() as any;
    throw new Error(err?.error?.message || `Groq API error: ${res.status}`);
  }

  const data = await res.json() as any;
  const text = data.choices?.[0]?.message?.content ?? "";

  if (!text) throw new Error("Empty response from Groq");

  return text;
}