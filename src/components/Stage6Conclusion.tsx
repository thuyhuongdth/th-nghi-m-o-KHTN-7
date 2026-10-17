import React, { useState } from 'react';
import { Award, ArrowRight, CheckCircle2, Sparkles, Utensils } from 'lucide-react';
import { sound } from '../utils/sound';

interface Stage6ConclusionProps {
  onComplete: () => void;
  onFinishLab: () => void;
  isCompleted: boolean;
  observations: {
    jarA_phenomenon: string;
    jarA_explanation: string;
    jarB_phenomenon: string;
    jarB_explanation: string;
  };
  onUpdateObservations: (obs: {
    jarA_phenomenon: string;
    jarA_explanation: string;
    jarB_phenomenon: string;
    jarB_explanation: string;
  }) => void;
  userConclusion: string;
  onUpdateConclusion: (conclusion: string) => void;
  onAwardConclusionScore: () => void;
  conclusionAwarded: boolean;
  foodGameCompleted: boolean;
  onAwardFoodScore: () => void;
}

const FOOD_STEPS_INITIAL = [
  { id: 3, order: 2, title: 'Ngâm hạt trong nước ấm', desc: 'Cho hạt hút no nước, kích hoạt enzyme mầm' },
  { id: 1, order: 0, title: 'Lựa chọn hạt mẩy', desc: 'Chọn hạt đậu chắc tròn, loại bỏ hạt lép sâu mọt' },
  { id: 5, order: 4, title: 'Chế biến món ăn bổ dưỡng', desc: 'Nấu súp, làm sữa hạt, xào giá đỗ thơm ngon' },
  { id: 2, order: 1, title: 'Rửa sạch hạt', desc: 'Rửa trôi bụi bẩn và nấm mốc bám ngoài vỏ' },
  { id: 4, order: 3, title: 'Để ráo và ủ ẩm', desc: 'Tạo độ ẩm và thoáng khí cho hạt nhú mầm non' },
];

