import React, { useState } from 'react';
import { Award, Printer, RotateCcw, CheckCircle, Download, FileText, User } from 'lucide-react';
import { LabState } from '../types';
import { sound } from '../utils/sound';

interface Stage7ReportProps {
  labState: LabState;
  onRestart: () => void;
  onUpdateStudentInfo: (name: string, studentClass: string) => void;
  onDownloadHtml: () => void;
}

export const Stage7Report: React.FC<Stage7ReportProps> = ({
  labState,
  onRestart,
  onUpdateStudentInfo,
  onDownloadHtml,
}) => {
  const [name, setName] = useState(labState.studentName || 'Học sinh');
  const [studentClass, setStudentClass] = useState(labState.studentClass || '7A');

  const totalScore =
    labState.score.prep +
    labState.score.assembly +
    labState.score.predict +
    labState.score.simulate +
    labState.score.detective +
    labState.score.conclusion;

  // Badge tier
  let badgeTitle = '🔬 HÃY THỬ LẠI THÍ NGHIỆM';
  let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
  let badgeIcon = '🔬';

  if (totalScore >= 90) {
    badgeTitle = '🏅 NHÀ KHOA HỌC THỰC VẬT XUẤT SẮC';
    badgeColor = 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border-amber-600 shadow-amber-500/25';
    badgeIcon = '🏅';
  } else if (totalScore >= 75) {
    badgeTitle = '🌟 NHÀ NGHIÊN CỨU TÀI NĂNG';
    badgeColor = 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-teal-700 shadow-teal-500/25';
    badgeIcon = '🌟';
  } else if (totalScore >= 60) {
    badgeTitle = '🌱 NHÀ KHOA HỌC TẬP SỰ';
    badgeColor = 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-700 shadow-green-500/25';
    badgeIcon = '🌱';
  }

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleSaveInfo = () => {
    sound.playClick();
    onUpdateStudentInfo(name, studentClass);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Congratulations Card (No print header styling) */}
      <div className="no-print bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-10 text-white text-center shadow-2xl shadow-emerald-950/20 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-3xl border border-white/30 text-5xl mb-3 shadow-inner">
          {badgeIcon}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
          🏆 CHÚC MỪNG EM ĐÃ HOÀN THÀNH!
        </h1>
        <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto mb-6">
          Em đã hoàn thành xuất sắc các chặng thử thách của phòng thí nghiệm số{' '}
          <strong className="text-white">“BÍ MẬT HƠI THỞ CỦA HẠT”</strong> (Bài 27 – KHTN 7).
        </p>

        {/* Badge Banner */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white text-slate-900 font-black text-sm sm:text-lg shadow-lg mb-6">
          <span>{badgeIcon}</span>
          <span>{badgeTitle}</span>
        </div>

        {/* Score Summary */}
        <div className="max-w-xs mx-auto p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-200 block">
            TỔNG ĐIỂM ĐẠT ĐƯỢC
          </span>
          <div className="text-4xl sm:text-5xl font-black text-amber-300 mt-1">
            {totalScore}<span className="text-xl sm:text-2xl text-white font-bold">/100</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            🖨 IN KẾT QUẢ / LƯU PDF
          </button>
          <button
            onClick={onDownloadHtml}
            className="px-5 py-3 bg-emerald-500/30 hover:bg-emerald-500/40 text-white font-extrabold text-sm rounded-xl border border-white/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Tải file HTML độc lập
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="px-5 py-3 bg-teal-800/60 hover:bg-teal-800 text-teal-100 font-extrabold text-sm rounded-xl border border-teal-500/40 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Thực hiện lại
          </button>
        </div>
      </div>

      {/* Official Lab Report Sheet (Designed for A4 Printing & Viewing) */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-10 shadow-xl text-slate-900 print:shadow-none print:border-none print:p-0">
        {/* Report Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>TRƯỜNG THCS: ....................................................</span>
            <span>MÔN: KHOA HỌC TỰ NHIÊN 7</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-tight">
            PHIẾU BÁO CÁO THỰC HÀNH SỐ
          </h2>
          <h3 className="text-base sm:text-lg font-extrabold text-emerald-700 mt-0.5">
            BÀI 27: THỰC HÀNH HÔ HẤP Ở THỰC VẬT
          </h3>
          <p className="text-xs text-slate-500 mt-1 italic">
            Chủ đề: Chứng minh hạt đang nảy mầm hô hấp thải khí Carbon Dioxide (CO₂)
          </p>
        </div>

        {/* Student Information section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase">Họ và tên học sinh:</label>
            <div className="no-print mt-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSaveInfo}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-sm text-slate-900"
              />
            </div>
            <div className="print-only hidden font-bold text-base text-slate-900 mt-1">{name}</div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase">Lớp:</label>
            <div className="no-print mt-1">
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                onBlur={handleSaveInfo}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-sm text-slate-900"
              />
            </div>
            <div className="print-only hidden font-bold text-base text-slate-900 mt-1">{studentClass}</div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase">Thời gian thực hành:</label>
            <p className="font-semibold text-sm text-slate-800 mt-2">
              {labState.completedAt || new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        </div>

        {/* Score Breakdown Table */}
        <div className="mb-6">
          <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            1. BẢNG PHÂN BỐ ĐIỂM ĐÁNH GIÁ NĂNG LỰC THỰC HÀNH
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="p-2 border border-slate-200 font-bold">Chặng thử thách</th>
                  <th className="p-2 border border-slate-200 font-bold">Nội dung thao tác</th>
                  <th className="p-2 border border-slate-200 font-bold text-center">Điểm tối đa</th>
                  <th className="p-2 border border-slate-200 font-bold text-center">Điểm đạt được</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">Màn 1: Chuẩn bị mẫu</td>
                  <td className="p-2 border border-slate-200">Trình tự chọn, ngâm nước ấm, rửa, ủ hạt nảy mầm</td>
                  <td className="p-2 border border-slate-200 text-center font-bold">10đ</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-emerald-700">
                    {labState.score.prep}đ
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">Màn 2: Lắp đặt</td>
                  <td className="p-2 border border-slate-200">Lắp Chuông A thí nghiệm và Chuông B đối chứng kín khí</td>
                  <td className="p-2 border border-slate-200 text-center font-bold">20đ</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-emerald-700">
                    {labState.score.assembly}đ
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">Màn 3: Dự đoán</td>
                  <td className="p-2 border border-slate-200">Thiết lập giả thuyết khoa học ban đầu</td>
                  <td className="p-2 border border-slate-200 text-center font-bold">10đ</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-emerald-700">
                    {labState.score.predict}đ
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">Màn 4: Quan sát</td>
                  <td className="p-2 border border-slate-200">Mô phỏng 60 phút, quan sát phân tử O₂/CO₂ và kết tủa</td>
                  <td className="p-2 border border-slate-200 text-center font-bold">15đ</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-emerald-700">
                    {labState.score.simulate}đ
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">Màn 5: Thám tử lỗi</td>
                  <td className="p-2 border border-slate-200">Phát hiện và giải thích 6 lỗi thí nghiệm thường gặp</td>
                  <td className="p-2 border border-slate-200 text-center font-bold">30đ</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-emerald-700">
                    {labState.score.detective}đ
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold">Màn 6: Kết luận & Vận dụng</td>
                  <td className="p-2 border border-slate-200">Bảng số liệu, kết luận khoa học và ẩm thực đời sống</td>
                  <td className="p-2 border border-slate-200 text-center font-bold">15đ</td>
                  <td className="p-2 border border-slate-200 text-center font-black text-emerald-700">
                    {labState.score.conclusion}đ
                  </td>
                </tr>
                <tr className="bg-emerald-50 text-emerald-950 font-black">
                  <td colSpan={2} className="p-2.5 border border-slate-200 text-right uppercase">
                    TỔNG ĐIỂM ĐÁNH GIÁ:
                  </td>
                  <td className="p-2.5 border border-slate-200 text-center text-sm">100đ</td>
                  <td className="p-2.5 border border-slate-200 text-center text-base text-emerald-800">
                    {totalScore} / 100đ
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison: Prediction vs Observation */}
        <div className="mb-6">
          <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            2. ĐỐI CHIẾU DỰ ĐOÁN VÀ THỰC NGHIỆM
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-emerald-900 block mb-1">• CHUÔNG A (Hạt nảy mầm):</span>
              <p className="text-slate-600">
                - Dự đoán ban đầu: <strong>{labState.predictions.jarA === 'A_turbid' ? 'Xuất hiện vẩn đục trắng' : 'Khác'}</strong>
              </p>
              <p className="text-slate-800 font-semibold mt-0.5">
                - Kết quả quan sát: Nước vôi trong chuyển thành vẩn đục trắng đục rõ rệt, có váng mỏng canxi cacbonat (CaCO₃).
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-teal-900 block mb-1">• CHUÔNG B (Đối chứng):</span>
              <p className="text-slate-600">
                - Dự đoán ban đầu: <strong>{labState.predictions.jarB === 'B_no_change' ? 'Hầu như không thay đổi' : 'Khác'}</strong>
              </p>
              <p className="text-slate-800 font-semibold mt-0.5">
                - Kết quả quan sát: Nước vôi trong chuông B hầu như không thay đổi, vẫn giữ nguyên độ trong suốt.
              </p>
            </div>
          </div>
        </div>

        {/* Student Conclusion */}
        <div className="mb-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <h4 className="font-black uppercase tracking-wider text-slate-700 mb-1">
            3. KẾT LUẬN CỦA HỌC SINH:
          </h4>
          <p className="italic font-medium text-slate-900 leading-relaxed">
            "{labState.userConclusion || 'Hạt đang nảy mầm thực hiện quá trình hô hấp tế bào, sử dụng khí oxygen và thải ra khí carbon dioxide (CO₂). Khí CO₂ phản ứng làm vẩn đục cốc nước vôi trong.'}"
          </p>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-4 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-700">
          <div>
            <p className="font-bold uppercase">HỌC SINH THỰC HIỆN</p>
            <p className="italic text-[11px] text-slate-400 mt-1">(Ký và ghi rõ họ tên)</p>
            <div className="h-16 flex items-center justify-center font-bold text-slate-800">
              {name}
            </div>
          </div>
          <div>
            <p className="font-bold uppercase">GIÁO VIÊN / GS. MẦM XANH</p>
            <p className="italic text-[11px] text-slate-400 mt-1">(Xác nhận đánh giá)</p>
            <div className="h-16 flex flex-col items-center justify-center">
              <span className="font-black text-emerald-800">{badgeTitle}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">BioLab7-Verified-Pass</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
