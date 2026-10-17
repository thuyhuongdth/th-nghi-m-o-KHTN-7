import React from 'react';
import { RotateCcw, UserCheck, UserPlus, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestartSameStudent: () => void;
  onResetNewStudent: () => void;
  studentName: string;
  studentClass: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onRestartSameStudent,
  onResetNewStudent,
  studentName,
  studentClass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border-2 border-emerald-400 max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-slate-900">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <RotateCcw className="w-7 h-7" />
          </div>
          <h3 className="font-black text-xl text-slate-900">
            Thực hiện lại bài thực hành?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs mx-auto">
            Toàn bộ điểm số, dụng cụ đã lắp và câu trả lời sẽ được đặt lại từ đầu để em rèn luyện lại.
          </p>
        </div>

        {/* Current Student Badge if available */}
        {studentName && (
          <div className="mb-5 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-center">
            <span className="text-slate-500">Học sinh hiện tại: </span>
            <span className="font-extrabold text-emerald-950">{studentName}</span>
            {studentClass && (
              <span className="font-bold text-emerald-700"> (Lớp {studentClass})</span>
            )}
          </div>
        )}

        {/* Action Options */}
        <div className="space-y-3">
          {/* Option 1: Restart keeping current student name */}
          {studentName ? (
            <button
              onClick={() => {
                sound.playSuccess();
                onRestartSameStudent();
              }}
              className="w-full p-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              🌱 Làm lại ngay từ Màn 1 (Giữ tên & lớp)
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playSuccess();
                onRestartSameStudent();
              }}
              className="w-full p-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Bắt đầu lượt thực hành mới
            </button>
          )}

          {/* Option 2: Full reset for a new student */}
          <button
            onClick={() => {
              sound.playClick();
              onResetNewStudent();
            }}
            className="w-full p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            👤 Đổi học sinh mới (Về màn hình chào)
          </button>

          {/* Option 3: Cancel */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Hủy, tiếp tục bài đang làm
          </button>
        </div>
      </div>
    </div>
  );
};