export const Stage6Conclusion: React.FC<Stage6ConclusionProps> = ({
  onFinishLab,
  observations,
  onUpdateObservations,
  userConclusion,
  onUpdateConclusion,
  onAwardConclusionScore,
  conclusionAwarded,
  foodGameCompleted,
  onAwardFoodScore,
}) => {
  const [obs, setObs] = useState(observations);
  const [conclusionText, setConclusionText] = useState(userConclusion || '');
  const [conclusionFeedback, setConclusionFeedback] = useState<{ text: string; passed: boolean } | null>(
    conclusionAwarded ? { text: '🎉 Kết luận rất chính xác và đầy đủ tinh thần khoa học!', passed: true } : null
  );

  // Food mini-game state
  const [foodSteps, setFoodSteps] = useState(FOOD_STEPS_INITIAL);
  const [foodSolved, setFoodSolved] = useState(foodGameCompleted);
  const [foodFeedback, setFoodFeedback] = useState('');
  const [q1Answer, setQ1Answer] = useState<string>('');
  const [q2Answer, setQ2Answer] = useState<string>('');
  const [questionsChecked, setQuestionsChecked] = useState<boolean>(foodGameCompleted);

  const handleUpdateObs = (key: keyof typeof obs, val: string) => {
    const updated = { ...obs, [key]: val };
    setObs(updated);
    onUpdateObservations(updated);
  };

  // Evaluate conclusion using smart keyword criteria
  const handleEvaluateConclusion = () => {
    sound.playClick();
    const raw = conclusionText.toLowerCase();

    // Check key concepts:
    const hasSeed = raw.includes('hạt') || raw.includes('mầm') || raw.includes('đậu');
    const hasResp = raw.includes('hô hấp') || raw.includes('thở') || raw.includes('trao đổi khí') || raw.includes('sống');
    const hasCO2 = raw.includes('co2') || raw.includes('co₂') || raw.includes('carbon dioxide') || raw.includes('cacbonic') || raw.includes('cacbon đioxit');
    const hasRelease = raw.includes('thải') || raw.includes('giải phóng') || raw.includes('tạo ra') || raw.includes('sinh ra') || raw.includes('sinh') || raw.includes('ra');

    if (!raw.trim()) {
      sound.playGentleWrong();
      setConclusionFeedback({
        text: 'Em hãy gõ kết luận của mình vào ô trống trước khi gửi nhé!',
        passed: false,
      });
      return;
    }

    if (!hasSeed) {
      sound.playGentleWrong();
      setConclusionFeedback({
        text: '💡 Gợi ý: Em hãy nhắc đến đối tượng sống trong thí nghiệm (hạt đang nảy mầm) nhé!',
        passed: false,
      });
      return;
    }

    if (!hasResp) {
      sound.playGentleWrong();
      setConclusionFeedback({
        text: '💡 Gợi ý: Hạt đậu đang nảy mầm thực hiện quá trình sống quan trọng nào được nghiên cứu trong bài 27?',
        passed: false,
      });
      return;
    }

    if (!hasCO2) {
      sound.playGentleWrong();
      setConclusionFeedback({
        text: '💡 Gợi ý: Em đã xác định đúng hạt thực hiện hô hấp. Hãy cho biết chất khí nào được sinh ra làm đục cốc nước vôi trong?',
        passed: false,
      });
      return;
    }

    if (!hasRelease) {
      sound.playGentleWrong();
      setConclusionFeedback({
        text: '💡 Gợi ý: Khí carbon dioxide (CO₂) được hạt lấy vào hay thải ra ngoài môi trường?',
        passed: false,
      });
      return;
    }

    // Success!
    sound.playSuccess();
    setConclusionFeedback({
      text: '🎉 Xuất sắc! Kết luận của em hoàn toàn chính xác: Hạt đang nảy mầm thực hiện quá trình hô hấp, sử dụng oxygen và thải khí carbon dioxide (CO₂) ra môi trường! (+10 Điểm kết luận)',
      passed: true,
    });
    onUpdateConclusion(conclusionText);
    onAwardConclusionScore();
  };

  // Move food step
  const moveFoodStep = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newSteps = [...foodSteps];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[target];
    newSteps[target] = temp;
    setFoodSteps(newSteps);
  };

  const checkFoodOrder = () => {
    const isOrdered = foodSteps.every((s, idx) => s.order === idx);
    if (isOrdered) {
      sound.playSuccess();
      setFoodSolved(true);
      setFoodFeedback('🎉 Đúng rồi! Quy trình chuẩn từ chọn hạt đến chế biến món ăn ngon lành.');
    } else {
      sound.playGentleWrong();
      setFoodFeedback('💡 Hãy chú ý: Trước khi ngâm và ủ mầm, ta phải lựa hạt tốt và rửa sạch hạt trước nhé!');
    }
  };

  const handleFinishAppQuestions = () => {
    if (!q1Answer || !q2Answer) {
      sound.playGentleWrong();
      alert('Em hãy chọn câu trả lời cho cả hai câu hỏi vận dụng thực tế nhé!');
      return;
    }
    sound.playSuccess();
    setQuestionsChecked(true);
    onAwardFoodScore();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Màn 6 / 6
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          THỬ THÁCH CUỐI – GIẢI MÃ HƠI THỞ CỦA HẠT
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mt-1 leading-relaxed">
          Tổng hợp bằng chứng khoa học, tự tay viết kết luận và khám phá ứng dụng thực tế từ hạt đậu vào đời sống hàng ngày!
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Observation Data Table */}
        <div className="bg-white rounded-3xl border-2 border-emerald-200/80 p-5 sm:p-7 shadow-xl shadow-emerald-950/5">
          <h3 className="font-black text-base text-slate-900 mb-3 flex items-center gap-2">
            📋 1. BẢNG KẾT QUẢ THÍ NGHIỆM
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-emerald-100/70 text-emerald-950 border-b border-emerald-200">
                  <th className="p-3 font-extrabold w-36">Hệ thí nghiệm</th>
                  <th className="p-3 font-extrabold">Hiện tượng ở cốc nước vôi trong</th>
                  <th className="p-3 font-extrabold">Giải thích hiện tượng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Chuông A */}
                <tr className="hover:bg-emerald-50/30">
                  <td className="p-3 font-bold text-emerald-950">
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black mr-1">A</span>
                    Có hạt nảy mầm
                  </td>
                  <td className="p-3">
                    <select
                      value={obs.jarA_phenomenon}
                      onChange={(e) => handleUpdateObs('jarA_phenomenon', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="">-- Chọn hiện tượng --</option>
                      <option value="turbid">Nước vôi vẩn đục màu trắng sữa, có màng váng mỏng</option>
                      <option value="clear">Nước vôi trong suốt, không đổi màu</option>
                      <option value="boil">Nước vôi sôi sủi bọt khí</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={obs.jarA_explanation}
                      onChange={(e) => handleUpdateObs('jarA_explanation', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-600"
                    >
                      <option value="">-- Chọn giải thích --</option>
                      <option value="resp_co2">Hạt nảy mầm hô hấp thải khí CO₂, khí CO₂ phản ứng làm đục nước vôi trong</option>
                      <option value="no_resp">Hạt không hô hấp nên không thải khí</option>
                      <option value="absorb_water">Hạt hút hết khí oxygen trong nước</option>
                    </select>
                  </td>
                </tr>

                {/* Chuông B */}
                <tr className="hover:bg-teal-50/30">
                  <td className="p-3 font-bold text-teal-950">
                    <span className="inline-block px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-black mr-1">B</span>
                    Hệ đối chứng (không hạt)
                  </td>
                  <td className="p-3">
                    <select
                      value={obs.jarB_phenomenon}
                      onChange={(e) => handleUpdateObs('jarB_phenomenon', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-teal-600"
                    >
                      <option value="">-- Chọn hiện tượng --</option>
                      <option value="clear">Nước vôi hầu như không thay đổi, vẫn trong suốt</option>
                      <option value="turbid">Nước vôi vẩn đục trắng sữa như chuông A</option>
                      <option value="color_change">Chuyển sang màu vàng chanh</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={obs.jarB_explanation}
                      onChange={(e) => handleUpdateObs('jarB_explanation', e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-teal-600"
                    >
                      <option value="">-- Chọn giải thích --</option>
                      <option value="no_source">Không có hạt nảy mầm, lượng CO₂ trong không khí rất ít không đủ làm đục</option>
                      <option value="no_co2">Nước vôi tự tiêu biến khí CO₂</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Student Conclusion with intelligent evaluation */}
        <div className="bg-white rounded-3xl border-2 border-emerald-200/80 p-5 sm:p-7 shadow-xl shadow-emerald-950/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              📝 2. KẾT LUẬN CỦA EM
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
              +10 Điểm
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Dựa vào kết quả quan sát thí nghiệm, em hãy rút ra kết luận khoa học về quá trình hô hấp ở hạt nảy mầm.
            <span className="italic block mt-0.5 text-emerald-700">
              (Gợi ý: Nhắc đến hạt đang nảy mầm, quá trình hô hấp, và khí carbon dioxide CO₂ được giải phóng)
            </span>
          </p>

          <textarea
            rows={3}
            value={conclusionText}
            onChange={(e) => setConclusionText(e.target.value)}
            placeholder="Gõ kết luận của em vào đây (Ví dụ: Hạt đang nảy mầm có hoạt động hô hấp và giải phóng ra khí carbon dioxide...)"
            className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all leading-relaxed"
          />

          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleEvaluateConclusion}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Chấm điểm kết luận của em
            </button>
            <span className="text-[11px] text-slate-600">
              * Hệ thống chấm thông minh nhận diện từ khóa khoa học linh hoạt
            </span>
          </div>

          {conclusionFeedback && (
            <div
              className={`mt-4 p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed border ${
                conclusionFeedback.passed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {conclusionFeedback.text}
            </div>
          )}
        </div>

        {/* Section 3: Practical Food Mini-game */}
        <div className="bg-white rounded-3xl border-2 border-amber-200/80 p-5 sm:p-7 shadow-xl shadow-amber-950/5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-black text-base text-slate-900">
                  🍽️ 3. VẬN DỤNG THỰC TẾ: TỪ HẠT ĐẬU ĐẾN BỮA ĂN
                </h3>
                <p className="text-xs text-slate-500">
                  Hiểu biết về hô hấp và nảy mầm giúp ích gì trong đời sống và ẩm thực?
                </p>
              </div>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
              +5 Điểm
            </span>
          </div>

          {/* Sub-part A: Order the culinary steps */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
              A. Sắp xếp các bước chuẩn bị hạt đậu để làm giá đỗ hoặc nấu ăn:
            </p>

            <div className="space-y-2">
              {foodSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                  {!foodSolved && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        disabled={idx === 0}
                        onClick={() => moveFoodStep(idx, 'up')}
                        aria-label="Di chuyển bước ẩm thực lên trên"
                        className="p-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-xs text-slate-700 font-bold"
                      >
                        ▲
                      </button>
                      <button
                        disabled={idx === foodSteps.length - 1}
                        onClick={() => moveFoodStep(idx, 'down')}
                        aria-label="Di chuyển bước ẩm thực xuống dưới"
                        className="p-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-30 text-xs text-slate-700 font-bold"
                      >
                        ▼
                      </button>
                    </div>
                  )}
                  {foodSolved && (
                    <span className="text-xs font-bold text-emerald-600">✓ Đúng</span>
                  )}
                </div>
              ))}
            </div>

            {!foodSolved && (
              <div className="mt-3">
                <button
                  onClick={checkFoodOrder}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Kiểm tra thứ tự các bước
                </button>
              </div>
            )}
            {foodFeedback && (
              <p className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {foodFeedback}
              </p>
            )}
          </div>

          {/* Sub-part B: 2 Practical Questions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-700">
              B. Trả lời 2 câu hỏi khoa học ứng dụng thực tế:
            </p>

            {/* Question 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-bold text-slate-900 mb-2">
                1. Vì sao nhiều loại hạt khô thường được ngâm nước ấm trước khi đem nấu hoặc gieo giống?
              </p>
              <div className="space-y-1.5">
                {[
                  { id: 'q1_a', text: 'Để hạt hút đủ nước, kích hoạt enzyme hô hấp và thúc đẩy mầm chuyển hóa chất dinh dưỡng.' },
                  { id: 'q1_b', text: 'Để hạt đổi sang màu đỏ cho đẹp mắt.' },
                  { id: 'q1_c', text: 'Để hạt nặng hơn khi đem bán.' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                      q1Answer === opt.id ? 'border-amber-500 bg-amber-50 font-bold text-amber-950' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q1_food"
                      checked={q1Answer === opt.id}
                      onChange={() => setQ1Answer(opt.id)}
                      className="mt-0.5 text-amber-600"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs sm:text-sm font-bold text-slate-900 mb-2">
                2. Vì sao khi làm giá đỗ hoặc ngâm giống, người ta không ngâm chìm ngập hạt trong nước suốt nhiều ngày?
              </p>
              <div className="space-y-1.5">
                {[
                  { id: 'q2_a', text: 'Vì ngập nước lâu hạt bị thiếu oxygen để hô hấp, dễ thối rữa và chết mầm.' },
                  { id: 'q2_b', text: 'Vì hạt sẽ bơi mất trong nước.' },
                  { id: 'q2_c', text: 'Vì làm giá đỗ không bao giờ được chạm vào nước.' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                      q2Answer === opt.id ? 'border-amber-500 bg-amber-50 font-bold text-amber-950' : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="q2_food"
                      checked={q2Answer === opt.id}
                      onChange={() => setQ2Answer(opt.id)}
                      className="mt-0.5 text-amber-600"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {!questionsChecked ? (
              <button
                onClick={handleFinishAppQuestions}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Xác nhận câu trả lời vận dụng
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Em đã giải thích chính xác 2 hiện tượng thực tiễn! (+5 Điểm vận dụng)
              </div>
            )}
          </div>
        </div>

        {/* Footer: Finish Lab Button */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="text-xs text-slate-600">
            {conclusionAwarded && questionsChecked ? (
              <span className="font-bold text-emerald-700">
                🎉 Em đã hoàn tất toàn bộ nội dung của phòng thí nghiệm Bio Lab 7!
              </span>
            ) : (
              <span>Hoàn thành bảng dữ liệu, chấm kết luận và trả lời câu hỏi vận dụng.</span>
            )}
          </div>

          <button
            onClick={() => {
              sound.playFanfare();
              onFinishLab();
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-600 hover:via-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-700/25 transition-all transform hover:scale-[1.03] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            🏆 HOÀN THÀNH & XEM HUY HIỆU KHOA HỌC
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
