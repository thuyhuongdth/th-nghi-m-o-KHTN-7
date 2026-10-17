import React, { useState } from 'react';
import { Sparkles, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '../utils/sound';

interface ProfessorAvatarProps {
  message: string;
  hint?: string;
  mood?: 'happy' | 'thinking' | 'excited' | 'guiding';
}

export const ProfessorAvatar: React.FC<ProfessorAvatarProps> = ({
  message,
  hint,
  mood = 'guiding',
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleHint = () => {
    sound.playClick();
    setShowHint((prev) => !prev);
  };

  return (
    <aside aria-label="Giáo sư Mầm Xanh - Trợ giảng ảo" className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md w-full px-3 pointer-events-none transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-md border-2 border-emerald-500/30 rounded-2xl shadow-xl shadow-emerald-950/10 p-3 pointer-events-auto transition-all">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            {/* Cute Professor Sprout Avatar SVG */}
            <div className="relative w-10 h-10 rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                {/* Sprout leaf */}
                <path
                  d="M50 35 C45 15, 25 18, 30 30 C35 38, 48 35, 50 35 Z"
                  fill="#10b981"
                  stroke="#047857"
                  strokeWidth="2"
                />
                <path
                  d="M50 35 C55 12, 75 16, 70 28 C65 36, 52 35, 50 35 Z"
                  fill="#34d399"
                  stroke="#047857"
                  strokeWidth="2"
                />
                {/* Seed body */}
                <ellipse cx="50" cy="62" rx="32" ry="28" fill="#a7f3d0" stroke="#059669" strokeWidth="2.5" />
                {/* Lab glasses */}
                <circle cx="40" cy="58" r="9" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
                <circle cx="60" cy="58" r="9" fill="#e0f2fe" stroke="#0369a1" strokeWidth="2.5" />
                <line x1="49" y1="58" x2="51" y2="58" stroke="#0369a1" strokeWidth="2.5" />
                {/* Eyes */}
                <circle cx="40" cy="58" r="3.5" fill="#0f172a" />
                <circle cx="41.5" cy="56.5" r="1.2" fill="#ffffff" />
                <circle cx="60" cy="58" r="3.5" fill="#0f172a" />
                <circle cx="61.5" cy="56.5" r="1.2" fill="#ffffff" />
                {/* Cheeks */}
                <circle cx="30" cy="68" r="4" fill="#fca5a5" opacity="0.6" />
                <circle cx="70" cy="68" r="4" fill="#fca5a5" opacity="0.6" />
                {/* Happy mouth */}
                {mood === 'happy' || mood === 'excited' ? (
                  <path d="M43 70 Q50 78 57 70" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  <path d="M44 72 Q50 75 56 72" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" />
                )}
                {/* Lab coat collar */}
                <path d="M36 84 L50 76 L64 84 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
              </svg>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-emerald-900">GS. Mầm Xanh</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-300">
                  Trợ giảng AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-600">Đồng hành nghiên cứu khoa học</p>
            </div>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
            title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Message body */}
        {!isMinimized && (
          <div className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="flex gap-2 items-start">
              <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <p className="font-medium text-slate-800">{message}</p>
            </div>

            {/* Hint toggler */}
            {hint && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={toggleHint}
                  className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Ẩn gợi ý' : 'Cần gợi ý từ Giáo sư?'}</span>
                </button>
                {showHint && (
                  <div className="mt-1.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed animate-fadeIn">
                    💡 <span className="font-medium">{hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
