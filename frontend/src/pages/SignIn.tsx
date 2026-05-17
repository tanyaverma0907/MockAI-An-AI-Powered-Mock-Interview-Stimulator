
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook

const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Access theme context
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message?.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "") || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row font-['DM Sans',sans-serif] transition-colors duration-500 ${
      isDark ? "bg-[#030308] text-white" : "bg-white text-slate-900"
    }`}>
      
      {/* ── LEFT SIDE: Branding ── */}
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden justify-center border-r pt-32 transition-colors duration-500 ${
        isDark ? "bg-[#060612] border-white/5" : "bg-slate-50 border-slate-200"
      }`}>
        {/* Ambient Glows */}
        <div className={`absolute top-0 left-0 w-full h-full blur-[120px] rounded-full transition-opacity duration-500 ${
          isDark ? "bg-violet-600/5" : "bg-violet-600/[0.03]"
        }`} />
        
        <div className="relative z-10 px-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="mb-10 inline-block">
            <div className={`w-64 h-64 rounded-[2.5rem] border flex items-center justify-center relative group transition-all duration-500 ${
              isDark ? "bg-[#1a1333] border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"
            }`}>
               <img 
                 src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" 
                 alt="Bot"
                 className="w-36 h-36 object-contain group-hover:scale-110 transition-transform duration-500"
               />
               <div className="absolute inset-0 opacity-10 dark:opacity-20" 
                 style={{ backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`, backgroundSize: '20px 20px' }} 
               />
            </div>
          </div>
          <h1 className="text-4xl font-black font-['Syne'] tracking-tighter mb-4">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">Interview.</span>
          </h1>
          <p className={`${isDark ? "text-gray-500" : "text-slate-500"} max-w-sm mx-auto leading-relaxed`}>
            Join 50,000+ professionals using AI to simulate real-world interviews.
          </p>
        </div>
      </div>

      {/* ── RIGHT SIDE: Login Form ── */}
      <div className="w-full lg:w-1/2 flex justify-center p-8 sm:p-12 pt-24 lg:pt-32">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          
          <div className="mb-10">
            <p className={`text-sm mb-2 font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>Log in to your account to continue your practice.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-1 ${isDark ? "text-gray-500" : "text-slate-400"}`}>Email Address</label>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                  isDark 
                    ? "bg-[#0a0a15] border-white/5 text-white" 
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? "text-gray-500" : "text-slate-400"}`}>Password</label>
                <button type="button" className={`text-[10px] font-black uppercase hover:underline ${isDark ? "text-violet-500" : "text-violet-600"}`}>Forgot?</button>
              </div>
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-violet-500/50 transition-all ${
                  isDark 
                    ? "bg-[#0a0a15] border-white/5 text-white" 
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl shadow-fuchsia-900/20 active:scale-[0.98] transition-all"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? "border-white/5" : "border-slate-200"}`} />
            </div>
            <div className="relative flex justify-center">
              <span className={`px-4 text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-500 ${
                isDark ? "bg-[#030308] text-gray-600" : "bg-white text-slate-400"
              }`}>or</span>
            </div>
          </div>

          <button 
            onClick={handleGoogle} disabled={loading}
            className={`w-full py-4 rounded-2xl border transition-all flex items-center justify-center gap-3 text-sm font-bold ${
              isDark 
                ? "bg-white/[0.03] border-white/5 text-white hover:bg-white/[0.08]" 
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className={`mt-12 text-center text-sm ${isDark ? "text-gray-500" : "text-slate-500"}`}>
            New to MockAI? {" "}
            <Link to="/sign-up" className={`font-black uppercase text-[10px] tracking-widest ml-1 ${isDark ? "text-violet-400" : "text-violet-600"}`}>
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;