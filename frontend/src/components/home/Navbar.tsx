
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

// --- Ultra-Premium Theme Toggle with Morphing Effects ---
const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300
      border overflow-hidden
      ${isDark 
        ? "bg-stone-950/20 border-white/5 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]" 
        : "bg-stone-100 border-stone-200/60 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
      }`}
  >
    <div className={`absolute inset-1 rounded-lg transition-all duration-700 blur-sm 
      ${isDark ? "bg-violet-950 group-hover:bg-violet-800" : "bg-amber-100 group-hover:bg-amber-200"}`} 
    />

    <div className="relative z-10 w-6 h-6 flex items-center justify-center">
      <svg
        className={`absolute w-5 h-5 transition-all duration-500 transform ease-out
          ${isDark 
            ? "opacity-0 rotate-180 scale-50 blur-sm" 
            : "opacity-100 rotate-0 scale-100 blur-0 text-amber-500"
          }`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 18v1m9-11h1m-11 0H2m3.364-7.364l.707.707m12.728 12.728l.707.707M6.343 17.657l-.707.707M17.657 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <svg
        className={`absolute w-5 h-5 transition-all duration-500 transform ease-out
          ${isDark 
            ? "opacity-100 rotate-0 scale-100 blur-0 text-violet-400" 
            : "opacity-0 -rotate-180 scale-50 blur-sm"
          }`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </div>
  </button>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
    setUserDropdown(false);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" }, // <--- Contact Button Added back
  ];

  const isActive = (href: string) => 
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const linkClasses = `relative px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group
    ${isDark ? "text-stone-400 hover:text-white" : "text-stone-600 hover:text-stone-900"}`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 py-5 px-4 md:px-10">
        <div className={`max-w-7xl mx-auto rounded-3xl border transition-all duration-500 backdrop-blur-xl shadow-lg
          ${isDark 
            ? "bg-stone-950/80 border-white/5 shadow-black/10" 
            : "bg-white/90 border-stone-200/60 shadow-stone-900/5"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-extrabold text-xl font-['Syne',sans-serif]">M</span>
              </div>
              <span className={`font-bold text-2xl tracking-tighter font-['Syne',sans-serif] 
                ${isDark ? "text-white" : "text-stone-950"}`}>
                Mock<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent group-hover:from-fuchsia-400 group-hover:to-violet-400 transition-colors duration-500">AI</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href} className={linkClasses}>
                  <span className="relative z-10">{link.label}</span>
                  {isActive(link.href) && (
                    <div className={`absolute inset-0 rounded-xl transition-all duration-500 
                      ${isDark ? 'bg-white/5' : 'bg-stone-100'}`} />
                  )}
                  {isActive(link.href) && (
                    <div className="absolute left-4 right-4 -bottom-1 h-px bg-gradient-to-r from-violet-500/0 via-violet-500 to-fuchsia-500/0" />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions Area */}
            <div className="flex items-center gap-5">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

              <div className={`w-px h-8 ${isDark ? "bg-white/5" : "bg-stone-200"}`} />

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdown(!userDropdown)}
                    className={`flex items-center gap-3 p-1.5 rounded-full border border-stone-200/60 transition-all duration-300 
                      hover:shadow-md ${isDark ? "dark:border-white/5 dark:hover:bg-white/5 hover:border-violet-500/30" : "hover:border-stone-300 hover:bg-white"}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                      {(user.displayName || user.email || "U")[0].toUpperCase()}
                    </div>
                  </button>

                  {userDropdown && (
                    <div className={`absolute right-0 top-full mt-4 w-60 rounded-3xl border shadow-2xl p-2.5 animate-in fade-in slide-in-from-top-3 duration-300
                      ${isDark ? 'bg-stone-950 border-white/5 shadow-black/30' : 'bg-white border-stone-100 shadow-stone-900/10'}`}>
                      <div className={`px-4 py-3 mb-2 border-b ${isDark ? 'border-white/5' : 'border-stone-100'}`}>
                        <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-stone-500' : 'text-stone-400'} font-bold`}>Account</p>
                        <p className={`text-sm truncate font-medium ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>{user.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserDropdown(false)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-colors
                        ${isDark ? 'text-stone-200 hover:bg-white/5' : 'text-stone-700 hover:bg-stone-50'}`}>
                        <span>📊</span> <span className="flex-1 text-left">My Dashboard</span>
                      </Link>
                      <button onClick={handleSignOut} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-red-500 transition-colors
                        ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}>
                        <span>🚪</span> <span className="flex-1 text-left">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3.5">
                  <button onClick={() => navigate("/sign-in")} className={`text-sm font-semibold transition-colors
                    ${isDark ? "text-stone-300 hover:text-violet-400" : "text-stone-700 hover:text-violet-600"}`}>
                    LogIn
                  </button>
                  <button onClick={() => navigate("/login")} className="relative group px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-violet-500/20 overflow-hidden active:scale-95 transition-all duration-300">
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:scale-105 transition-transform duration-500" />
                    <span className="relative text-white font-['Syne',sans-serif]">Start Interviewing →</span>
                  </button>
                </div>
              )}

              {/* Mobile Menu Icon */}
              <button className={`md:hidden p-2 rounded-lg transition-colors 
                ${isDark ? 'text-white hover:bg-white/5' : 'text-stone-900 hover:bg-stone-100'}`} onClick={() => setMenuOpen(!menuOpen)}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute left-4 right-4 mt-3 transition-all duration-500 ease-out 
          ${menuOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
          <div className="bg-white/95 dark:bg-stone-950/95 border border-stone-200/60 dark:border-white/5 rounded-3xl p-4 shadow-2xl backdrop-blur-lg">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} className={`block py-3.5 px-5 rounded-2xl mb-1.5 transition-colors
                ${isDark ? 'text-stone-200 hover:bg-white/5' : 'text-stone-800 hover:bg-stone-50'} font-medium`}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {(userDropdown || menuOpen) && <div className="fixed inset-0 z-40" onClick={() => { setUserDropdown(false); setMenuOpen(false); }} />}
    </>
  );
};

export default Navbar;