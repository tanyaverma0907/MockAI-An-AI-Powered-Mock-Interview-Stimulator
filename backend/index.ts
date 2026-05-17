
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import aiRoutes from "./src/routes/ai.routes.js";

// dotenv.config();

// // Ye check karne ke liye ki key load hui ya nahi
// if (process.env.GROQ_API_KEY) {
//   console.log("✅ API Key mil gayi hai!");
//   console.log("Key ke pehle 4 akshar:", process.env.GROQ_API_KEY.substring(0, 4));
// } else {
//   console.log("❌ Error: .env se key nahi mil rahi!");
// }

// const app = express();
// const PORT = process.env.PORT || 5000;

// if (!process.env.GROQ_API_KEY) {
//   console.error("❌ GEMINI_API_KEY is missing from your .env file!");
//   console.error("   Get a free key at: https://aistudio.google.com");
//   process.exit(1);
// }

// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(express.json());

// app.use((req, _res, next) => {
//   console.log(`🚀 ${req.method} ${req.url}`);
//   next();
// });

// app.use("/ai", aiRoutes);

// app.get("/ping", (_req, res) => {
//   res.json({ ok: true, message: "MockAI server is running ✅" });
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
//   console.log(`   Health check: http://localhost:${PORT}/ping`);
// });



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./src/routes/ai.routes.js";

dotenv.config();

// Ye check karne ke liye ki key load hui ya nahi
if (process.env.GROQ_API_KEY) {
  console.log("✅ API Key mil gayi hai!");
  console.log("Key ke pehle 4 akshar:", process.env.GROQ_API_KEY.substring(0, 4));
} else {
  console.log("❌ Error: .env se key nahi mil rahi!");
}

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY is missing from your .env file!");
  console.error("   Get a free key at: https://aistudio.google.com");
  process.exit(1);
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`🚀 ${req.method} ${req.url}`);
  next();
});

app.use("/ai", aiRoutes);

app.get("/ping", (_req, res) => {
  res.json({ ok: true, message: "MockAI server is running ✅" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/ping`);
});