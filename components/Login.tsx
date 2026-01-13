
import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasEmergingFinished, setHasEmergingFinished] = useState(false);

  useEffect(() => {
    // Cinematic slow motion delay
    const timer = setTimeout(() => setHasEmergingFinished(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Verification Failed: Invalid credentials.');
        setIsLoading(false);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#000005] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* --- GALAXY & SOLAR SYSTEM ENGINE --- */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sun-pulsate {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px #ff9900, 0 0 120px rgba(255, 153, 0, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 80px #ffaa00, 0 0 160px rgba(255, 170, 0, 0.6); }
        }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        
        /* INTENSE RED FIRE FLICKER */
        @keyframes flame-flicker-red {
          0%, 100% { filter: blur(6px) brightness(1.2); transform: scale(1) rotate(-15deg); }
          50% { filter: blur(10px) brightness(1.8); transform: scale(1.15) rotate(-10deg); }
        }

        /* STONE PASSING ANIMATION - ULTRA SLOW */
        @keyframes stone-float {
          0% { transform: translate(-800px, 150px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translate(0px, 0px) rotate(180deg); }
          90% { opacity: 0.8; }
          100% { transform: translate(800px, -150px) rotate(360deg); opacity: 0; }
        }

        .galaxy-system {
          position: absolute;
          width: 1400px;
          height: 1400px;
          left: 70%; /* Focal point at 70% */
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          pointer-events: none;
        }

        /* SHARP & CLEAR SUN CORE */
        .sun-core {
          position: absolute;
          width: 110px;
          height: 110px;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #fff7e6 15%, #ffcc33 45%, #ff8800 85%, #ff4400 100%);
          border-radius: 50%;
          z-index: 50;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: sun-pulsate 10s ease-in-out infinite;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .sun-core::after {
          content: '';
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(255, 153, 0, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(10px);
        }

        /* SPACE STONE WITH INTENSE RED FIRE */
        .space-stone {
          position: absolute;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle at 30% 30%, #444, #1a0000 80%, #000);
          border-radius: 45% 55% 52% 48%; /* Irregular rock shape */
          box-shadow: inset -5px -5px 10px rgba(0,0,0,0.8), 0 0 25px rgba(255, 0, 0, 0.6);
          z-index: 60; /* Higher than sun-core to pass over it */
          animation: stone-float 45s linear infinite; /* Ultra slow motion */
          border: 1px solid rgba(255, 0, 0, 0.2);
        }

        /* THE INTENSE RED FIRE TRAIL (TAIL) */
        .space-stone::before {
          content: '';
          position: absolute;
          top: 5%;
          left: -150%;
          width: 180%;
          height: 90%;
          background: linear-gradient(to right, transparent, rgba(255, 0, 0, 0.9), #ff0000);
          filter: blur(8px);
          border-radius: 100% 0 0 100%;
          z-index: -1;
          animation: flame-flicker-red 0.15s ease-in-out infinite;
          transform-origin: right center;
        }

        /* PURE RED GLOW AURA */
        .space-stone::after {
          content: '';
          position: absolute;
          inset: -15px;
          background: radial-gradient(circle, rgba(255, 0, 0, 0.5) 0%, transparent 85%);
          border-radius: 50%;
          z-index: -1;
        }

        .orbit-ring {
          position: absolute;
          border: 2.5px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          animation: orbit linear infinite;
          box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
        }

        .planet {
          border-radius: 50%;
          box-shadow: inset -4px -4px 8px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.3);
          border: 0.5px solid rgba(255,255,255,0.1);
        }

        /* Planets Definitions */
        .p-mercury { width: 160px; height: 160px; animation-duration: 8s; }
        .p-mercury .planet { width: 8px; height: 8px; background: #a5a5a5; margin-right: -4px; }

        .p-venus { width: 230px; height: 230px; animation-duration: 12s; }
        .p-venus .planet { width: 14px; height: 14px; background: #e3bb76; margin-right: -7px; }

        .p-earth { width: 320px; height: 320px; animation-duration: 18s; }
        .p-earth .planet { width: 16px; height: 16px; background: #2271b3; border: 1px solid #4ca54c; margin-right: -8px; }

        .p-mars { width: 400px; height: 400px; animation-duration: 25s; }
        .p-mars .planet { width: 12px; height: 12px; background: #e27b58; margin-right: -6px; }

        .p-jupiter { width: 550px; height: 550px; animation-duration: 45s; }
        .p-jupiter .planet { width: 42px; height: 42px; background: #d39c7e; margin-right: -21px; border: 2px solid #b57a5c; }

        .p-saturn { width: 750px; height: 750px; animation-duration: 65s; }
        .p-saturn .planet { width: 34px; height: 34px; background: #c5ab6e; margin-right: -17px; position: relative; }
        .p-saturn .rings { position: absolute; width: 60px; height: 10px; border: 4px solid rgba(197, 171, 110, 0.4); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(25deg); }

        .p-uranus { width: 900px; height: 900px; animation-duration: 100s; }
        .p-uranus .planet { width: 22px; height: 22px; background: #b5e3e3; margin-right: -11px; }

        .p-neptune { width: 1050px; height: 1050px; animation-duration: 150s; }
        .p-neptune .planet { width: 20px; height: 20px; background: #4b70dd; margin-right: -10px; }

        .p-pluto { width: 1200px; height: 1200px; animation-duration: 200s; }
        .p-pluto .planet { width: 6px; height: 6px; background: #fff1e0; margin-right: -3px; opacity: 0.8; }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle var(--d) ease-in-out infinite;
        }

        .login-card-slide {
          transition: all 5s cubic-bezier(0.15, 0.85, 0.35, 1);
        }
      `}</style>

      {/* --- BACKGROUND STARFIELD --- */}
      <div className="absolute inset-0 z-0">
        {[...Array(400)].map((_, i) => (
          <div 
            key={i} 
            className="star"
            style={{
              width: (Math.random() * 2 + 1) + 'px',
              height: (Math.random() * 2 + 1) + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random(),
              '--d': (Math.random() * 5 + 2) + 's'
            } as any}
          />
        ))}
        {/* Galactic Nebulae for atmospheric depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,100,0,0.12),transparent_40%),radial-gradient(circle_at_30%_80%,rgba(0,100,255,0.08),transparent_50%)]"></div>
      </div>

      {/* --- GALAXY / SOLAR SYSTEM --- */}
      <div className="galaxy-system flex items-center justify-center">
        {/* Central Star (Sun) */}
        <div className="sun-core"></div>

        {/* THE SPACE STONE (Saturn Size, Passing over the Sun, WITH INTENSE RED FIRE) */}
        <div className="space-stone"></div>

        {/* Orbiting Planets (9 Ghrae) */}
        <div className="orbit-ring p-mercury"><div className="planet"></div></div>
        <div className="orbit-ring p-venus"><div className="planet"></div></div>
        <div className="orbit-ring p-earth"><div className="planet"></div></div>
        <div className="orbit-ring p-mars"><div className="planet"></div></div>
        <div className="orbit-ring p-jupiter"><div className="planet"></div></div>
        <div className="orbit-ring p-saturn">
          <div className="planet">
            <div className="rings"></div>
          </div>
        </div>
        <div className="orbit-ring p-uranus"><div className="planet"></div></div>
        <div className="orbit-ring p-neptune"><div className="planet"></div></div>
        <div className="orbit-ring p-pluto"><div className="planet"></div></div>
      </div>

      {/* --- LOGIN INTERFACE --- */}
      <div className={`relative z-20 w-full max-w-md login-card-slide ${hasEmergingFinished ? 'scale-100 opacity-100 translate-x-[-320px]' : 'scale-0 opacity-0 translate-x-[500px] rotate-12'}`}>
        
        <div className="absolute -inset-10 bg-gradient-to-br from-blue-600/10 via-amber-500/5 to-transparent rounded-[4rem] blur-[100px]"></div>
        
        <div className="relative bg-[#020308]/70 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden group">
          
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent group-hover:via-amber-400 transition-all duration-2000"></div>

          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 mb-6 relative">
               <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                  <g className="animate-rainbow">
                    <ellipse cx="50" cy="50" rx="42" ry="46" fill="#000" stroke="#38bdf8" strokeWidth="4" />
                    <circle cx="35" cy="42" r="14" fill="white" />
                    <circle cx="65" cy="42" r="14" fill="white" />
                    <circle cx="35" cy="42" r="8" fill="#000" />
                    <circle cx="65" cy="42" r="8" fill="#000" />
                    <path d="M50 52L44 60H56L50 52Z" fill="#38bdf8" />
                    <path d="M25 62 Q 50 85 75 62" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
               </svg>
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase flex items-center gap-2">
              VAS <span className="text-brand-400">LOGISTICS</span>
            </h1>
            <div className="h-[2.5px] w-20 bg-gradient-to-r from-transparent via-brand-500 to-transparent mt-3"></div>
            <p className="text-slate-500 text-[10px] font-black tracking-[0.8em] uppercase mt-4 opacity-70">Galactic Operations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Universal Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-brand-400 transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all placeholder-slate-800"
                  placeholder="admin"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Access Protocol</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-amber-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder-slate-800"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading || !username || !password}
              className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 mt-4 shadow-xl hover:shadow-white/20"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  <span className="uppercase tracking-tighter">Engaging Warp...</span>
                </div>
              ) : (
                <><span className="uppercase tracking-tighter">Login to Nexus</span> <ArrowRight size={22} /></>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.6em] opacity-50">
              Interstellar Terminal v2.5
            </p>
          </div>
        </div>
      </div>

      {/* Extreme background depth wisps */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] left-[5%] w-2 h-2 bg-blue-500/10 rounded-full blur-[6px] animate-pulse"></div>
          <div className="absolute bottom-[30%] left-[15%] w-1 h-1 bg-amber-500/10 rounded-full animate-ping" style={{animationDuration: '5s'}}></div>
      </div>
    </div>
  );
};
