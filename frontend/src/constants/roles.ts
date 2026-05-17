export interface RoleConfig {
  label: string;
  emoji: string;
  color: string;
  accentRgb: string;
  tag: string;
  questions: string[];
}

export const ROLE_QUESTIONS: Record<string, RoleConfig> = {
  "frontend-dev": {
    label: "Frontend Developer",
    emoji: "🖥️", 
    color: "#818cf8",
    accentRgb: "129,140,248",
    tag: "UI · React · CSS",
    questions: [
      "Walk me through how you approach building a responsive layout from scratch.",
      "Explain the difference between controlled and uncontrolled components in React.",
      "How do you optimize the performance of a React application?",
      "Describe a time you resolved a complex CSS bug under a tight deadline.",
      "What is your strategy for writing accessible, WCAG-compliant UI components?",
    ],
  },
  "backend-dev": {
    label: "Backend Developer",
    emoji: "⚙️",
    color: "#38bdf8",
    accentRgb: "56,189,248",
    tag: "APIs · Databases · Node",
    questions: [
      "How do you design a RESTful API that is both scalable and maintainable?",
      "Explain the differences between SQL and NoSQL databases and when you'd choose each.",
      "Describe how you handle authentication and authorization in a Node.js application.",
      "What strategies do you use for database query optimization?",
      "Tell me about a time you had to debug a critical production issue. What was your approach?",
    ],
  },
  "data-scientist": {
    label: "Data Scientist",
    emoji: "📊",
    color: "#34d399",
    accentRgb: "52,211,153",
    tag: "ML · Python · Stats",
    questions: [
      "Walk me through your typical workflow when approaching a new data science problem.",
      "How do you handle missing or imbalanced data in a machine learning dataset?",
      "Explain the bias-variance tradeoff in your own words.",
      "Describe a machine learning project you're most proud of and the impact it had.",
      "How do you communicate complex model insights to non-technical stakeholders?",
    ],
  },
  "product-manager": {
    label: "Product Manager",
    emoji: "🧭",
    color: "#fbbf24",
    accentRgb: "251,191,36",
    tag: "Strategy · Roadmaps · Users",
    questions: [
      "How do you prioritize features when you have limited engineering resources?",
      "Describe your process for gathering and synthesizing user feedback.",
      "Tell me about a product you launched. What would you do differently in hindsight?",
      "How do you handle disagreements between engineering, design, and business stakeholders?",
      "Walk me through how you would define success metrics for a new feature.",
    ],
  },
  "ux-designer": {
    label: "UX Designer",
    emoji: "🎨",
    color: "#f472b6",
    accentRgb: "244,114,182",
    tag: "Research · Figma · Systems",
    questions: [
      "Walk me through your end-to-end design process for a complex product feature.",
      "How do you conduct user research when time and budget are constrained?",
      "Describe a time you had to advocate for the user against business pressure.",
      "How do you measure whether a design decision actually improved the user experience?",
      "Tell me about your approach to designing accessible and inclusive interfaces.",
    ],
  },
  devops: {
    label: "DevOps Engineer",
    emoji: "🔧",
    color: "#a78bfa",
    accentRgb: "167,139,250",
    tag: "CI/CD · K8s · IaC",
    questions: [
      "How do you design a CI/CD pipeline for a microservices-based application?",
      "What is your approach to container orchestration using Kubernetes?",
      "Describe how you handle infrastructure-as-code in your current or previous role.",
      "How do you monitor system health and respond to incidents in production?",
      "Tell me about a time a deployment went wrong. How did you respond and recover?",
    ],
  },
  "ml-engineer": {
    label: "ML Engineer",
    emoji: "🤖",
    color: "#2dd4bf",
    accentRgb: "45,212,191",
    tag: "MLOps · PyTorch · Deploy",
    questions: [
      "How do you take a machine learning model from experimentation to production?",
      "What MLOps practices do you consider essential for reliable model deployment?",
      "Explain how you'd monitor a deployed model for data drift or degradation.",
      "Describe your approach to feature engineering for a time-series problem.",
      "Tell me about the most challenging model you have deployed and what made it difficult.",
    ],
  },
  general: {
    label: "General Interview",
    emoji: "💼",
    color: "#94a3b8",
    accentRgb: "148,163,184",
    tag: "Behavioral · Soft Skills",
    questions: [
      "Tell me about yourself and what drives your professional growth.",
      "What are your greatest strengths and how do they contribute to your work?",
      "Describe a challenging situation you faced and how you overcame it.",
      "Where do you see yourself professionally in the next five years?",
      "Why are you interested in this role and what makes you a strong fit?",
    ],
  },
};