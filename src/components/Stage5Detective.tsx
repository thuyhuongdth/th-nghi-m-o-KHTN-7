import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sliders, ShieldAlert, Award } from 'lucide-react';
import { sound } from '../utils/sound';

import { DetectiveCaseConfig } from '../types';

interface Stage5DetectiveProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
  detectiveAnswers: Record<number, { fixed: boolean; reason: string; isCorrect: boolean }>;
  onUpdateDetectiveAnswer: (caseId: number, data: { fixed: boolean; reason: string; isCorrect: boolean }) => void;
  customCases?: DetectiveCaseConfig[];
}

interface DetectiveQuestion {
  id: number;
  title: string;
  scenarioDesc: string;
  flawType: 'fatal' | 'subtle';
  svgIllustration: React.ReactNode;
  correctAction: 'fix' | 'accept';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  pedagogicalHint: string;
}

const CASES: DetectiveQuestion[] = [
  {
    id: 1,
    title: 'Vụ án 1: Những hạt đậu ngủ say',
    scenarioDesc: 'Nhóm bạn Nam dùng hạt đậu khô chưa ngâm ủ để thay thế cho hạt đang nảy mầm trong Chuông A.',
    flawType: 'fatal',
    correctAction: 'fix',
    svgIllustration: (
      <svg viewBox="0 0 100 80" className="w-full h-28">
        <rect x="20" y="55" width="60" height="15" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
        <ellipse cx="40" cy="50" rx="9" ry="6" fill="#92400e" />
        <ellipse cx="60" cy="50" rx="9" ry="6" fill="#92400e" />
        {/* Sleeping zzz */}
        <text x="68" y="35" fill="#64748b" fontSize="10" fontWeight="bold">z</text>
        <text x="74" y="27" fill="#64748b" fontSize="13" fontWeight="bold">Z</text>
        <text x="82" y="18" fill="#64748b" fontSize="16" fontWeight="bold">Z</text>
      </svg>
    ),
    options: [
      {
        id: 'c1_correct',
        text: 'Hạt khô có cường độ hô hấp cực kì yếu, lượng CO₂ giải phóng rất ít không đủ làm đục nước vôi trong thời gian ngắn.',
        isCorrect: true,
        explanation: 'Chính xác! Hạt khô đang ở trạng thái ngủ nghỉ, lượng nước rất thấp nên hô hấp tế bào hầu như ngừng trệ.',
      },
      {
        id: 'c1_wrong1',
        text: 'Hạt khô sẽ hấp thụ hết nước vôi trong làm cốc nước vôi bị cạn sạch.',
        isCorrect: false,
        explanation: 'Hạt để trong đĩa riêng, không tiếp xúc trực tiếp với cốc nước vôi nên không thể hút nước trong cốc.',
      },
      {
        id: 'c1_wrong2',
        text: 'Hạt khô giải phóng ra khí oxygen thay vì carbon dioxide.',
        isCorrect: false,
        explanation: 'Hạt không có diệp lục và không quang hợp để thải oxygen.',
      },
    ],
    pedagogicalHint: 'Hạt khô chứa rất ít nước, liệu các phản ứng sống và hô hấp trong phôi có hoạt động mạnh mẽ không?',
  },
  {
    id: 2,
    title: 'Vụ án 2: Khe hở vô hình',
    scenarioDesc: 'Khi úp chuông thủy tinh A, bạn Lan sơ ý để chân chuông bị vênh một khoảng hở 1 cm so với mặt đế cao su.',
    flawType: 'fatal',
    correctAction: 'fix',
    svgIllustration: (
      <svg viewBox="0 0 100 80" className="w-full h-28">
        <path d="M25 65 L25 35 Q25 15 50 15 Q75 15 75 35 L75 55" fill="none" stroke="#0d9488" strokeWidth="2.5" />
        <line x1="15" y1="70" x2="85" y2="70" stroke="#1e293b" strokeWidth="4" />
        {/* Gap arrow */}
        <path d="M75 57 L75 68" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow)" />
        <text x="45" y="66" fill="#ef4444" fontSize="8" fontWeight="bold">KHE HỞ KHÍ!</text>
      </svg>
    ),
    options: [
      {
        id: 'c2_correct',
        text: 'Khí CO₂ sinh ra sẽ bị thất thoát ra ngoài môi trường và không khí bên ngoài tràn vào làm sai lệch kết quả.',
        isCorrect: true,
        explanation: 'Đúng rồi! Chuông phải đậy kín để tích lũy lượng CO₂ đủ lớn làm biến đổi nước vôi.',
      },
      {
        id: 'c2_wrong1',
        text: 'Ánh sáng sẽ lọt vào chuông làm hạt đậu nở hoa sớm.',
        isCorrect: false,
        explanation: 'Chuông thủy tinh vốn dĩ trong suốt nên ánh sáng luôn đi qua được.',
      },
      {
        id: 'c2_wrong2',
        text: 'Nước vôi sẽ tràn ra khỏi cốc khi có khe hở.',
        isCorrect: false,
        explanation: 'Khe hở không khí không làm tràn nước trong cốc.',
      },
    ],
    pedagogicalHint: 'Đậy kín chuông giúp chúng ta kiểm soát điều gì đối với thể tích khí bên trong?',
  },
  {
    id: 3,
    title: 'Vụ án 3: Hai đối thủ giống hệt nhau',
    scenarioDesc: 'Nhóm bạn Minh muốn thí nghiệm chắc chắn hơn nên đã đặt hạt đậu nảy mầm vào CẢ HAI CHUÔNG A VÀ B.',
    flawType: 'fatal',
    correctAction: 'fix',
    svgIllustration: (
      <svg viewBox="0 0 100 80" className="w-full h-28">
        <rect x="15" y="25" width="30" height="40" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
        <rect x="55" y="25" width="30" height="40" rx="4" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
        <text x="25" y="48" fontSize="16">🌱</text>
        <text x="65" y="48" fontSize="16">🌱</text>
        <text x="26" y="20" fill="#047857" fontSize="9" fontWeight="bold">Chuông A</text>
        <text x="66" y="20" fill="#047857" fontSize="9" fontWeight="bold">Chuông B</text>
      </svg>
    ),
    options: [
      {
        id: 'c3_correct',
        text: 'Mất đi hệ đối chứng! Không còn căn cứ để chứng minh sự biến đổi nước vôi là do hạt đậu nảy mầm gây ra.',
        isCorrect: true,
        explanation: 'Xuất sắc! Nguyên tắc thí nghiệm khoa học là hệ đối chứng phải giữ nguyên mọi yếu tố và chỉ khác biệt ở duy nhất yếu tố cần nghiên cứu (hạt nảy mầm).',
      },
      {
        id: 'c3_wrong1',
        text: 'Đặt hạt ở cả hai chuông sẽ làm chuông thủy tinh bị nổ tung.',
        isCorrect: false,
        explanation: 'Áp suất khí trao đổi ở hạt rất nhỏ, không thể gây nổ.',
      },
      {
        id: 'c3_wrong2',
        text: 'Làm vậy sẽ tốn gấp đôi lượng nước vôi.',
        isCorrect: false,
        explanation: 'Đây chỉ là vấn đề dụng cụ, không phải bản chất phương pháp đối chứng khoa học.',
      },
    ],
    pedagogicalHint: 'Thí nghiệm đối chứng có còn khác thí nghiệm chính ở đúng một yếu tố quan trọng không?',
  },
  {
    id: 4,
    title: 'Vụ án 4: Cốc nước nhầm lẫn',
    scenarioDesc: 'Bạn Hoa vội vàng lấy nhầm cốc nước lọc thông thường thay vì cốc nước vôi trong Ca(OH)₂ đặt vào Chuông A.',
    flawType: 'fatal',
    correctAction: 'fix',
    svgIllustration: (
      <svg viewBox="0 0 100 80" className="w-full h-28">
        <path d="M35 25 L40 65 Q42 70 50 70 Q58 70 60 65 L65 25 Z" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <text x="44" y="52" fill="#1d4ed8" fontSize="10" fontWeight="bold">H₂O</text>
        <text x="26" y="18" fill="#ef4444" fontSize="8" fontWeight="bold">NƯỚC LỌC THƯỜNG</text>
      </svg>
    ),
    options: [
      {
        id: 'c4_correct',
        text: 'Nước lọc thông thường không phản ứng tạo kết tủa với CO₂, nên không thể quan sát hiện tượng để nhận biết.',
        isCorrect: true,
        explanation: 'Chính xác! Nước vôi trong [Ca(OH)₂] tác dụng với CO₂ tạo kết tủa CaCO₃ trắng đục, còn nước lọc thì không.',
      },
      {
        id: 'c4_wrong1',
        text: 'Nước thường sẽ làm hạt đậu nảy mầm nhanh gấp 10 lần.',
        isCorrect: false,
        explanation: 'Cốc nước để riêng không ảnh hưởng trực tiếp đến tốc độ mầm trong đĩa.',
      },
      {
        id: 'c4_wrong2',
        text: 'Nước thường sẽ chuyển thành axit làm thủng chuông.',
        isCorrect: false,
        explanation: 'CO₂ tan tạo axit cacbonic rất yếu, hoàn toàn không thể làm thủng thủy tinh.',
      },
    ],
    pedagogicalHint: 'Hóa chất nào có đặc tính biến đổi màu sắc khi gặp khí carbon dioxide?',
  },
  {
    id: 5,
    title: 'Vụ án 5: Hạt đậu "ngạt thở" dưới nước',
    scenarioDesc: 'Trước khi làm thí nghiệm, bạn Hùng ngâm ngập chìm hạt đậu trong chậu nước sâu suốt 48 giờ liên tục.',
    flawType: 'fatal',
    correctAction: 'fix',
    svgIllustration: (
      <svg viewBox="0 0 100 80" className="w-full h-28">
        <rect x="25" y="20" width="50" height="50" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
        <ellipse cx="45" cy="55" rx="8" ry="5" fill="#475569" />
        <ellipse cx="55" cy="60" rx="8" ry="5" fill="#475569" />
        <text x="35" y="42" fill="#0369a1" fontSize="9" fontWeight="bold">Ngập 48h</text>
      </svg>
    ),
    options: [
      {
        id: 'c5_correct',
        text: 'Ngâm chìm quá lâu khiến hạt thiếu oxygen để hô hấp hiếu khí, phôi bị ngạt thở, thối rữa và chết.',
        isCorrect: true,
        explanation: 'Tuyệt vời! Hạt cần ẩm nhưng cũng cần không khí để hô hấp. Ngập nước kéo dài gây thiếu O₂ và thối hạt.',
      },
      {
        id: 'c5_wrong1',
        text: 'Hạt sẽ mọc rễ dài 1 mét và làm vỡ chuông.',
        isCorrect: false,
        explanation: 'Hạt ngập nước không thể sinh trưởng bình thường.',
      },
      {
        id: 'c5_wrong2',
        text: 'Vỏ hạt sẽ biến thành đá cứng.',
        isCorrect: false,
        explanation: 'Hạt ngấm nước vỏ sẽ mềm ra chứ không cứng lại.',
      },
    ],
    pedagogicalHint: 'Hạt cần nước để nảy mầm nhưng phôi hạt có cần trao đổi khí oxygen với không khí không?',
  },
  {
    id: 6,
    title: 'Vụ án 6: Đĩa bông khô cằn',
    scenarioDesc: 'Bạn An quên châm nước vào bông lót đĩa Petri, bông khô rang và hạt nảy mầm bị héo queo.',
    flawType: 'fatal',
    correctAction: 'fix',
    svgIllustration: (
      <svg viewBox="0 0 100 80" className="w-full h-28">
        <ellipse cx="50" cy="55" rx="35" ry="12" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
        <text x="38" y="45" fontSize="16">🥀</text>
        <text x="33" y="70" fill="#b45309" fontSize="8" fontWeight="bold">KHÔ HẠN 0% NƯỚC</text>
      </svg>
    ),
    options: [
      {
        id: 'c6_correct',
        text: 'Thiếu nước làm tế bào phôi bị mất nước nghiêm trọng, quá trình hô hấp tế bào và trao đổi chất bị đình trệ.',
        isCorrect: true,
        explanation: 'Đúng! Nước là dung môi và môi trường cần thiết cho mọi hoạt động trao đổi chất và hô hấp tế bào.',
      },
      {
        id: 'c6_wrong1',
        text: 'Hạt sẽ hút hết khí CO₂ trong chuông để giải khát.',
        isCorrect: false,
        explanation: 'Hạt hô hấp thải CO₂ chứ không hút CO₂ để bù nước.',
      },
      {
        id: 'c6_wrong2',
        text: 'Bông khô sẽ tự bốc cháy tạo ra khói mù mịt.',
        isCorrect: false,
        explanation: 'Ở nhiệt độ phòng bông ẩm không thể tự bốc cháy.',
      },
    ],
    pedagogicalHint: 'Nước đóng vai trò gì đối với các phản ứng sinh hóa bên trong tế bào sống?',
  },
];

