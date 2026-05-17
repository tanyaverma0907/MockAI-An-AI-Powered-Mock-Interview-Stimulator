// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// export async function callGemini(fullPrompt: string): Promise<string> {
//   // 1. URL ko hamesha function ke ANDAR rakhein taaki har baar fresh KEY mile
//   const cleanKey = (process.env.GEMINI_API_KEY || "").trim();
//   const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
//   console.log("📡 Calling Gemini API...");

//   try {
//     const res = await fetch(GEMINI_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: fullPrompt }] }],
//         generationConfig: {
//           temperature: 0.4,
//           maxOutputTokens: 512,
//         },
//       }),
//     });

//     if (!res.ok) {
//       const err = await res.json() as any;
//       const msg = err?.error?.message || `Gemini API error: ${res.status}`;
//       console.error(`❌ Gemini error [${res.status}]: ${msg}`);
      
//       // DEBUG: Agar abhi bhi error aaye toh ye check karne ke liye ki key kya ja rahi hai
//       if (res.status === 400) {
//         console.log("Tip: Check karein ki URL mein key sahi hai ya nahi (First 4 chars):", cleanKey.substring(0, 4));
//       }
      
//       throw new Error(msg);
//     }

//     const data = await res.json() as any;
//     const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

//     if (!text) throw new Error("Empty response from Gemini");

//     console.log("✅ Gemini responded successfully");
//     return text;

//   } catch (error) {
//     console.error("💥 Fetch Error:", error);
//     throw error;
//   }
// }




import dotenv from "dotenv";

dotenv.config();

/**
 * Helper: Gemini API Call
 * Updated to use Gemini 2.0 Flash as per your available models list.
 */
export async function callGemini(fullPrompt: string): Promise<string> {
  // 1. Always get the latest key and trim any hidden characters/spaces
  const cleanKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!cleanKey) {
    throw new Error("GEMINI_API_KEY is missing in .env file");
  }

  // 2. Updated URL to use the 2.0-flash model found in your list
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${cleanKey}`;

  console.log("📡 Calling Gemini 2.0 Flash API...");

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        contents: [
          { 
            parts: [{ text: fullPrompt }] 
          }
        ],
        generationConfig: {
          temperature: 0.5, // Balanced creativity and professionalism
          maxOutputTokens: 512,
          topP: 0.95,
        },
      }),
    });

    // 3. Handle specific error codes
    if (!res.ok) {
      const errData = await res.json() as any;
      const statusCode = res.status;
      const message = errData?.error?.message || "Unknown Gemini Error";
      
      console.error(`❌ Gemini API Error [${statusCode}]: ${message}`);
      
      if (statusCode === 400) {
        console.error("💡 Tip: Your API key might be malformed or request body is invalid.");
      } else if (statusCode === 404) {
        console.error("💡 Tip: The model name 'gemini-2.0-flash' was not found. Check your regions.");
      }
      
      throw new Error(message);
    }

    const data = await res.json() as any;
    
    // 4. Safe navigation to get the response text
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      console.error("❌ Empty response body from Gemini:", JSON.stringify(data));
      throw new Error("Gemini returned an empty response.");
    }

    console.log("✅ Gemini responded successfully");
    return text;

  } catch (error: any) {
    console.error("💥 Fetch/Network Error in gemini.ts:", error.message);
    throw error;
  }
}

/**
 * Helper: Utility to clean JSON from Gemini's markdown response
 */
export function parseGeminiJson(text: string) {
  try {
    // Removes ```json ... ``` blocks if the AI adds them
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("❌ JSON Clean Parse Failed. Raw Text:", text);
    throw new Error("AI output was not in valid JSON format.");
  }
}