import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Eye, ArrowRight, Star, X, ZoomIn } from 'lucide-react';
import { sound } from '../utils/sound';

interface Stage4SimulateProps {
  userPredictions: {
    jarA: string;
    jarB: string;
    reason: string;
  };
  onComplete: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export const Stage4Simulate: React.FC<Stage4SimulateProps> = ({
  userPredictions,
  onComplete,
  onNext,
  isCompleted,
}) => {
  const [minutes, setMinutes] = useState<number>(isCompleted ? 60 : 0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [isMoleculeMode, setIsMoleculeMode] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(isCompleted);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Animation ticks
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setMinutes((prev) => {
          if (prev >= 60) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            sound.playSuccess();
            setShowComparison(true);
            onComplete();
            return 60;
          }
          // play subtle bubble periodically
          if (prev % 10 === 0) {
            sound.playBubble();
          }
          return prev + 1;
        });
      }, (250 / speed));
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speed, onComplete]);

  const toggleRun = () => {
    sound.playClick();
    if (minutes >= 60) {
      setMinutes(0);
      setShowComparison(false);
    }
    setIsRunning(!isRunning);
  };

  const resetSim = () => {
    sound.playClick();
    setIsRunning(false);
    setMinutes(0);
    setShowComparison(false);
  };

  // Turbidity calculations:
  // Jar A turbidity: 0% at 0min, up to 100% at 60min
  const turbidityA = Math.min(100, Math.round((minutes / 60) * 100));
  // Jar B turbidity: stays ~0-2%
  const turbidityB = 1;

  // Comparison evaluation
  const isJarACorrect = userPredictions.jarA === 'A_turbid';
  const isJarBCorrect = userPredictions.jarB === 'B_no_change';

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Màn 4 / 6
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          THỬ THÁCH 4 – 60 PHÚT TRONG PHÒNG THÍ NGHIỆM
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto mt-1 leading-relaxed">
          Quan sát sự biến đổi trong hai chuông kín theo thời gian. Em có thể bật <span className="font-bold text-teal-700">Chế độ phân tử</span> để nhìn thấy dòng khí vô hình!
        </p>
      </div>

      {/* Control bar: Clock, Play/Pause, Speed, Molecule Toggle */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200/80 p-4 sm:p-5 shadow-xl shadow-emerald-950/5 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Clock Display */}
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 bg-slate-900 rounded-2xl border-2 border-slate-700 text-center font-mono shadow-inner">
              <span className="text-[10px] text-slate-400 block tracking-widest uppercase">Thời gian</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider">
                00:{minutes < 10 ? `0${minutes}` : minutes}:00
              </span>
            </div>

            {/* Run Button */}
            <button
              onClick={toggleRun}
              className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  TẠM DỪNG
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  {minutes >= 60 ? 'CHẠY LẠI' : '▶ BẮT ĐẦU THÍ NGHIỆM'}
                </>
              )}
            </button>

            <button
              onClick={resetSim}
              className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl border border-slate-200 transition-colors"
              title="Đặt lại mốc 0 phút"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Time Scrubber / Progress Bar */}
          <div className="w-full md:w-64 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>0 phút</span>
              <span className="text-emerald-700 font-extrabold">{minutes} / 60 phút</span>
              <span>60 phút</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={minutes}
              onChange={(e) => {
                setMinutes(Number(e.target.value));
                if (Number(e.target.value) >= 60) {
                  setShowComparison(true);
                  onComplete();
                }
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            {/* Speed buttons */}
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Tốc độ:</span>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    sound.playClick();
                    setSpeed(s);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                    speed === s ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Molecule mode toggle button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsMoleculeMode(!isMoleculeMode);
            }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 border-2 transition-all cursor-pointer ${
              isMoleculeMode
                ? 'bg-teal-600 border-teal-700 text-white shadow-md'
                : 'bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100'
            }`}
          >
            <Eye className="w-4 h-4" />
            {isMoleculeMode ? '✕ THOÁT CHẾ ĐỘ PHÂN TỬ' : '🔬 BẬT CHẾ ĐỘ PHÂN TỬ'}
          </button>
        </div>
      </div>

      {/* Main Bell Jars Observation Bench */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Chuông A */}
        <div className="bg-gradient-to-b from-white via-emerald-50/30 to-emerald-100/40 rounded-3xl border-2 border-emerald-400 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                A
              </span>
              <div>
                <h3 className="font-black text-base text-emerald-950">CHUÔNG A (THÍ NGHIỆM)</h3>
                <p className="text-xs text-emerald-700 font-semibold">Chứa hạt đậu đang nảy mầm + Cốc nước vôi trong</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-900 font-extrabold rounded-full border border-emerald-300">
              Độ đục: {turbidityA}%
            </span>
          </div>

          {/* Visual Chamber */}
          <div className="relative my-6 h-80 flex flex-col items-center justify-end">
            {/* Sealed Glass Bell Outline */}
            <div className="w-64 h-72 border-4 border-teal-400/90 bg-teal-50/20 backdrop-blur-xs rounded-t-full relative flex flex-col items-center justify-end pb-4 shadow-2xl">
              {/* Glass Knob */}
              <div className="absolute -top-4 w-10 h-6 bg-teal-300 border-3 border-teal-600 rounded-full" />
              {/* Tight Rubber Gasket */}
              <div className="w-72 h-4 bg-slate-900 rounded-lg absolute -bottom-2 shadow-lg flex items-center justify-center">
                <span className="text-[9px] text-emerald-400 font-mono tracking-widest font-bold">KÍN KHÍ TUYỆT ĐỐI</span>
              </div>

              {/* Contents Inside Bell A */}
              <div className="w-full px-4 flex items-end justify-around gap-2 z-10 mb-2">
                {/* Seed Dish with Sprouted Beans */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* Petri Dish */}
                    <div className="w-24 h-6 bg-slate-200 border-2 border-slate-400 rounded-full flex items-center justify-center relative shadow-sm">
                      <div className="w-20 h-4 bg-white/90 rounded-full border border-blue-200" />
                      {/* Sprouted Bean Seeds */}
                      <span className="absolute -top-4 left-1 text-2xl select-none">🌱</span>
                      <span className="absolute -top-3 left-6 text-2xl select-none">🌱</span>
                      <span className="absolute -top-4 right-1 text-2xl select-none">🌱</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-950 mt-1 bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200">
                    Hạt nảy mầm
                  </span>
                </div>

                {/* Beaker of Lime Water changing color */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-28 border-3 border-slate-400 rounded-b-xl relative overflow-hidden bg-slate-50/50 flex flex-col justify-end shadow-sm">
                    {/* Graduations on beaker */}
                    <div className="absolute top-4 left-1 w-2 h-0.5 bg-slate-400" />
                    <div className="absolute top-10 left-1 w-3 h-0.5 bg-slate-400" />
                    <div className="absolute top-16 left-1 w-2 h-0.5 bg-slate-400" />

                    {/* Liquid level */}
                    <div
                      className="w-full transition-all duration-300 relative flex flex-col items-center justify-start pt-1"
                      style={{
                        height: '65%',
                        backgroundColor:
                          turbidityA < 15
                            ? '#e0f2fe' // almost clear cyan
                            : turbidityA < 45
                            ? `rgba(224, 235, 240, ${0.7 + turbidityA * 0.003})` // starting to haze
                            : `rgba(241, 245, 249, ${0.9 + turbidityA * 0.001})`, // milky white
                      }}
                    >
                      {/* Surface film (váng CaCO3) appears after 30 mins */}
                      {turbidityA > 30 && (
                        <div
                          className="w-full h-1 bg-white border-b border-slate-300 transition-opacity"
                          style={{ opacity: (turbidityA - 30) / 70 }}
                        />
                      )}
                      {/* Precipitate particles */}
                      {turbidityA > 20 && (
                        <div className="w-full h-full flex flex-wrap gap-1 p-1 items-center justify-center opacity-80">
                          {Array.from({ length: Math.min(16, Math.floor(turbidityA / 6)) }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full border border-slate-300 animate-pulse" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-cyan-950 mt-1 bg-white/80 px-2 py-0.5 rounded-md border border-cyan-300 text-center">
                    {turbidityA < 10
                      ? 'Nước vôi trong suốt'
                      : turbidityA < 40
                      ? 'Bắt đầu vẩn đục nhẹ'
                      : 'Nước vôi đục trắng (CaCO₃)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-emerald-900 bg-white/80 p-2.5 rounded-xl border border-emerald-200">
            🔎 <strong>Hiện tượng quan sát được:</strong> Khi thời gian tăng dần, nước vôi ở chuông A chuyển từ trong suốt sang vẩn đục màu trắng sữa rõ rệt, trên mặt thoáng hình thành một lớp váng mỏng.
          </p>
        </div>

        {/* Chuông B (Control) */}
        <div className="bg-gradient-to-b from-white via-teal-50/30 to-teal-100/40 rounded-3xl border-2 border-teal-400 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-teal-200">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                B
              </span>
              <div>
                <h3 className="font-black text-base text-teal-950">CHUÔNG B (ĐỐI CHỨNG)</h3>
                <p className="text-xs text-teal-700 font-semibold">Chỉ có cốc nước vôi trong (không có hạt nảy mầm)</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-teal-100 text-teal-900 font-extrabold rounded-full border border-teal-300">
              Độ đục: {turbidityB}%
            </span>
          </div>

          {/* Visual Chamber */}
          <div className="relative my-6 h-80 flex flex-col items-center justify-end">
            <div className="w-64 h-72 border-4 border-teal-400/90 bg-teal-50/20 backdrop-blur-xs rounded-t-full relative flex flex-col items-center justify-end pb-4 shadow-2xl">
              <div className="absolute -top-4 w-10 h-6 bg-teal-300 border-3 border-teal-600 rounded-full" />
              <div className="w-72 h-4 bg-slate-900 rounded-lg absolute -bottom-2 shadow-lg flex items-center justify-center">
                <span className="text-[9px] text-teal-400 font-mono tracking-widest font-bold">KÍN KHÍ TUYỆT ĐỐI</span>
              </div>

              {/* Contents Inside Bell B */}
              <div className="w-full px-4 flex items-end justify-around gap-2 z-10 mb-2">
                {/* Empty Moist Petri Dish */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-6 bg-slate-200 border-2 border-slate-400 rounded-full flex items-center justify-center relative shadow-sm">
                    <div className="w-20 h-4 bg-white/90 rounded-full border border-blue-200" />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-700 mt-1 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                    Đĩa trống (không hạt)
                  </span>
                </div>

                {/* Beaker of Lime Water staying clear */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-28 border-3 border-slate-400 rounded-b-xl relative overflow-hidden bg-slate-50/50 flex flex-col justify-end shadow-sm">
                    <div className="absolute top-4 left-1 w-2 h-0.5 bg-slate-400" />
                    <div className="absolute top-10 left-1 w-3 h-0.5 bg-slate-400" />
                    <div className="absolute top-16 left-1 w-2 h-0.5 bg-slate-400" />

                    <div
                      className="w-full relative"
                      style={{
                        height: '65%',
                        backgroundColor: '#e0f2fe', // perfectly clear cyan-tint
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold text-teal-950 mt-1 bg-white/80 px-2 py-0.5 rounded-md border border-teal-300 text-center">
                    Nước vôi trong suốt
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-teal-900 bg-white/80 p-2.5 rounded-xl border border-teal-200">
            🔎 <strong>Hiện tượng quan sát được:</strong> Nước vôi ở chuông B hầu như không đổi màu, vẫn giữ được độ trong suốt do không có nguồn giải phóng CO₂ lớn bên trong chuông.
          </p>
        </div>
      </div>

      {/* Sub-microscopic Molecular View Modal ("Nhìn thấy điều vô hình") */}
      {isMoleculeMode && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-400/60 rounded-3xl max-w-4xl w-full p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-emerald-300">
                    KÍNH HIỂN VI PHÂN TỬ: NHÌN THẤY ĐIỀU VÔ HÌNH
                  </h3>
                  <p className="text-xs text-slate-400">
                    Mô phỏng trao đổi khí trong quá trình hô hấp tế bào của hạt đậu nảy mầm
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMoleculeMode(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas/SVG Molecular simulation stage */}
            <div className="relative my-4 h-72 sm:h-80 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-slate-800 p-4 overflow-hidden flex items-center justify-between">
              {/* Left: Seed Germination Zoomed */}
              <div className="relative w-48 h-full flex flex-col items-center justify-center border-r border-slate-800/80 pr-2">
                <div className="relative w-28 h-28 rounded-full bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center">
                  <span className="text-5xl animate-bounce">🌱</span>
                  {/* Oxygen absorbed arrow */}
                  <div className="absolute -top-3 left-0 bg-blue-500/20 border border-blue-400 rounded-full px-2 py-0.5 text-[10px] text-blue-300 font-bold flex items-center gap-1">
                    Hút O₂ ➔
                  </div>
                  {/* CO2 released arrow */}
                  <div className="absolute -bottom-3 right-0 bg-rose-500/20 border border-rose-400 rounded-full px-2 py-0.5 text-[10px] text-rose-300 font-bold flex items-center gap-1">
                    ➔ Thải CO₂
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300 mt-2">Tế bào phôi hạt đậu</span>
                <span className="text-[10px] text-slate-400">Đang hô hấp tế bào mạnh mẽ</span>
              </div>

              {/* Center: Flying Gas Molecules */}
              <div className="flex-1 h-full relative px-2">
                {/* Oxygen molecules flowing INTO seed */}
                <div className="absolute inset-x-0 top-6 flex items-center justify-around pointer-events-none">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={`o2-${i}`}
                      className="flex items-center gap-0.5 bg-blue-900/60 border border-blue-400 rounded-full px-2 py-1 shadow-md shadow-blue-500/20"
                      style={{ animation: `pulse ${2 + i * 0.5}s infinite` }}
                    >
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                      <span className="text-[10px] font-bold text-blue-200 ml-1">O₂</span>
                    </div>
                  ))}
                </div>

                {/* Arrow indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-slate-600 font-mono text-xs flex items-center gap-2">
                    <span className="text-rose-400">CO₂ khuếch tán sang nước vôi ➔</span>
                  </div>
                </div>

                {/* Carbon Dioxide molecules flowing OUT to lime water */}
                <div className="absolute inset-x-0 bottom-10 flex items-center justify-around pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={`co2-${i}`}
                      className="flex items-center gap-0.5 bg-rose-950/80 border border-rose-500 rounded-full px-2.5 py-1 shadow-md shadow-rose-500/30"
                      style={{ animation: `bounce ${1.5 + i * 0.3}s infinite` }}
                    >
                      {/* Oxygen atom */}
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      {/* Carbon atom */}
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-500" />
                      {/* Oxygen atom */}
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <span className="text-[10px] font-bold text-rose-300 ml-1 font-mono">CO₂</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Lime water reaction */}
              <div className="relative w-52 h-full flex flex-col items-center justify-center border-l border-slate-800/80 pl-2">
                <div className="w-32 h-36 border-2 border-cyan-400 rounded-b-2xl bg-cyan-950/40 p-2 flex flex-col justify-end relative shadow-lg">
                  <div className="text-[9px] text-cyan-300 font-mono text-center mb-1">
                    Dung dịch Ca(OH)₂
                  </div>
                  {/* Floating precipitate crystals */}
                  <div className="w-full h-24 bg-cyan-900/40 rounded-b-xl p-1 flex flex-wrap gap-1.5 items-center justify-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                      <div
                        key={c}
                        className="w-2.5 h-2.5 bg-white rounded-full shadow-md shadow-white/50 border border-slate-300 animate-pulse"
                        title="Hạt kết tủa Canxi Cacbonat CaCO3"
                      />
                    ))}
                  </div>
                  <div className="text-[9px] text-white font-bold text-center mt-1 bg-slate-800/80 py-0.5 rounded">
                    Vẩn đục CaCO₃
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-300 mt-2">Cốc nước vôi trong</span>
              </div>
            </div>

            {/* Scientific disclaimer as required */}
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 leading-relaxed">
              📌 <strong>Lưu ý khoa học:</strong> Trong tự nhiên, phân tử oxygen (O₂) và carbon dioxide (CO₂) là các chất khí hoàn toàn không màu, không nhìn thấy được bằng mắt thường. Mô phỏng sử dụng các khối màu để giúp học sinh dễ dàng hình dung dòng chuyển dịch của các chất khí trong quá trình hạt hô hấp.
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsMoleculeMode(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
              >
                Trở lại phòng thí nghiệm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal when 60 minutes reached */}
      {showComparison && (
        <div className="mt-8 bg-white rounded-3xl border-2 border-emerald-300 p-6 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-emerald-100">
            <span className="text-2xl">⚖️</span>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                ĐỐI CHIẾU: DỰ ĐOÁN CỦA EM vs KẾT QUẢ THỰC NGHIỆM
              </h3>
              <p className="text-xs text-slate-500">So sánh giả thuyết ban đầu với bằng chứng quan sát sau 60 phút</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Jar A */}
            <div className={`p-4 rounded-2xl border-2 ${isJarACorrect ? 'border-emerald-300 bg-emerald-50/60' : 'border-amber-300 bg-amber-50/60'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900">Chuông A (Có hạt nảy mầm)</span>
                {isJarACorrect ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Đúng như dự đoán!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Khác với dự đoán ban đầu
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                • <strong>Dự đoán của em:</strong>{' '}
                {userPredictions.jarA === 'A_turbid'
                  ? 'Xuất hiện vẩn đục màu trắng sữa'
                  : userPredictions.jarA === 'A_no_change'
                  ? 'Hầu như không thay đổi'
                  : userPredictions.jarA === 'A_green'
                  ? 'Chuyển màu xanh'
                  : 'Biến mất'}
              </p>
              <p className="text-xs text-emerald-900 font-bold mt-1">
                • <strong>Kết quả thực tế:</strong> Nước vôi xuất hiện vẩn đục trắng đục rõ rệt và tạo váng canxi cacbonat do khí CO₂ từ hạt nảy mầm thoát ra.
              </p>
            </div>

            {/* Box Jar B */}
            <div className={`p-4 rounded-2xl border-2 ${isJarBCorrect ? 'border-teal-300 bg-teal-50/60' : 'border-amber-300 bg-amber-50/60'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900">Chuông B (Đối chứng - Không hạt)</span>
                {isJarBCorrect ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> Đúng như dự đoán!
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Khác với dự đoán ban đầu
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                • <strong>Dự đoán của em:</strong>{' '}
                {userPredictions.jarB === 'B_no_change'
                  ? 'Hầu như không thay đổi (vẫn trong suốt)'
                  : userPredictions.jarB === 'B_turbid'
                  ? 'Xuất hiện vẩn đục trắng'
                  : 'Khác'}
              </p>
              <p className="text-xs text-teal-900 font-bold mt-1">
                • <strong>Kết quả thực tế:</strong> Nước vôi trong chuông B hầu như không thay đổi, vẫn giữ nguyên độ trong suốt.
              </p>
            </div>
          </div>

          {/* Teacher encouragement */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {isJarACorrect && isJarBCorrect ? (
              <p className="text-emerald-900 font-medium">
                🌟 <strong>Tuyệt vời!</strong> Dự đoán của em hoàn toàn trùng khớp với bằng chứng thực nghiệm thu được. Em đã tư duy như một nhà thực vật học thực thụ! (+15 điểm quan sát)
              </p>
            ) : (
              <p className="text-slate-800 font-medium">
                💡 <strong>Lời nhắn từ Giáo sư Mầm Xanh:</strong> “Dự đoán chưa trùng với kết quả? Đừng lo lắng! Trong khoa học, điều này hoàn toàn bình thường và đây chính là lí do vì sao nhà khoa học cần phải làm thí nghiệm để kiểm chứng sự thật khách quan!” (+15 điểm quan sát)
              </p>
            )}
          </div>

          {/* Next Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                onNext();
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-teal-700/25 transition-all flex items-center gap-2 cursor-pointer transform hover:scale-[1.02]"
            >
              Tiếp tục: Màn 5 – Thám tử khoa học
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