export const Stage5Detective: React.FC<Stage5DetectiveProps> = ({
  onComplete,
  onNext,
  isCompleted,
  detectiveAnswers,
  onUpdateDetectiveAnswer,
  customCases,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'whatif'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);
  const [userSelectedReasons, setUserSelectedReasons] = useState<Record<number, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<number, { text: string; success: boolean }>>({});

  // Merge default cases with custom cases from Teacher Mode
  const allCases: DetectiveQuestion[] = (customCases && customCases.length > 0)
    ? customCases.map((cc) => {
        const foundDefault = CASES.find((dc) => dc.id === cc.id);
        return {
          id: cc.id,
          title: cc.title,
          scenarioDesc: cc.scenarioDesc,
          flawType: 'fatal',
          correctAction: 'fix',
          svgIllustration: foundDefault?.svgIllustration || (
            <svg viewBox="0 0 100 80" className="w-full h-28">
              <rect x="20" y="20" width="60" height="45" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
              <text x="35" y="48" fontSize="22">🔬</text>
              <text x="30" y="60" fill="#92400e" fontSize="7" fontWeight="bold">TÌNH HUỐNG</text>
            </svg>
          ),
          pedagogicalHint: cc.pedagogicalHint,
          options: cc.options,
        };
      })
    : CASES;

  // What-if simulator states
  const [whatIfSeedState, setWhatIfSeedState] = useState<'dry' | 'soaking' | 'sprouted' | 'boiled'>('sprouted');
  const [whatIfMoisture, setWhatIfMoisture] = useState<number>(75); // 0 (dry), 75 (optimal), 100 (flooded)
  const [whatIfTemp, setWhatIfTemp] = useState<number>(28); // 5C, 28C, 55C
  const [whatIfTime, setWhatIfTime] = useState<number>(60); // 15, 30, 60, 120
  const [whatIfResult, setWhatIfResult] = useState<{
    respRate: string;
    waterAppearance: string;
    analysis: string;
    scoreColor: string;
  } | null>(null);

  const activeCase = allCases.find((c) => c.id === selectedCaseId) || allCases[0];
  const isCaseSolved = detectiveAnswers[activeCase.id]?.isCorrect;

  // Handle case decision & reason selection
  const handleSelectReason = (caseId: number, optionId: string) => {
    sound.playClick();
    setUserSelectedReasons({ ...userSelectedReasons, [caseId]: optionId });

    const c = allCases.find((item) => item.id === caseId);
    if (!c) return;
    const opt = c.options.find((o) => o.id === optionId);
    if (!opt) return;

    if (opt.isCorrect) {
      sound.playSuccess();
      setFeedbackMap({
        ...feedbackMap,
        [caseId]: { text: opt.explanation, success: true },
      });
      onUpdateDetectiveAnswer(caseId, {
        fixed: true,
        reason: opt.text,
        isCorrect: true,
      });

      // Check if all cases solved
      const updatedTotal = Object.keys(detectiveAnswers).length + (detectiveAnswers[caseId] ? 0 : 1);
      if (updatedTotal >= allCases.length) {
        onComplete();
      }
    } else {
      sound.playGentleWrong();
      setFeedbackMap({
        ...feedbackMap,
        [caseId]: { text: `Chưa chính xác: ${opt.explanation} Em hãy suy nghĩ lại theo gợi ý của Giáo sư nhé!`, success: false },
      });
    }
  };

  // Run What-If simulation
  const runWhatIfSimulation = () => {
    sound.playClick();

    let respRate = 'Trung bình';
    let waterAppearance = 'Vẩn đục nhẹ';
    let analysis = '';
    let scoreColor = 'text-emerald-700';

    if (whatIfSeedState === 'boiled') {
      respRate = 'Bằng 0 (Không hô hấp)';
      waterAppearance = 'Hoàn toàn trong suốt';
      analysis = 'Hạt đã bị luộc chín làm biến tính protein và enzym, tế bào đã chết nên không còn hoạt động hô hấp.';
      scoreColor = 'text-slate-600';
    } else if (whatIfSeedState === 'dry') {
      respRate = 'Rất thấp (Hầu như không đáng kể)';
      waterAppearance = 'Trong suốt';
      analysis = 'Hạt khô thiếu nước, trao đổi chất ở mức tối thiểu. Trong thời gian ngắn thí nghiệm, lượng CO₂ thoát ra không làm đổi màu nước vôi.';
      scoreColor = 'text-amber-700';
    } else if (whatIfMoisture < 20) {
      respRate = 'Giảm mạnh';
      waterAppearance = 'Trong suốt hoặc đục mờ';
      analysis = 'Độ ẩm quá thấp khiến hạt bị khô héo, enzym hô hấp thiếu môi trường hoạt động.';
      scoreColor = 'text-amber-700';
    } else if (whatIfMoisture > 90) {
      respRate = 'Chậm và chuyển sang hô hấp kị khí';
      waterAppearance = 'Hơi đục nhẹ, có mùi chua';
      analysis = 'Hạt bị ngập úng thiếu O₂, hô hấp hiếu khí bị cản trở, sinh ra sản phẩm phụ gây thối hạt.';
      scoreColor = 'text-rose-700';
    } else if (whatIfTemp > 45) {
      respRate = 'Ngừng hô hấp';
      waterAppearance = 'Trong suốt';
      analysis = 'Nhiệt độ quá cao (>45°C) làm enzym hô hấp bị biến tính và bất hoạt, tế bào phôi bị tổn thương.';
      scoreColor = 'text-rose-700';
    } else if (whatIfTemp < 12) {
      respRate = 'Rất chậm';
      waterAppearance = 'Gần như trong suốt';
      analysis = 'Nhiệt độ quá lạnh kìm hãm hoạt tính enzym, tốc độ hô hấp giảm mạnh.';
      scoreColor = 'text-blue-700';
    } else {
      // Optimal conditions
      if (whatIfTime >= 60) {
        respRate = 'Mạnh mẽ tối ưu (100%)';
        waterAppearance = 'Trắng đục như sữa, có màng váng canxi cacbonat dày';
        analysis = 'Điều kiện hoàn hảo! Hạt nảy mầm ở độ ẩm và nhiệt độ ấm áp (25-30°C) hô hấp mạnh nhất, thải nhiều CO₂ nhất.';
        scoreColor = 'text-emerald-700';
      } else {
        respRate = 'Đang diễn ra mạnh';
        waterAppearance = 'Bắt đầu vẩn đục rõ';
        analysis = 'Hạt hô hấp tốt, lượng CO₂ đang tích lũy dần trong bình.';
        scoreColor = 'text-emerald-700';
      }
    }

    setWhatIfResult({ respRate, waterAppearance, analysis, scoreColor });
  };

  const solvedCount = Object.values(detectiveAnswers).filter((a) => a.isCorrect).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Màn 5 / 6
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          THỬ THÁCH 5 – AI ĐÃ LÀM HỎNG THÍ NGHIỆM?
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-1 leading-relaxed">
          Trở thành <span className="font-bold text-amber-700">Thám tử khoa học</span> để phát hiện và sửa chữa 6 lỗi thí nghiệm thường gặp, hoặc thử nghiệm trong phòng thí nghiệm mở “Điều gì xảy ra nếu...?”
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('cases');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'cases'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          🕵️ CÁC VỤ ÁN THÍ NGHIỆM HỎNG ({solvedCount}/{allCases.length})
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('whatif');
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'whatif'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          ⚙️ PHÒNG THỬ NGHIỆM: ĐIỀU GÌ XẢY RA NẾU...?
        </button>
      </div>

      {/* TAB 1: CASES */}
      {activeTab === 'cases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Case selector buttons */}
          <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-emerald-200/80 p-4 shadow-xl shadow-emerald-950/5">
            <h3 className="font-extrabold text-sm text-slate-900 pb-2 border-b border-slate-100 mb-3 flex items-center justify-between">
              <span>HỒ SƠ CÁC VỤ ÁN</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                +5đ / vụ án
              </span>
            </h3>

            <div className="space-y-2">
              {allCases.map((c) => {
                const solved = detectiveAnswers[c.id]?.isCorrect;
                const isSelected = selectedCaseId === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCaseId(c.id);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-sm ring-2 ring-amber-300'
                        : solved
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">
                        {solved ? '✅' : '🔍'}
                      </span>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                          {c.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {solved ? 'Đã phá án thành công' : 'Cần thám tử điều tra'}
                        </p>
                      </div>
                    </div>
                    {solved && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        +5đ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Case Detail & Resolution */}
          <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-emerald-200/80 p-6 shadow-xl shadow-emerald-950/5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  Hồ sơ hiện trường #{activeCase.id}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">{activeCase.title}</h3>
              </div>
              {isCaseSolved && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  ĐÃ PHÁ ÁN
                </div>
              )}
            </div>

            {/* Illustration & Scenario */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 items-center">
              <div className="sm:col-span-1 bg-white rounded-xl p-2 border border-amber-200 flex items-center justify-center">
                {activeCase.svgIllustration}
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wide text-amber-800">Mô tả hiện trường:</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                  "{activeCase.scenarioDesc}"
                </p>
                <div className="mt-2 text-xs text-amber-900 font-medium bg-amber-100/70 p-2 rounded-lg">
                  💡 <strong>Gợi ý suy ngẫm:</strong> {activeCase.pedagogicalHint}
                </div>
              </div>
            </div>

            {/* Detective Decision Options */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                Lỗi này ảnh hưởng thế nào đến thí nghiệm? Hãy chọn giải thích đúng:
              </h4>

              <div className="space-y-2.5">
                {activeCase.options.map((opt) => {
                  const isSelected = userSelectedReasons[activeCase.id] === opt.id;
                  const isCorrectChosen = isCaseSolved && opt.isCorrect;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectReason(activeCase.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                        isCorrectChosen
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-300 font-bold text-emerald-950'
                          : isSelected
                          ? 'border-amber-500 bg-amber-50 text-slate-900'
                          : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                        {isCorrectChosen ? (
                          <div className="w-3 h-3 bg-emerald-600 rounded-full" />
                        ) : isSelected ? (
                          <div className="w-3 h-3 bg-amber-500 rounded-full" />
                        ) : null}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback alert */}
            {feedbackMap[activeCase.id] && (
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed border ${
                  feedbackMap[activeCase.id].success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                {feedbackMap[activeCase.id].text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WHAT-IF EXPERIMENTAL SANDBOX */}
      {activeTab === 'whatif' && (
        <div className="bg-white rounded-3xl border-2 border-teal-200/80 p-6 shadow-xl shadow-teal-950/5 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <span className="text-3xl">⚙️</span>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                PHÒNG THỬ NGHIỆM MỞ: “ĐIỀU GÌ XẢY RA NẾU...?”
              </h3>
              <p className="text-xs text-slate-500">
                Khám phá ảnh hưởng của trạng thái hạt, độ ẩm, nhiệt độ và thời gian đến cường độ hô hấp của hạt
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Control 1: Seed State */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. TRẠNG THÁI HẠT ĐẬU
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'sprouted', label: '🌱 Hạt đang nảy mầm (mầm 1cm)' },
                  { id: 'soaking', label: '💧 Hạt mới ngâm 2 giờ' },
                  { id: 'dry', label: '🌰 Hạt khô cằn' },
                  { id: 'boiled', label: '♨️ Hạt đã luộc chín (chết)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playClick();
                      setWhatIfSeedState(s.id as 'dry' | 'soaking' | 'sprouted' | 'boiled');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      whatIfSeedState === s.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Moisture Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label htmlFor="whatif-moisture-slider" className="block text-xs font-bold text-slate-800 mb-1">
                2. ĐỘ ẨM KHÔNG KHÍ & BÔNG
              </label>
              <div className="flex items-center justify-between text-[11px] font-bold text-teal-800 mb-2">
                <span>{whatIfMoisture < 20 ? 'Khô cằn' : whatIfMoisture > 85 ? 'Ngập úng nước' : 'Ẩm phù hợp'}</span>
                <span>{whatIfMoisture}%</span>
              </div>
              <input
                id="whatif-moisture-slider"
                type="range"
                min={0}
                max={100}
                value={whatIfMoisture}
                onChange={(e) => setWhatIfMoisture(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <p className="text-[10px] text-slate-500 mt-2">
                * Kéo sang trái: Khô kiệt | Kéo sang phải: Ngập úng
              </p>
            </div>

            {/* Control 3: Temperature Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label htmlFor="whatif-temp-slider" className="block text-xs font-bold text-slate-800 mb-1">
                3. NHIỆT ĐỘ PHÒNG
              </label>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-2">
                <span>{whatIfTemp < 15 ? 'Lạnh giá' : whatIfTemp > 45 ? 'Quá nóng (>50°C)' : 'Ấm áp (25–30°C)'}</span>
                <span>{whatIfTemp}°C</span>
              </div>
              <input
                id="whatif-temp-slider"
                type="range"
                min={5}
                max={60}
                value={whatIfTemp}
                onChange={(e) => setWhatIfTemp(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <p className="text-[10px] text-slate-500 mt-2">
                * Nhiệt độ tối ưu cho hô hấp tế bào: 25–35°C
              </p>
            </div>

            {/* Control 4: Time */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                4. THỜI GIAN THỬ NGHIỆM
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[15, 30, 60, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      sound.playClick();
                      setWhatIfTime(t);
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      whatIfTime === t
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {t} phút
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Run button */}
          <div className="flex justify-center">
            <button
              onClick={runWhatIfSimulation}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-700/25 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              ▶ CHẠY THỬ MÔ PHỎNG ĐỊNH TÍNH
            </button>
          </div>

          {/* Simulation Output Result Box */}
          {whatIfResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/50 border-2 border-teal-300 animate-fadeIn">
              <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                KẾT QUẢ QUAN SÁT ĐỊNH TÍNH:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Cường độ hô hấp:</span>
                  <p className={`text-base font-black ${whatIfResult.scoreColor} mt-0.5`}>
                    {whatIfResult.respRate}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Hiện tượng nước vôi trong:</span>
                  <p className="text-base font-black text-slate-800 mt-0.5">
                    {whatIfResult.waterAppearance}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-teal-100/60 rounded-xl border border-teal-200 text-xs sm:text-sm text-teal-950 leading-relaxed">
                🔬 <strong>Giải thích khoa học KHTN 7:</strong> {whatIfResult.analysis}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stage Completion Footer */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="text-xs text-slate-600">
          {solvedCount >= allCases.length ? (
            <span className="font-bold text-emerald-700">
              🎉 Em đã giải quyết thành công tất cả {allCases.length} vụ án! (+{allCases.length * 5} điểm)
            </span>
          ) : (
            <span>Hãy hoàn thành phá án các vụ án thí nghiệm hỏng ({solvedCount}/{allCases.length}).</span>
          )}
        </div>

        <button
          disabled={solvedCount < Math.min(3, allCases.length)}
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
        >
          Tiếp tục: Màn 6 – Nhật kí & Kết luận
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
