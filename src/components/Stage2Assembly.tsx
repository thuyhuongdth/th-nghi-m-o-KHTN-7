import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface Stage2AssemblyProps {
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
  sealedJars: boolean;
  onSealJars: () => void;
}

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  type: 'seed_sprouted' | 'seed_dry' | 'limewater' | 'plainwater' | 'petri_empty' | 'label_a' | 'label_b';
  icon: string;
  tag: string;
}

const TOOLBOX: ToolItem[] = [
  {
    id: 'seed_sprouted',
    name: 'Đĩa hạt đậu nảy mầm',
    desc: 'Hạt mầm đang sống khỏe mạnh trên lớp bông ẩm',
    type: 'seed_sprouted',
    icon: '🌱',
    tag: 'Mẫu vật sống',
  },
  {
    id: 'seed_dry',
    name: 'Đĩa hạt đậu khô',
    desc: 'Hạt khô chưa ngâm, phôi đang ở trạng thái ngủ',
    type: 'seed_dry',
    icon: '🌰',
    tag: 'Mẫu vật khô',
  },
  {
    id: 'limewater_1',
    name: 'Cốc nước vôi trong [Ca(OH)₂]',
    desc: 'Dung dịch trong suốt dùng nhận biết khí CO₂',
    type: 'limewater',
    icon: '🧪',
    tag: 'Hóa chất thử',
  },
  {
    id: 'limewater_2',
    name: 'Cốc nước vôi trong [Ca(OH)₂]',
    desc: 'Dung dịch trong suốt dùng nhận biết khí CO₂',
    type: 'limewater',
    icon: '🧪',
    tag: 'Hóa chất thử',
  },
  {
    id: 'plainwater',
    name: 'Cốc nước thường (nước cất)',
    desc: 'Nước lọc tinh khiết không phản ứng với CO₂',
    type: 'plainwater',
    icon: '💧',
    tag: 'Chất lỏng',
  },
  {
    id: 'petri_empty',
    name: 'Đĩa Petri lót bông ẩm',
    desc: 'Đĩa ẩm không chứa bất kì hạt đậu nào',
    type: 'petri_empty',
    icon: '🧫',
    tag: 'Dụng cụ lót',
  },
  {
    id: 'label_a',
    name: 'Nhãn thí nghiệm "A"',
    desc: 'Đánh dấu hệ thí nghiệm chính',
    type: 'label_a',
    icon: '🅰️',
    tag: 'Nhãn định danh',
  },
  {
    id: 'label_b',
    name: 'Nhãn đối chứng "B"',
    desc: 'Đánh dấu hệ đối chứng',
    type: 'label_b',
    icon: '🅱️',
    tag: 'Nhãn định danh',
  },
];

