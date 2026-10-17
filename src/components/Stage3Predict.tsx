import React, { useState } from 'react';
import { Lock, ArrowRight, HelpCircle, CheckCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface Stage3PredictProps {
  initialPredictions: {
    jarA: string;
    jarB: string;
    reason: string;
    locked: boolean;
  };
  onLockPrediction: (preds: { jarA: string; jarB: string; reason: string }) => void;
  onNext: () => void;
  questionA?: string;
  optionsA?: { id: string; label: string }[];
  questionB?: string;
  optionsB?: { id: string; label: string }[];
}

const DEFAULT_OPTIONS_A = [
  { id: 'A_no_change', label: 'Hầu như không thay đổi (nước vôi vẫn trong suốt)' },
  { id: 'A_turbid', label: 'Xuất hiện vẩn đục màu trắng sữa' },
  { id: 'A_green', label: 'Chuyển sang màu xanh lá cây đậm' },
  { id: 'A_disappear', label: 'Nước vôi bốc hơi biến mất hoàn toàn' },
];

const DEFAULT_OPTIONS_B = [
  { id: 'B_no_change', label: 'Hầu như không thay đổi (vẫn giữ độ trong suốt)' },
  { id: 'B_turbid', label: 'Xuất hiện vẩn đục trắng nhiều như chuông A' },
  { id: 'B_yellow', label: 'Chuyển sang màu vàng chanh' },
  { id: 'B_boil', label: 'Sôi sủi bọt khí liên tục' },
];

export const Stage3Predict: React.FC<Stage3PredictProps> = ({
  initialPredictions,
  onLockPrediction,
  onNext,
  questionA = 'Câu hỏi 1: Sau một khoảng thời gian, nước vôi ở chuông A (chứa hạt nảy mầm) có thể xảy ra hiện tượng gì?',
  optionsA,
  questionB = 'Câu hỏi 2: Em dự đoán điều gì xảy ra với nước vôi ở chuông B (hệ đối chứng không có hạt nảy mầm)?',
  optionsB,
}) => {
  const activeOptionsA = optionsA && optionsA.length > 0 ? optionsA : DEFAULT_OPTIONS_A;
  const activeOptionsB = optionsB && optionsB.length > 0 ? optionsB : DEFAULT_OPTIONS_B;
  const [jarA, setJarA] = useState<string>(initialPredictions.jarA || '');
  const [jarB, setJarB] = useState<string>(initialPredictions.jarB || '');
  const [reason, setReason] = useState<string>(initialPredictions.reason || '');
  const [isLocked, setIsLocked] = useState<boolean>(initialPredictions.locked);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLock = () => {
    if (!jarA || !jarB) {
      sound.playGentleWrong();
      setErrorMsg('Em hãy chọn dự đoán cho cả Chuông A và Chuông B trước khi khóa nhé!');
      return;
    }
    setErrorMsg('');
    sound.playSuccess();
    setIsLocked(true);
    onLockPrediction({ jarA, jarB, reason });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Stage Header */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Màn 3 / 6
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          THỬ THÁCH 3 – EM DỰ ĐOÁN ĐIỀU GÌ?
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-1 leading-relaxed">
          Mọi nhà khoa học vĩ đại đều bắt đầu bằng một giả thuyết.
          Em dự đoán điều gì sẽ xảy ra bên trong hai chuông sau một khoảng thời gian?
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-emerald-200/80 p-5 sm:p-8 shadow-xl shadow-emerald-950/5 space-y-6">
        {/* Question 1: Jar A */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              A
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-emerald-950">
              {questionA}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeOptionsA.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  jarA === opt.id
                    ? 'border-emerald-600 bg-emerald-100/70 font-bold text-emerald-950 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50 text-slate-700 font-medium'
                } ${isLocked ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                <input
                  type="radio"
                  name="predict_jar_a"
                  disabled={isLocked}
                  checked={jarA === opt.id}
                  onChange={() => {
                    sound.playClick();
                    setJarA(opt.id);
                  }}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs sm:text-sm leading-snug">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Question 2: Jar B */}
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 border border-teal-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
              B
            </span>
            <h3 className="font-extrabold text-sm sm:text-base text-teal-950">
              {questionB}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeOptionsB.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  jarB === opt.id
                    ? 'border-teal-600 bg-teal-100/70 font-bold text-teal-950 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 text-slate-700 font-medium'
                } ${isLocked ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                <input
                  type="radio"
                  name="predict_jar_b"
                  disabled={isLocked}
                  checked={jarB === opt.id}
                  onChange={() => {
                    sound.playClick();
                    setJarB(opt.id);
                  }}
                  className="mt-1 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs sm:text-sm leading-snug">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Question 3: Why (Rationale) */}
        <div>
          <label htmlFor="predict-reason-input" className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            Lí do em đưa ra dự đoán trên (không bắt buộc nhưng giúp nhật kí đầy đủ hơn):
          </label>
          <input
            id="predict-reason-input"
            type="text"
            disabled={isLocked}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Em nghĩ hạt đang nảy mầm hô hấp thải ra khí làm biến đổi nước vôi..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-80"
          />
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-rose-600 animate-bounce">{errorMsg}</p>
        )}

        {/* Locked status notification */}
        {isLocked && (
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-center gap-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-sm text-emerald-950">
                🔒 Dự đoán đã được ghi nhận vào Nhật kí nhà khoa học!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Các phương án đã được khóa cố định. Hãy bấm tiếp tục để bước vào Màn 4 và xem thí nghiệm thực tế diễn ra như thế nào nhé!
                <span className="font-bold ml-1 text-emerald-950">(+10 Điểm dự đoán)</span>
              </p>
            </div>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {isLocked
              ? 'Nhà khoa học luôn tôn trọng dự đoán ban đầu trước khi đối chiếu bằng chứng.'
              : 'Sau khi bấm Khóa dự đoán, em sẽ không thể thay đổi câu trả lời.'}
          </p>

          {!isLocked ? (
            <button
              onClick={handleLock}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-amber-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              🔒 KHÓA DỰ ĐOÁN
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onNext();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              Tiếp tục: Màn 4 – Chạy thí nghiệm 60 phút
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
