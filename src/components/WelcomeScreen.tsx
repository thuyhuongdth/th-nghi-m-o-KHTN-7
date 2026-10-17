import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface WelcomeScreenProps {
  initialName: string;
  initialClass: string;
  hasSavedProgress: boolean;
  savedStage: number;
  savedScore: number;
  onStart: (name: string, studentClass: string) => void;
  onResume: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  initialName,
  initialClass,
  hasSavedProgress,
  savedStage,
  savedScore,
  onStart,
  onResume,
}) => {
  const [name, setName] = useState(initialName || '');
  const [studentClass, setStudentClass] = useState(initialClass || '');
  const [error, setError] = useState('');

  const handleStartNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Em vui lòng nhập họ và tên của mình để bắt đầu nhé!');
      sound.playGentleWrong();
      return;
    }
    setError('');
    sound.playSuccess();
    onStart(name.trim(), studentClass.trim() || '7A');
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background decorations: Botanical laboratory vibes */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 -z-10" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative floating botanical elements */}
      <div className="absolute top-16 left-8 opacity-20 hidden lg:block select-none pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <path d="M50 80 Q30 50 20 20 Q50 30 50 80" fill="#059669" />
          <path d="M50 80 Q70 50 80 20 Q50 30 50 80" fill="#10b981" />
        </svg>
      </div>
      <div className="absolute bottom-16 right-8 opacity-20 hidden lg:block select-none pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="35" ry="25" fill="#047857" transform="rotate(-30 50 50)" />
          <path d="M50 30 Q70 10 80 5" stroke="#34d399" strokeWidth="4" fill="none" />
        </svg>
      </div>

      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl border-2 border-emerald-300/80 shadow-2xl shadow-emerald-950/10 p-6 sm:p-10 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold border border-emerald-300 mb-4">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Khoa học tự nhiên 7 • Chương trình GDPT 2018
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2">
          BIO LAB 7
        </h1>
        <h2 className="text-xl sm:text-2xl font-extrabold text-emerald-700 mb-4">
          BÍ MẬT HƠI THỞ CỦA HẠT
        </h2>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-6">
          "Bạn đã sẵn sàng khám phá xem một hạt đậu nhỏ bé đang <span className="font-bold text-emerald-700">‘thở’</span> như thế nào chưa?"
        </p>

        {/* Quick learning highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left mb-8 max-w-lg mx-auto">
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold text-emerald-950">
              Tự tay lắp đặt thí nghiệm & đối chứng
            </span>
          </div>
          <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold text-teal-950">
              Nhìn thấy phân tử O₂ và CO₂ chuyển động
            </span>
          </div>
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-xs font-semibold text-amber-950">
              Thám tử phá án 6 thí nghiệm hỏng
            </span>
          </div>
        </div>

        {/* Saved progress resume prompt if available */}
        {hasSavedProgress && savedStage > 0 && (
          <div className="mb-6 p-4 bg-teal-50 rounded-2xl border-2 border-teal-300 text-left flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Tiến trình đã lưu</p>
              <p className="text-sm font-semibold text-slate-800">
                {name || 'Học sinh'} • Đang ở <span className="text-teal-700 font-bold">Màn {savedStage}</span> ({savedScore}/100 điểm)
              </p>
            </div>
            <button
              onClick={() => {
                sound.playSuccess();
                onResume();
              }}
              className="w-full sm:w-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Tiếp tục bài đang học
            </button>
          </div>
        )}

        {/* Form: Name & Class */}
        <form onSubmit={handleStartNew} className="max-w-md mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="sm:col-span-2">
              <label htmlFor="student-name-input" className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên học sinh <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-emerald-300/80 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white text-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor="student-class-input" className="block text-xs font-bold text-slate-700 mb-1">
                Lớp
              </label>
              <input
                id="student-class-input"
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="7A1"
                className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-emerald-300/80 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white text-sm transition-all text-center"
              />
            </div>
          </div>

          {error && <p className="text-xs font-bold text-rose-600 text-left animate-bounce">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg shadow-emerald-700/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            🌱 BẮT ĐẦU KHÁM PHÁ
          </button>
        </form>

        <p className="mt-4 text-[11px] text-slate-600">
          * Tiến trình làm bài sẽ được tự động lưu trên thiết bị của em
        </p>
      </div>
    </div>
  );
};
