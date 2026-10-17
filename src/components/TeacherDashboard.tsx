import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Users,
  Edit3,
  PlusCircle,
  Trash2,
  Download,
  Upload,
  Save,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  LabLessonConfig,
  DetectiveCaseConfig,
  StudentSubmissionRecord,
} from '../types';
import {
  PRESET_KHTN7_TEMPLATES,
  saveLessonConfig,
  resetLessonConfig,
  getStoredSubmissions,
  clearAllSubmissions,
} from '../utils/defaultConfig';
import { sound } from '../utils/sound';

interface TeacherDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: LabLessonConfig;
  onConfigChange: (newConfig: LabLessonConfig) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onConfigChange,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'results' | 'cases' | 'templates'>('results');

  // Submissions state
  const [submissions, setSubmissions] = useState<StudentSubmissionRecord[]>(() =>
    getStoredSubmissions()
  );
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Editable config state
  const [config, setConfig] = useState<LabLessonConfig>(currentConfig);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // New detective case form state
  const [showAddCaseModal, setShowAddCaseModal] = useState<boolean>(false);
  const [newCaseTitle, setNewCaseTitle] = useState<string>('');
  const [newCaseScenario, setNewCaseScenario] = useState<string>('');
  const [newCaseHint, setNewCaseHint] = useState<string>('');
  const [newCaseCorrectText, setNewCaseCorrectText] = useState<string>('');
  const [newCaseCorrectExpl, setNewCaseCorrectExpl] = useState<string>('');
  const [newCaseWrongText, setNewCaseWrongText] = useState<string>('');

  if (!isOpen) return null;

  // Handle password submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '1234') {
      sound.playSuccess();
      setIsAuthenticated(true);
      setAuthError('');
      setSubmissions(getStoredSubmissions());
    } else {
      sound.playGentleWrong();
      setAuthError('Mật khẩu không chính xác! (Gợi ý: 1234)');
    }
  };

  const handleSaveConfig = () => {
    sound.playSuccess();
    saveLessonConfig(config);
    onConfigChange(config);
    setSaveSuccessMsg('Đã lưu cấu hình bài học thành công!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục cấu hình về nội dung gốc Bài 27: Hô hấp ở thực vật?')) {
      sound.playClick();
      const def = resetLessonConfig();
      setConfig(def);
      onConfigChange(def);
      setSaveSuccessMsg('Đã khôi phục cài đặt gốc!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleApplyPreset = (presetKey: string) => {
    sound.playClick();
    const preset = PRESET_KHTN7_TEMPLATES[presetKey];
    if (preset) {
      if (window.confirm(`Áp dụng mẫu bài học "${preset.lessonCode} - ${preset.lessonName}"?`)) {
        setConfig(preset);
        saveLessonConfig(preset);
        onConfigChange(preset);
        setSaveSuccessMsg(`Đã chuyển sang mẫu: ${preset.lessonName}`);
        setTimeout(() => setSaveSuccessMsg(''), 3000);
      }
    }
  };

  const handleDeleteCase = (caseId: number) => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa tình huống thí nghiệm này?')) {
      sound.playClick();
      const updated = {
        ...config,
        detectiveCases: config.detectiveCases.filter((c) => c.id !== caseId),
      };
      setConfig(updated);
    }
  };

  const handleAddNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle || !newCaseScenario || !newCaseCorrectText) {
      alert('Vui lòng điền đầy đủ tiêu đề, mô tả và đáp án chính xác!');
      return;
    }

    const newId = config.detectiveCases.length > 0
      ? Math.max(...config.detectiveCases.map((c) => c.id)) + 1
      : 1;

    const newCase: DetectiveCaseConfig = {
      id: newId,
      title: newCaseTitle,
      scenarioDesc: newCaseScenario,
      pedagogicalHint: newCaseHint || 'Hãy chú ý xem yếu tố nào đang bị thiếu hoặc dư thừa.',
      options: [
        {
          id: `case_${newId}_correct`,
          text: newCaseCorrectText,
          isCorrect: true,
          explanation: newCaseCorrectExpl || 'Chính xác! Em đã hiểu đúng bản chất khoa học.',
        },
        {
          id: `case_${newId}_wrong1`,
          text: newCaseWrongText || 'Lỗi này không ảnh hưởng gì tới thí nghiệm.',
          isCorrect: false,
          explanation: 'Chưa chính xác. Lỗi này làm sai lệch điều kiện thí nghiệm.',
        },
      ],
    };

    const updated = {
      ...config,
      detectiveCases: [...config.detectiveCases, newCase],
    };

    setConfig(updated);
    setShowAddCaseModal(false);
    setNewCaseTitle('');
    setNewCaseScenario('');
    setNewCaseHint('');
    setNewCaseCorrectText('');
    setNewCaseCorrectExpl('');
    setNewCaseWrongText('');
    sound.playSuccess();
  };

  const handleExportJson = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `khtn7-lab-${config.lessonCode.replace(/\s+/g, '')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.lessonName && parsed.prepSteps) {
          setConfig(parsed);
          saveLessonConfig(parsed);
          onConfigChange(parsed);
          sound.playSuccess();
          alert('Đã nhập dữ liệu bài học thành công!');
        } else {
          alert('Tệp JSON không đúng định dạng Lab KHTN 7!');
        }
      } catch {
        alert('Không thể đọc tệp JSON. Vui lòng kiểm tra lại!');
      }
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    sound.playClick();
    if (submissions.length === 0) {
      alert('Chưa có học sinh nào hoàn thành bài thực hành!');
      return;
    }

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'STT,Họ và tên,Lớp,Thời gian,Tổng điểm,Chuẩn bị,Lắp đặt,Dự đoán,Quan sát,Thám tử,Kết luận,Xếp loại,Kết luận của học sinh\n';

    submissions.forEach((sub, idx) => {
      const row = [
        idx + 1,
        `"${sub.studentName}"`,
        `"${sub.studentClass}"`,
        `"${sub.completedAt}"`,
        sub.scoreTotal,
        sub.scoreBreakdown.prep,
        sub.scoreBreakdown.assembly,
        sub.scoreBreakdown.predict,
        sub.scoreBreakdown.simulate,
        sub.scoreBreakdown.detective,
        sub.scoreBreakdown.conclusion,
        `"${sub.badgeTitle}"`,
        `"${(sub.userConclusion || '').replace(/"/g, '""')}"`,
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ket-qua-thuc-hanh-KHTN7-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleClearHistory = () => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa toàn bộ lịch sử nộp bài của học sinh không?')) {
      sound.playClick();
      clearAllSubmissions();
      setSubmissions([]);
    }
  };

  // Filtered submissions
  const classesList = Array.from(new Set(submissions.map((s) => s.studentClass))).filter(Boolean);
  const filteredSubmissions = submissions.filter((s) => {
    const matchName = s.studentName.toLowerCase().includes(searchFilter.toLowerCase());
    const matchClass = selectedClassFilter === 'all' || s.studentClass === selectedClassFilter;
    return matchName && matchClass;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl border-2 border-emerald-500 max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              {isAuthenticated ? <Unlock className="w-5 h-5 text-emerald-300" /> : <Lock className="w-5 h-5 text-amber-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">CHẾ ĐỘ GIÁO VIÊN (QUẢN TRỊ VIÊN)</h3>
                <span className="text-[11px] bg-emerald-500/30 border border-emerald-400/50 px-2 py-0.5 rounded-full font-bold">
                  KHTN 7
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Tự sửa câu hỏi, thêm tình huống thí nghiệm, xem kết quả học sinh & nhân bản bài học
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl mb-4 shadow-inner">
              🔐
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Xác thực quyền Giáo viên</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
              Vui lòng nhập mã bảo vệ dành riêng cho Giáo viên bộ môn Khoa học tự nhiên để truy cập hệ thống quản trị.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="Nhập mật khẩu (1234)"
                autoFocus
                className="w-full px-4 py-3 text-center tracking-widest text-lg font-black bg-slate-50 border-2 border-slate-300 rounded-2xl focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />

              {authError && <p className="text-xs font-bold text-rose-600">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Mở khóa quản trị
              </button>
            </form>
            <p className="mt-4 text-[11px] text-slate-400">
              * Mật khẩu mặc định: <span className="font-bold text-slate-700">1234</span>
            </p>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('results');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'results'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                📊 KẾT QUẢ HỌC SINH ({submissions.length})
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('cases');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'cases'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                🛠 SỬA CÂU HỎI & TÌNH HUỐNG ({config.detectiveCases.length})
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('templates');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                🧪 TẠO LAB KHTN 7 MỚI & XUẤT DỮ LIỆU
              </button>
            </div>

            {/* Success notification banner */}
            {saveSuccessMsg && (
              <div className="bg-emerald-100 border-b border-emerald-300 px-6 py-2 text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {saveSuccessMsg}
              </div>
            )}

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: STUDENT RESULTS */}
              {activeTab === 'results' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Tìm theo tên học sinh..."
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600 w-full sm:w-56"
                      />
                      <select
                        value={selectedClassFilter}
                        onChange={(e) => setSelectedClassFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      >
                        <option value="all">Tất cả lớp ({submissions.length})</option>
                        {classesList.map((cls) => (
                          <option key={cls} value={cls}>
                            Lớp {cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleExportCSV}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Xuất Excel (CSV)
                      </button>
                      <button
                        onClick={handleClearHistory}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa lịch sử
                      </button>
                    </div>
                  </div>

                  {/* Results Table */}
                  {filteredSubmissions.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-slate-500 text-sm font-semibold">
                        Chưa có học sinh nào hoàn thành bài thực hành hoặc không tìm thấy kết quả phù hợp.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Khi học sinh hoàn tất Màn 6 và bấm hoàn thành, kết quả sẽ tự động lưu vào đây.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                            <th className="p-3">Học sinh</th>
                            <th className="p-3">Lớp</th>
                            <th className="p-3">Thời gian nộp</th>
                            <th className="p-3 text-center">Tổng điểm</th>
                            <th className="p-3">Huy hiệu</th>
                            <th className="p-3">Kết luận khoa học</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredSubmissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-bold text-slate-900">{sub.studentName}</td>
                              <td className="p-3 font-semibold text-slate-600">{sub.studentClass}</td>
                              <td className="p-3 text-slate-500">{sub.completedAt}</td>
                              <td className="p-3 text-center">
                                <span className="px-2.5 py-1 rounded-full font-black text-xs bg-emerald-100 text-emerald-800">
                                  {sub.scoreTotal}/100
                                </span>
                              </td>
                              <td className="p-3 font-bold text-emerald-900">{sub.badgeTitle}</td>
                              <td className="p-3 text-slate-600 italic max-w-xs truncate" title={sub.userConclusion}>
                                "{sub.userConclusion || 'Chưa ghi'}"
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EDIT QUESTIONS & DETECTIVE CASES */}
              {activeTab === 'cases' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
                    <div>
                      <h4 className="font-black text-sm text-slate-900">
                        DANH SÁCH TÌNH HUỐNG THÍ NGHIỆM (MÀN 5)
                      </h4>
                      <p className="text-xs text-slate-500">
                        Thầy/Cô có thể chỉnh sửa nội dung, gợi ý sư phạm hoặc thêm các tình huống lỗi mới
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAddCaseModal(true)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Thêm tình huống mới
                      </button>
                      <button
                        onClick={handleSaveConfig}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>

                  {/* List of Detective Cases */}
                  <div className="space-y-4">
                    {config.detectiveCases.map((c, cIdx) => (
                      <div
                        key={c.id}
                        className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                            Tình huống #{cIdx + 1}
                          </span>
                          <button
                            onClick={() => handleDeleteCase(c.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa tình huống
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Tiêu đề vụ án:</label>
                          <input
                            type="text"
                            value={c.title}
                            onChange={(e) => {
                              const updated = [...config.detectiveCases];
                              updated[cIdx].title = e.target.value;
                              setConfig({ ...config, detectiveCases: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Mô tả tình huống lỗi:</label>
                          <textarea
                            rows={2}
                            value={c.scenarioDesc}
                            onChange={(e) => {
                              const updated = [...config.detectiveCases];
                              updated[cIdx].scenarioDesc = e.target.value;
                              setConfig({ ...config, detectiveCases: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Gợi ý suy ngẫm sư phạm:</label>
                          <input
                            type="text"
                            value={c.pedagogicalHint}
                            onChange={(e) => {
                              const updated = [...config.detectiveCases];
                              updated[cIdx].pedagogicalHint = e.target.value;
                              setConfig({ ...config, detectiveCases: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-emerald-900"
                          />
                        </div>

                        {/* Edit options */}
                        <div className="pt-2 border-t border-slate-200">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Phương án lựa chọn:</label>
                          {c.options.map((opt, optIdx) => (
                            <div key={opt.id} className="flex items-center gap-2 mb-1.5">
                              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${opt.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                                {opt.isCorrect ? 'ĐÚNG' : 'SAI'}
                              </span>
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const updatedCases = [...config.detectiveCases];
                                  updatedCases[cIdx].options[optIdx].text = e.target.value;
                                  setConfig({ ...config, detectiveCases: updatedCases });
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-800"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Case Modal */}
                  {showAddCaseModal && (
                    <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border-2 border-amber-400">
                        <div className="flex items-center justify-between pb-2 border-b">
                          <h4 className="font-black text-sm text-slate-900">➕ THÊM TÌNH HUỐNG THÍ NGHIỆM MỚI</h4>
                          <button onClick={() => setShowAddCaseModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleAddNewCase} className="space-y-3 text-xs">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Tiêu đề vụ án:</label>
                            <input
                              type="text"
                              required
                              value={newCaseTitle}
                              onChange={(e) => setNewCaseTitle(e.target.value)}
                              placeholder="Ví dụ: Vụ án 7: Dùng nước vôi đục sẵn..."
                              className="w-full px-3 py-2 border rounded-xl font-bold"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Mô tả tình huống lỗi:</label>
                            <textarea
                              rows={2}
                              required
                              value={newCaseScenario}
                              onChange={(e) => setNewCaseScenario(e.target.value)}
                              placeholder="Học sinh vô tình để hở cốc nước vôi từ hôm trước khiến nước vôi đã bị đục sẵn..."
                              className="w-full px-3 py-2 border rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">Gợi ý sư phạm:</label>
                            <input
                              type="text"
                              value={newCaseHint}
                              onChange={(e) => setNewCaseHint(e.target.value)}
                              placeholder="Nước vôi đã đục sẵn thì có còn phân biệt được sự thay đổi không?"
                              className="w-full px-3 py-2 border rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-emerald-800 mb-1">Đáp án đúng (nguyên nhân khoa học):</label>
                            <input
                              type="text"
                              required
                              value={newCaseCorrectText}
                              onChange={(e) => setNewCaseCorrectText(e.target.value)}
                              placeholder="Nước vôi đục sẵn làm mất tính chính xác của chất chỉ thị nhận biết CO2."
                              className="w-full px-3 py-2 border border-emerald-300 bg-emerald-50 rounded-xl font-bold text-emerald-950"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-600 mb-1">Đáp án gây nhiễu (sai):</label>
                            <input
                              type="text"
                              value={newCaseWrongText}
                              onChange={(e) => setNewCaseWrongText(e.target.value)}
                              placeholder="Nước vôi đục sẵn sẽ làm hạt nảy mầm nhanh hơn."
                              className="w-full px-3 py-2 border rounded-xl"
                            />
                          </div>

                          <div className="pt-2 flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowAddCaseModal(false)}
                              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl shadow-md"
                            >
                              Thêm tình huống
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TEMPLATES & EXPORT FOR OTHER EXPERIMENTS */}
              {activeTab === 'templates' && (
                <div className="space-y-6">
                  {/* Preset Templates */}
                  <div>
                    <h4 className="font-black text-sm text-slate-900 mb-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      MẪU THÍ NGHIỆM KHOA HỌC TỰ NHIÊN 7 CÓ SẴN:
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Chọn một mẫu có sẵn để chuyển đổi toàn bộ nội dung bài thực hành sang chủ đề mới:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        onClick={() => handleApplyPreset('ho_hap_hat')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          config.lessonCode === 'Bài 27'
                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                            : 'border-slate-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Bài 27
                        </span>
                        <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1">
                          Hô hấp ở thực vật
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">Bí mật hơi thở của hạt đậu nảy mầm</p>
                      </div>

                      <div
                        onClick={() => handleApplyPreset('quang_hop_la')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          config.lessonCode === 'Bài 23'
                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                            : 'border-slate-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        <span className="text-xs font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          Bài 23
                        </span>
                        <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1">
                          Quang hợp ở cây xanh
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">Nhà máy tinh bột và khí oxygen</p>
                      </div>

                      <div
                        onClick={() => handleApplyPreset('thoat_hoi_nuoc')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                          config.lessonCode === 'Bài 28'
                            ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                            : 'border-slate-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        <span className="text-xs font-black text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                          Bài 28
                        </span>
                        <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 mt-1">
                          Thoát hơi nước ở lá
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">Hơi nước ngưng tụ qua túi nilon</p>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Meta Edit */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <h5 className="font-black text-xs uppercase tracking-wider text-slate-700">
                      Tùy biến tiêu đề bài học hiện tại:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Mã bài học:</label>
                        <input
                          type="text"
                          value={config.lessonCode}
                          onChange={(e) => setConfig({ ...config, lessonCode: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Tên bài học:</label>
                        <input
                          type="text"
                          value={config.lessonName}
                          onChange={(e) => setConfig({ ...config, lessonName: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Tiêu đề phụ:</label>
                        <input
                          type="text"
                          value={config.subtitle}
                          onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Mục tiêu chủ đề:</label>
                        <input
                          type="text"
                          value={config.topic}
                          onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Import / Export JSON & Standalone HTML */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h5 className="font-black text-sm text-emerald-950">XUẤT / NHẬP CẤU HÌNH BÀI HỌC</h5>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Lưu file cấu hình JSON để chia sẻ với đồng nghiệp hoặc khôi phục bất cứ lúc nào.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleExportJson}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Xuất file JSON
                      </button>

                      <label className="px-3.5 py-2 bg-white hover:bg-slate-50 text-emerald-900 border border-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer">
                        <Upload className="w-4 h-4 text-emerald-600" />
                        Nhập file JSON
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJson}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={handleResetToDefault}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Khôi phục gốc Bài 27"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Mặc định
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Chế độ Giáo viên • Đang hoạt động với bảo mật PIN: 1234
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Đóng bảng điều khiển
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
