import React, { useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface Stage1PrepProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

interface StepItem {
  id: number;
  correctIndex: number;
  title: string;
  desc: string;
  iconSvg: React.ReactNode;
}

const INITIAL_STEPS: StepItem[] = [
  {
    id: 3,
    correctIndex: 2,
    title: 'Ngâm hạt trong nước ấm',
    desc: 'Ngâm hạt đậu khoảng 4–6 giờ (nước ấm 35–40°C) để đánh thức phôi hạt hút no nước.',
    iconSvg: (
      <svg viewBox="0 0 64 64" className="w-12 h-12">
        <path d="M12 20 L16 54 Q18 58 32 58 Q46 58 48 54 L52 20 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
        <ellipse cx="32" cy="20" rx="20" ry="6" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
        <path d="M15 32 Q32 36 49 32" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <ellipse cx="28" cy="42" rx="7" ry="5" fill="#ca8a04" transform="rotate(-15 28 42)" />
        <ellipse cx="38" cy="45" rx="7" ry="5" fill="#ca8a04" transform="rotate(25 38 45)" />
        {/* Steam */}
        <path d="M26 14 Q28 8 26 4" stroke="#93c5fd" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M38 14 Q40 8 38 4" stroke="#93c5fd" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 1,
    correctIndex: 0,
    title: 'Lựa chọn hạt đậu chất lượng',
    desc: 'Chọn những hạt đậu to tròn, chắc mẩy, nguyên vẹn, không bị sâu mọt hay nứt vỡ.',
    iconSvg: (
      <svg viewBox="0 0 64 64" className="w-12 h-12">
        <circle cx="32" cy="32" r="28" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
        <ellipse cx="30" cy="32" rx="14" ry="10" fill="#15803d" transform="rotate(-20 30 32)" />
        <ellipse cx="33" cy="30" rx="3" ry="1.5" fill="#fef08a" transform="rotate(-20 33 30)" />
        {/* Magnifier */}
        <circle cx="40" cy="26" r="9" fill="#e0f2fe" fillOpacity="0.4" stroke="#0284c7" strokeWidth="2.5" />
        <line x1="47" y1="33" x2="56" y2="42" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 5,
    correctIndex: 4,
    title: 'Ủ hạt ở điều kiện thích hợp',
    desc: 'Đặt đĩa hạt ở nơi ấm áp (khoảng 25–30°C), thoáng khí, tránh ánh nắng gắt trực tiếp.',
    iconSvg: (
      <svg viewBox="0 0 64 64" className="w-12 h-12">
        <rect x="12" y="14" width="40" height="40" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
        {/* Thermometer */}
        <path d="M24 24 L24 38 A6 6 0 1 0 28 38 L28 24 Z" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
        <circle cx="26" cy="42" r="4" fill="#dc2626" />
        {/* Warm sun rays */}
        <circle cx="42" cy="26" r="6" fill="#f59e0b" />
        <line x1="42" y1="16" x2="42" y2="18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="20" x2="52" y2="18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="52" y1="26" x2="54" y2="26" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 2,
    correctIndex: 1,
    title: 'Rửa sạch hạt với nước',
    desc: 'Loại bỏ bụi bẩn và các vi sinh vật nấm mốc bám trên bề mặt vỏ hạt.',
    iconSvg: (
      <svg viewBox="0 0 64 64" className="w-12 h-12">
        {/* Faucet */}
        <path d="M16 12 L34 12 L34 22" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        {/* Water drops */}
        <path d="M34 26 C34 26 31 32 31 34 C31 36 32.5 37 34 37 C35.5 37 37 36 37 34 C37 32 34 26 34 26 Z" fill="#38bdf8" />
        <path d="M30 40 C30 40 28 44 28 45.5 C28 47 29 48 30 48 C31 48 32 47 32 45.5 C32 44 30 40 30 40 Z" fill="#0284c7" />
        {/* Seeds below */}
        <ellipse cx="26" cy="52" rx="7" ry="5" fill="#16a34a" />
        <ellipse cx="38" cy="53" rx="7" ry="5" fill="#16a34a" />
      </svg>
    ),
  },
  {
    id: 6,
    correctIndex: 5,
    title: 'Thu nhận hạt đã nảy mầm',
    desc: 'Khi hạt đã nứt vỏ, nhú mầm non trắng dài khoảng 0.5–1 cm, đem dùng ngay cho thí nghiệm.',
    iconSvg: (
      <svg viewBox="0 0 64 64" className="w-12 h-12">
        <circle cx="32" cy="32" r="28" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
        {/* Sprouted bean */}
        <ellipse cx="28" cy="36" rx="13" ry="9" fill="#15803d" transform="rotate(-15 28 36)" />
        {/* Sprouted root tip */}
        <path d="M38 32 Q46 30 48 20 Q48 14 42 16" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <path d="M38 32 Q46 30 48 20 Q48 14 42 16" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
        {/* Small leaves */}
        <path d="M42 16 Q36 12 38 8 Q44 10 42 16" fill="#4ade80" />
      </svg>
    ),
  },
  {
    id: 4,
    correctIndex: 3,
    title: 'Đặt lên đĩa lót bông ẩm',
    desc: 'Trải đều hạt lên đĩa Petri đã lót lớp bông thấm nước hoặc khăn ẩm để cung cấp nước liên tục mà không gây úng.',
    iconSvg: (
      <svg viewBox="0 0 64 64" className="w-12 h-12">
        {/* Petri dish */}
        <ellipse cx="32" cy="46" rx="26" ry="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2.5" />
        {/* Moist cotton */}
        <ellipse cx="32" cy="44" rx="22" ry="7" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
        {/* Seeds on cotton */}
        <ellipse cx="24" cy="43" rx="5" ry="3.5" fill="#15803d" />
        <ellipse cx="33" cy="42" rx="5" ry="3.5" fill="#15803d" />
        <ellipse cx="40" cy="44" rx="5" ry="3.5" fill="#15803d" />
      </svg>
    ),
  },
];

export const Stage1Prep: React.FC<Stage1PrepProps> = ({
  onComplete,
  onNext,
  isCompleted,
}) => {
  const [steps, setSteps] = useState<StepItem[]>(INITIAL_STEPS);
  const [failCount, setFailCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [shake, setShake] = useState<boolean>(false);
  const [showStrongHint, setShowStrongHint] = useState<boolean>(false);
  const [sproutAnimation, setSproutAnimation] = useState<boolean>(isCompleted);

  // Move item up or down
  const moveStep = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setSteps(newSteps);
    setFeedback('');
  };

  const checkOrder = () => {
    // Check if every item is at its correct index (0 to 5)
    const isAllCorrect = steps.every((s, idx) => s.correctIndex === idx);

    if (isAllCorrect) {
      sound.playSuccess();
      setFeedback('🎉 Tuyệt vời! Em đã hoàn thành đúng quy trình chuẩn bị hạt nảy mầm đạt chuẩn khoa học.');
      setSproutAnimation(true);
      onComplete();
    } else {
      sound.playGentleWrong();
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setFailCount((prev) => prev + 1);

      // Pedagogical guidance
      if (steps[0].correctIndex !== 0) {
        setFeedback('💡 Gợi ý: Trước khi ngâm hay rửa, ta cần làm gì để đảm bảo tất cả các hạt đều có khả năng sống tốt?');
      } else if (steps[1].correctIndex !== 1) {
        setFeedback('💡 Gợi ý: Sau khi lựa chọn hạt, cần rửa sạch hạt trước hay ngâm ngay?');
      } else if (steps[2].correctIndex !== 2) {
        setFeedback('💡 Gợi ý: Hạt muốn bắt đầu nảy mầm cần được cung cấp nước ấm để đánh thức phôi trước khi đem ủ.');
      } else {
        setFeedback('💡 Gợi ý: Kiểm tra lại các bước sau khi ngâm hạt: đặt lên bông ẩm, ủ ấm, và cuối cùng mới thu nhận mầm nhé!');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Stage Header */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Màn 1 / 6
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          THỬ THÁCH 1 – ĐÁNH THỨC HẠT ĐẬU
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-1 leading-relaxed">
          Để thực hiện thí nghiệm hô hấp, chúng ta cần những hạt đậu đang nảy mầm khỏe mạnh.
          Em hãy sắp xếp 6 bước sau theo đúng trình tự từ đầu đến khi thu mầm nhé!
        </p>
      </div>

      {/* Main card list */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200/80 p-4 sm:p-6 shadow-xl shadow-emerald-950/5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Quy trình chuẩn bị mẫu vật sống
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
              6 bước
            </span>
          </div>
          <div className="text-xs text-emerald-700 font-medium">
            💡 Dùng nút mũi tên <span className="font-bold">▲ ▼</span> để đổi vị trí các thẻ
          </div>
        </div>

        {/* List of cards */}
        <div className={`space-y-3 ${shake ? 'animate-bounce' : ''}`}>
          {steps.map((step, idx) => {
            const isCorrectPosition = isCompleted || (steps.every((s, i) => s.correctIndex === i));
            return (
              <div
                key={step.id}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/60'
                    : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 shadow-xs'
                }`}
              >
                {/* Left: Step number & Icon */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                    {step.iconSvg}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Right: Controls (Up/Down) */}
                {!isCompleted && (
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveStep(idx, 'up')}
                      aria-label="Di chuyển bước lên trên"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 hover:text-emerald-800 transition-colors"
                      title="Chuyển lên trên"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={idx === steps.length - 1}
                      onClick={() => moveStep(idx, 'down')}
                      aria-label="Di chuyển bước xuống dưới"
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 hover:text-emerald-800 transition-colors"
                      title="Chuyển xuống dưới"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs self-end sm:self-center">
                    <CheckCircle className="w-5 h-5 fill-emerald-100" />
                    <span className="hidden sm:inline">Chính xác</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback alert box */}
        {feedback && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed border ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Strong hint button after 2 failures */}
        {failCount >= 2 && !isCompleted && (
          <div className="mt-3 text-center">
            <button
              onClick={() => {
                sound.playClick();
                setShowStrongHint(!showStrongHint);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-bold underline"
            >
              <HelpCircle className="w-4 h-4" />
              {showStrongHint ? 'Ẩn gợi ý mạnh hơn' : 'Xem gợi ý mạnh hơn từ Giáo sư'}
            </button>
            {showStrongHint && (
              <div className="mt-2 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 text-left max-w-lg mx-auto">
                🔍 <strong>Trình tự logic tự nhiên:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Lựa hạt tốt →</li>
                  <li>Rửa sạch bụi bẩn →</li>
                  <li>Ngâm nước ấm để đánh thức phôi →</li>
                  <li>Trải lên đĩa có bông ẩm →</li>
                  <li>Ủ nơi ấm thoáng khí →</li>
                  <li>Thu nhận hạt mầm nhú rễ trắng.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Sprout animation celebration when complete */}
        {sproutAnimation && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl border-2 border-emerald-400 text-center animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-2 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Soil line */}
                <ellipse cx="50" cy="80" rx="40" ry="10" fill="#78350f" opacity="0.4" />
                {/* Seed breaking */}
                <ellipse cx="44" cy="72" rx="14" ry="10" fill="#15803d" transform="rotate(-15 44 72)" />
                <path d="M42 66 L46 76" stroke="#ca8a04" strokeWidth="2" />
                {/* Sprout growing */}
                <path
                  d="M48 70 C52 50, 48 35, 52 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Leaves unfolding */}
                <path
                  d="M52 24 C44 14, 30 18, 38 28 C46 34, 52 25, 52 24 Z"
                  fill="#4ade80"
                  stroke="#15803d"
                  strokeWidth="1.5"
                />
                <path
                  d="M52 24 C60 14, 74 18, 66 28 C58 34, 52 25, 52 24 Z"
                  fill="#22c55e"
                  stroke="#15803d"
                  strokeWidth="1.5"
                />
                {/* Sparkles */}
                <circle cx="28" cy="20" r="2" fill="#facc15" className="animate-ping" />
                <circle cx="72" cy="25" r="2" fill="#facc15" className="animate-ping" />
              </svg>
            </div>
            <h4 className="text-lg font-black text-emerald-950 flex items-center justify-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Hạt đã thức giấc! Mầm non đang vươn mình hô hấp
            </h4>
            <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
              Những hạt đậu mầm khỏe mạnh đã sẵn sàng bước vào phòng thí nghiệm số để đo đạc hơi thở!
              <span className="font-bold block mt-1 text-emerald-900">+10 Điểm thao tác</span>
            </p>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {isCompleted ? '✓ Đã hoàn thành Màn 1 (+10 điểm)' : 'Hoàn thành đúng thứ tự để mở khóa Màn 2'}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isCompleted ? (
              <button
                onClick={checkOrder}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Kiểm tra thứ tự
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  onNext();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
              >
                Tiếp tục: Màn 2 – Lắp đặt thí nghiệm
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