export const Stage2Assembly: React.FC<Stage2AssemblyProps> = ({
  onComplete,
  onNext,
  isCompleted,
  sealedJars,
  onSealJars,
}) => {
  const [itemsA, setItemsA] = useState<string[]>(
    isCompleted ? ['seed_sprouted', 'limewater_1', 'label_a'] : []
  );
  const [itemsB, setItemsB] = useState<string[]>(
    isCompleted ? ['petri_empty', 'limewater_2', 'label_b'] : []
  );
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [pedagogicalFeedback, setPedagogicalFeedback] = useState<string>('');
  const [bellLowering, setBellLowering] = useState<boolean>(sealedJars);

  // Check if item is already placed
  const isPlaced = (id: string) => itemsA.includes(id) || itemsB.includes(id);

  // Place tool into Jar A or Jar B
  const placeItem = (targetJar: 'A' | 'B', toolId: string) => {
    sound.playClick();
    if (targetJar === 'A') {
      if (!itemsA.includes(toolId)) {
        setItemsA([...itemsA, toolId]);
        setItemsB(itemsB.filter((id) => id !== toolId));
      }
    } else {
      if (!itemsB.includes(toolId)) {
        setItemsB([...itemsB, toolId]);
        setItemsA(itemsA.filter((id) => id !== toolId));
      }
    }
    setSelectedToolId(null);
    setPedagogicalFeedback('');
  };

  const removeItem = (targetJar: 'A' | 'B', toolId: string) => {
    sound.playClick();
    if (targetJar === 'A') {
      setItemsA(itemsA.filter((id) => id !== toolId));
    } else {
      setItemsB(itemsB.filter((id) => id !== toolId));
    }
    setPedagogicalFeedback('');
  };

  const handleResetLab = () => {
    sound.playClick();
    setItemsA([]);
    setItemsB([]);
    setSelectedToolId(null);
    setPedagogicalFeedback('');
    setBellLowering(false);
  };

  // Evaluate the setup
  const validateSetup = () => {
    const hasSproutedInA = itemsA.includes('seed_sprouted');
    const hasLimeWaterInA = itemsA.includes('limewater_1') || itemsA.includes('limewater_2');
    const hasLabelA = itemsA.includes('label_a');

    const hasSproutedInB = itemsB.includes('seed_sprouted');
    const hasLimeWaterInB = itemsB.includes('limewater_1') || itemsB.includes('limewater_2');
    const hasLabelB = itemsB.includes('label_b');
    const hasPlainWaterInA = itemsA.includes('plainwater');
    const hasDrySeedInB = itemsB.includes('seed_dry');

    // Pedagogical guiding questions:
    if (!hasLabelA || !hasLabelB) {
      sound.playGentleWrong();
      setPedagogicalFeedback('💡 Đừng quên dán nhãn A cho chuông thí nghiệm và nhãn B cho chuông đối chứng để tránh nhầm lẫn nhé!');
      return false;
    }

    if (hasPlainWaterInA) {
      sound.playGentleWrong();
      setPedagogicalFeedback('💡 Để nhận biết khí CO₂ tạo ra trong quá trình hô hấp, ta cần dùng chất lỏng nào có khả năng phản ứng làm vẩn đục? Nước thường có nhận biết được không?');
      return false;
    }

    if (hasSproutedInB) {
      sound.playGentleWrong();
      setPedagogicalFeedback('💡 Lưu ý nguyên tắc đối chứng: Nếu cả hai chuông đều có hạt nảy mầm thì chúng ta còn xác định được sự thay đổi có phải do hạt nảy mầm gây ra hay không?');
      return false;
    }

    if (hasDrySeedInB) {
      sound.playGentleWrong();
      setPedagogicalFeedback('💡 Chuông B là hệ đối chứng nhằm chứng minh môi trường không có hạt sống thì không tự sinh ra CO₂. Do đó ở chuông B ta chỉ cần đặt đĩa bông ẩm không có hạt (hoặc không đặt hạt) và cốc nước vôi trong!');
      return false;
    }

    if (!hasSproutedInA) {
      sound.playGentleWrong();
      setPedagogicalFeedback('💡 Chuông A là hệ thí nghiệm chính để nghiên cứu hơi thở của hạt. Em hãy đặt đĩa hạt đậu đang nảy mầm vào Chuông A nhé!');
      return false;
    }

    if (!hasLimeWaterInA) {
      sound.playGentleWrong();
      setPedagogicalFeedback('💡 Chuông A chưa có chất chỉ thị khí CO₂. Hãy đặt cốc nước vôi trong vào Chuông A.');
      return false;
    }

    if (!hasLimeWaterInB) {
      sound.playGentleWrong();
      setPedagogicalFeedback('💡 Để so sánh công bằng giữa hai hệ, Chuông B (đối chứng) cũng cần có một cốc nước vôi trong giống hệt Chuông A!');
      return false;
    }

    // Success!
    sound.playSuccess();
    setPedagogicalFeedback('🎉 Chuẩn xác! Chuông A (Hạt nảy mầm + Nước vôi trong) và Chuông B (Hệ đối chứng: Không hạt + Nước vôi trong). Hãy nhấn nút ĐẬY KÍN HAI CHUÔNG ngay bên dưới!');
    return true;
  };

  const handleSealJars = () => {
    sound.playSuccess();
    setBellLowering(true);
    onSealJars();
    onComplete();
  };

  const isReadyToSeal =
    itemsA.includes('seed_sprouted') &&
    (itemsA.includes('limewater_1') || itemsA.includes('limewater_2')) &&
    itemsA.includes('label_a') &&
    !itemsB.includes('seed_sprouted') &&
    (itemsB.includes('limewater_1') || itemsB.includes('limewater_2')) &&
    itemsB.includes('label_b');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Màn 2 / 6
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          THỬ THÁCH 2 – LẮP ĐẶT PHÒNG THÍ NGHIỆM
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-1 leading-relaxed">
          Hãy sắp xếp các dụng cụ vào <span className="font-bold text-emerald-800">Chuông A (Thí nghiệm)</span> và{' '}
          <span className="font-bold text-teal-800">Chuông B (Đối chứng)</span> sao cho đúng phương pháp nghiên cứu khoa học.
        </p>
      </div>

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Toolbox (Kho dụng cụ) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border-2 border-emerald-200/80 p-4 shadow-xl shadow-emerald-950/5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                🧰 KHO DỤNG CỤ THÍ NGHIỆM
              </h3>
              <p className="text-[11px] text-slate-500">Chạm hoặc chọn để đưa vào chuông</p>
            </div>
            <button
              onClick={handleResetLab}
              className="text-xs text-slate-400 hover:text-rose-600 font-semibold p-1 transition-colors flex items-center gap-1"
              title="Đặt lại bàn thí nghiệm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đặt lại
            </button>
          </div>

          <div className="mt-3 space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {TOOLBOX.map((item) => {
              const placed = isPlaced(item.id);
              const isSelected = selectedToolId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!placed && !sealedJars) {
                      sound.playClick();
                      setSelectedToolId(isSelected ? null : item.id);
                    }
                  }}
                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    placed
                      ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed'
                      : isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-300'
                      : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1 bg-slate-100 rounded-lg">{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs sm:text-sm text-slate-800 leading-tight">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                      {item.tag}
                    </span>
                  </div>

                  {/* Quick Action buttons when clicked */}
                  {isSelected && !placed && !sealedJars && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center justify-end gap-2 animate-fadeIn">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          placeItem('A', item.id);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                      >
                        + Vào Chuông A
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          placeItem('B', item.id);
                        }}
                        className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                      >
                        + Vào Chuông B
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lab Bench with Two Bell Jars A & B */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bell Jar A Zone */}
            <div
              className={`relative bg-gradient-to-b from-white to-emerald-50/50 rounded-3xl border-3 transition-all p-5 shadow-lg min-h-[380px] flex flex-col justify-between ${
                itemsA.includes('label_a') ? 'border-emerald-500' : 'border-dashed border-emerald-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    A
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-emerald-950">CHUÔNG A</h4>
                    <p className="text-[10px] text-emerald-700 font-semibold uppercase">Hệ thí nghiệm chính</p>
                  </div>
                </div>
                {sealedJars && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    🔒 ĐÃ ĐẬY KÍN
                  </span>
                )}
              </div>

              {/* Glass Bell Simulation Illustration */}
              <div className="relative my-4 flex-1 flex flex-col items-center justify-center">
                {/* Glass dome outline */}
                <div
                  className={`w-52 h-60 border-3 border-teal-400/80 bg-teal-100/20 backdrop-blur-xs rounded-t-full relative flex flex-col items-center justify-end pb-3 transition-all duration-700 shadow-inner ${
                    bellLowering ? 'translate-y-0 opacity-100' : 'translate-y-[-15px] opacity-75'
                  }`}
                >
                  {/* Top glass knob */}
                  <div className="absolute -top-3 w-8 h-5 bg-teal-300 border-2 border-teal-500 rounded-full" />

                  {/* Rubber sealing gasket at base */}
                  <div className="w-56 h-3 bg-slate-800 rounded-md absolute -bottom-1 shadow-md flex items-center justify-center">
                    <span className="text-[8px] text-slate-300 font-mono tracking-widest">ĐẾ KÍN KHÍ</span>
                  </div>

                  {/* Placed contents inside Jar A */}
                  <div className="w-full px-3 flex flex-col items-center justify-center gap-3 z-10">
                    {/* Seeds */}
                    {itemsA.includes('seed_sprouted') && (
                      <div className="relative p-2 bg-emerald-100/90 rounded-2xl border-2 border-emerald-400 text-center shadow-xs animate-fadeIn">
                        <span className="text-3xl">🌱</span>
                        <p className="text-[10px] font-bold text-emerald-900 leading-tight">Đĩa hạt nảy mầm</p>
                        {!sealedJars && (
                          <button
                            onClick={() => removeItem('A', 'seed_sprouted')}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}

                    {itemsA.includes('seed_dry') && (
                      <div className="relative p-2 bg-amber-100/90 rounded-2xl border-2 border-amber-400 text-center shadow-xs animate-fadeIn">
                        <span className="text-3xl">🌰</span>
                        <p className="text-[10px] font-bold text-amber-900 leading-tight">Đĩa hạt khô</p>
                        {!sealedJars && (
                          <button
                            onClick={() => removeItem('A', 'seed_dry')}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}

                    {/* Liquid beaker */}
                    <div className="flex items-center gap-2">
                      {(itemsA.includes('limewater_1') || itemsA.includes('limewater_2')) && (
                        <div className="relative p-2 bg-cyan-50/95 rounded-2xl border-2 border-cyan-400 text-center shadow-xs animate-fadeIn">
                          <span className="text-2xl">🧪</span>
                          <p className="text-[10px] font-bold text-cyan-900 leading-tight">Nước vôi trong</p>
                          {!sealedJars && (
                            <button
                              onClick={() => removeItem('A', itemsA.includes('limewater_1') ? 'limewater_1' : 'limewater_2')}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )}

                      {itemsA.includes('plainwater') && (
                        <div className="relative p-2 bg-blue-50/95 rounded-2xl border-2 border-blue-400 text-center shadow-xs animate-fadeIn">
                          <span className="text-2xl">💧</span>
                          <p className="text-[10px] font-bold text-blue-900 leading-tight">Nước thường</p>
                          {!sealedJars && (
                            <button
                              onClick={() => removeItem('A', 'plainwater')}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )}

                      {itemsA.includes('petri_empty') && (
                        <div className="relative p-2 bg-slate-50/95 rounded-2xl border-2 border-slate-300 text-center shadow-xs animate-fadeIn">
                          <span className="text-2xl">🧫</span>
                          <p className="text-[10px] font-bold text-slate-800 leading-tight">Đĩa bông ẩm</p>
                          {!sealedJars && (
                            <button
                              onClick={() => removeItem('A', 'petri_empty')}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    {itemsA.includes('label_a') && (
                      <div className="px-3 py-0.5 bg-emerald-600 text-white text-[11px] font-black rounded-md shadow-xs animate-fadeIn">
                        NHÃN THÍ NGHIỆM A
                      </div>
                    )}
                  </div>

                  {itemsA.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-semibold px-4 text-center">
                      (Khu vực Chuông A còn trống. Hãy chuyển dụng cụ vào đây)
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bell Jar B Zone (Control) */}
            <div
              className={`relative bg-gradient-to-b from-white to-teal-50/50 rounded-3xl border-3 transition-all p-5 shadow-lg min-h-[380px] flex flex-col justify-between ${
                itemsB.includes('label_b') ? 'border-teal-500' : 'border-dashed border-teal-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-teal-100">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center">
                    B
                  </span>
                  <div>
                    <h4 className="font-extrabold text-sm text-teal-950">CHUÔNG B</h4>
                    <p className="text-[10px] text-teal-700 font-semibold uppercase">Hệ đối chứng (không hạt)</p>
                  </div>
                </div>
                {sealedJars && (
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-300">
                    🔒 ĐÃ ĐẬY KÍN
                  </span>
                )}
              </div>

              {/* Glass Bell Simulation Illustration */}
              <div className="relative my-4 flex-1 flex flex-col items-center justify-center">
                <div
                  className={`w-52 h-60 border-3 border-teal-400/80 bg-teal-100/20 backdrop-blur-xs rounded-t-full relative flex flex-col items-center justify-end pb-3 transition-all duration-700 shadow-inner ${
                    bellLowering ? 'translate-y-0 opacity-100' : 'translate-y-[-15px] opacity-75'
                  }`}
                >
                  <div className="absolute -top-3 w-8 h-5 bg-teal-300 border-2 border-teal-500 rounded-full" />
                  <div className="w-56 h-3 bg-slate-800 rounded-md absolute -bottom-1 shadow-md flex items-center justify-center">
                    <span className="text-[8px] text-slate-300 font-mono tracking-widest">ĐẾ KÍN KHÍ</span>
                  </div>

                  <div className="w-full px-3 flex flex-col items-center justify-center gap-3 z-10">
                    {/* Seeds */}
                    {itemsB.includes('seed_sprouted') && (
                      <div className="relative p-2 bg-emerald-100/90 rounded-2xl border-2 border-emerald-400 text-center shadow-xs animate-fadeIn">
                        <span className="text-3xl">🌱</span>
                        <p className="text-[10px] font-bold text-emerald-900 leading-tight">Đĩa hạt nảy mầm</p>
                        {!sealedJars && (
                          <button
                            onClick={() => removeItem('B', 'seed_sprouted')}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}

                    {itemsB.includes('seed_dry') && (
                      <div className="relative p-2 bg-amber-100/90 rounded-2xl border-2 border-amber-400 text-center shadow-xs animate-fadeIn">
                        <span className="text-3xl">🌰</span>
                        <p className="text-[10px] font-bold text-amber-900 leading-tight">Đĩa hạt khô</p>
                        {!sealedJars && (
                          <button
                            onClick={() => removeItem('B', 'seed_dry')}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}

                    {/* Liquid beaker */}
                    <div className="flex items-center gap-2">
                      {(itemsB.includes('limewater_1') || itemsB.includes('limewater_2')) && (
                        <div className="relative p-2 bg-cyan-50/95 rounded-2xl border-2 border-cyan-400 text-center shadow-xs animate-fadeIn">
                          <span className="text-2xl">🧪</span>
                          <p className="text-[10px] font-bold text-cyan-900 leading-tight">Nước vôi trong</p>
                          {!sealedJars && (
                            <button
                              onClick={() => removeItem('B', itemsB.includes('limewater_1') ? 'limewater_1' : 'limewater_2')}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )}

                      {itemsB.includes('petri_empty') && (
                        <div className="relative p-2 bg-slate-50/95 rounded-2xl border-2 border-slate-300 text-center shadow-xs animate-fadeIn">
                          <span className="text-2xl">🧫</span>
                          <p className="text-[10px] font-bold text-slate-800 leading-tight">Đĩa bông ẩm (không hạt)</p>
                          {!sealedJars && (
                            <button
                              onClick={() => removeItem('B', 'petri_empty')}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    {itemsB.includes('label_b') && (
                      <div className="px-3 py-0.5 bg-teal-600 text-white text-[11px] font-black rounded-md shadow-xs animate-fadeIn">
                        NHÃN ĐỐI CHỨNG B
                      </div>
                    )}
                  </div>

                  {itemsB.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-semibold px-4 text-center">
                      (Khu vực Chuông B đối chứng còn trống)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pedagogical Guidance Box */}
          {pedagogicalFeedback && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs sm:text-sm font-medium text-amber-950 leading-relaxed shadow-xs">
              {pedagogicalFeedback}
            </div>
          )}

          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-slate-500">
              {sealedJars
                ? '✓ Đã đậy kín chuông chuẩn bị cho bước Dự đoán (+20 điểm)'
                : 'Lắp đủ và đúng dụng cụ trước khi đậy kín chuông'}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!sealedJars ? (
                <>
                  <button
                    onClick={validateSetup}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
                  >
                    Kiểm tra sơ đồ lắp đặt
                  </button>
                  <button
                    disabled={!isReadyToSeal}
                    onClick={handleSealJars}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    🔔 ĐẬY KÍN HAI CHUÔNG
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    onNext();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02]"
                >
                  Tiếp tục: Màn 3 – Nhà khoa học dự đoán
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
