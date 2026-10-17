import React from 'react';
import { Volume2, VolumeX, Award, RotateCcw, FileText } from 'lucide-react';
import { StageId } from '../types';
import { sound } from '../utils/sound';

interface HeaderProps {
  currentStage: StageId;
  totalScore: number;
  studentName: string;
  studentClass: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateStage: (stage: StageId) => void;
  onReset: () => void;
  onViewReport: () => void;
  maxUnlockedStage: StageId;
  onOpenTeacherModal: () => void;
  lessonTitle?: string;
  appSubtitle?: string;
}

const STAGES = [
  { id: 1 as StageId, label: 'Chuẩn bị', icon: '🌱' },
  { id: 2 as StageId, label: 'Lắp đặt', icon: '🧪' },
  { id: 3 as StageId, label: 'Dự đoán', icon: '🔮' },
  { id: 4 as StageId, label: 'Quan sát', icon: '🔬' },
  { id: 5 as StageId, label: 'Điều tra', icon: '🕵️' },
  { id: 6 as StageId, label: 'Kết luận', icon: '🏆' },
];

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  totalScore,
  studentName,
  studentClass,
  soundEnabled,
  onToggleSound,
  onNavigateStage,
  onReset,
  onViewReport,
  maxUnlockedStage,
  onOpenTeacherModal,
  lessonTitle = 'Bài 27: Hô hấp ở thực vật',
  appSubtitle = 'Bí Mật Hơi Thở Của Hạt',
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-200 shadow-sm no-print">
      {/* Top row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 font-black text-lg">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-emerald-900 text-sm sm:text-base tracking-tight">
                BIO LAB 7
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                {lessonTitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{appSubtitle}</p>
          </div>
        </div>

        {/* Right tools: Student info, Score, Sound, Reset */}
        <div className="flex items-center gap-2 sm:gap-3">
          {studentName && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              <span className="text-emerald-600">👤 {studentName}</span>
              {studentClass && <span className="text-slate-400">| Lớp {studentClass}</span>}
            </div>
          )}

          {/* Score Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300/80 rounded-xl shadow-xs">
            <Award className="w-4 h-4 text-amber-600 fill-amber-500" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold text-amber-800">Điểm:</span>
              <span className="text-base font-black text-amber-900 tracking-tight">{totalScore}</span>
              <span className="text-[10px] text-amber-700 font-bold">/100</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Report Button */}
          {maxUnlockedStage >= 6 && (
            <button
              onClick={() => {
                sound.playClick();
                onViewReport();
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 hover:bg-teal-100 text-xs font-bold flex items-center gap-1 transition-all"
              title="Xem phiếu kết quả"
            >
              <FileText className="w-4 h-4 text-teal-600" />
              <span className="hidden sm:inline">Phiếu kết quả</span>
            </button>
          )}

          {/* Teacher Mode Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherModal();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Chế độ Giáo viên (Quản lý đề, xem điểm học sinh, tạo bài mới)"
          >
            <span>🔐</span>
            <span className="hidden sm:inline">Giáo viên</span>
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              sound.playClick();
              onReset();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
            title="Làm lại thí nghiệm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Stepper Bar (Stages 1 to 6) */}
      {currentStage > 0 && currentStage <= 6 && (
        <nav aria-label="Tiến trình bài thực hành" className="bg-emerald-50/70 border-t border-emerald-100 px-2 sm:px-6 py-1.5 overflow-x-auto scrollbar-none">
          <div className="max-w-5xl mx-auto flex items-center justify-between min-w-[500px]">
            {STAGES.map((st, idx) => {
              const isCurrent = currentStage === st.id;
              const isPassed = currentStage > st.id || maxUnlockedStage > st.id;
              const isLocked = st.id > maxUnlockedStage && st.id > currentStage;

              return (
                <React.Fragment key={st.id}>
                  <button
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        sound.playClick();
                        onNavigateStage(st.id);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20 scale-105'
                        : isPassed
                        ? 'bg-emerald-100/90 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className="text-sm">{st.icon}</span>
                    <span>
                      {idx + 1}. {st.label}
                    </span>
                    {isPassed && !isCurrent && <span className="text-emerald-700 text-[10px]">✓</span>}
                  </button>

                  {idx < STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                        currentStage > st.id ? 'bg-emerald-500' : 'bg-emerald-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
