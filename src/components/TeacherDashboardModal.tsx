import React, { useState } from 'react';
import {
  X, Lock, Key, Users, Sliders, FileText, Download, Upload, Plus, Trash2,
  CheckCircle2, RefreshCw, Eye, BookOpen, AlertCircle
} from 'lucide-react';
import { LabCustomConfig, StudentSubmission, ConfigurableDetectiveCase } from '../types';
import { LabStorage, PRESET_BAI_23_QUANG_HOP, PRESET_BAI_28_THOAT_HOI_NUOC, DEFAULT_LAB_CONFIG } from '../utils/defaultLabConfig';
import { sound } from '../utils/sound';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: LabCustomConfig;
  onSaveConfig: (newConfig: LabCustomConfig) => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'submissions' | 'cases' | 'questions' | 'presets' | 'password'>('submissions');

  // Submissions state
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => LabStorage.getSubmissions());
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchName, setSearchName] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<StudentSubmission | null>(null);

  // Config editor state (cloned from currentConfig)
  const [configDraft, setConfigDraft] = useState<LabCustomConfig>(currentConfig);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Password change state
  const [newPassword, setNewPassword] = useState<string>('');
  const [pwdMsg, setPwdMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPwd = LabStorage.getTeacherPassword();
    if (passwordInput === correctPwd || passwordInput === 'giaovien2018') {
      sound.playSuccess();
      setIsAuthenticated(true);
      setAuthError('');
      setSubmissions(LabStorage.getSubmissions());
    } else {
      sound.playGentleWrong();
      setAuthError('Mật khẩu chưa đúng. Gợi ý: mật khẩu mặc định là giaovien2018');
    }
  };

  const handleSeedDemoSubmissions = () => {
    sound.playSuccess();
    const demos = LabStorage.seedDemoSubmissions();
    setSubmissions(demos);
  };

  const handleClearSubmissions = () => {
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa toàn bộ kết quả của học sinh không?')) {
      sound.playClick();
      LabStorage.clearSubmissions();
      setSubmissions([]);
    }
  };

  const exportSubmissionsToCSV = () => {
    sound.playClick();
    if (submissions.length === 0) {
      alert('Chưa có dữ liệu bài làm của học sinh để xuất!');
      return;
    }
    const headers = ['Họ và tên', 'Lớp', 'Thời gian nộp', 'Tổng điểm', 'Chuẩn bị (10đ)', 'Lắp đặt (20đ)', 'Dự đoán (10đ)', 'Quan sát (15đ)', 'Thám tử (30đ)', 'Kết luận (15đ)', 'Huy hiệu', 'Kết luận của học sinh'];
    const rows = submissions.map((s) => [
      `"${s.name}"`,
      `"${s.studentClass}"`,
      `"${s.completedAt}"`,
      s.totalScore,
      s.scores.prep,
      s.scores.assembly,
      s.scores.predict,
      s.scores.simulate,
      s.scores.detective,
      s.scores.conclusion,
      `"${s.badge}"`,
      `"${(s.conclusion || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khtn7-ket-qua-hoc-sinh-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save changes to current lab config
  const handleSaveCurrentConfig = () => {
    sound.playSuccess();
    onSaveConfig(configDraft);
    LabStorage.saveConfig(configDraft);
    setSaveSuccessMsg('✓ Đã lưu cấu hình bài học thí nghiệm thành công!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Add a new case
  const handleAddNewCase = () => {
    sound.playClick();
    const newId = configDraft.detectiveCases.length > 0 ? Math.max(...configDraft.detectiveCases.map((c) => c.id)) + 1 : 1;
    const newCase: ConfigurableDetectiveCase = {
      id: newId,
      title: `Vụ án ${newId}: Tình huống thí nghiệm mới do Giáo viên tạo`,
      scenarioDesc: 'Mô tả hiện tượng học sinh thao tác sai hoặc đặt sai điều kiện trong thí nghiệm...',
      pedagogicalHint: 'Gợi ý suy ngẫm dành cho học sinh...',
      flawType: 'fatal',
      correctAction: 'fix',
      options: [
        {
          id: `c${newId}_opt1`,
          text: 'Nguyên nhân chuẩn xác: Hiện tượng này làm sai lệch điều kiện đối chứng...',
          isCorrect: true,
          explanation: 'Chính xác! Lỗi này ảnh hưởng trực tiếp đến kết quả quan sát.',
        },
        {
          id: `c${newId}_opt2`,
          text: 'Nguyên nhân chưa đúng: Thao tác này hoàn toàn bình thường...',
          isCorrect: false,
          explanation: 'Chưa chính xác, hãy xem xét lại điều kiện thí nghiệm.',
        },
      ],
    };

    setConfigDraft({
      ...configDraft,
      detectiveCases: [...configDraft.detectiveCases, newCase],
    });
  };

  // Delete a case
  const handleDeleteCase = (id: number) => {
    if (configDraft.detectiveCases.length <= 1) {
      alert('Cần giữ lại ít nhất 1 tình huống thí nghiệm!');
      return;
    }
    sound.playClick();
    setConfigDraft({
      ...configDraft,
      detectiveCases: configDraft.detectiveCases.filter((c) => c.id !== id),
    });
  };

  // Export lab config as JSON
  const exportConfigJson = () => {
    sound.playClick();
    const jsonStr = JSON.stringify(configDraft, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `khtn7-config-${configDraft.experimentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import config from JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && imported.lessonTitle && imported.detectiveCases) {
          sound.playSuccess();
          setConfigDraft(imported);
          onSaveConfig(imported);
          LabStorage.saveConfig(imported);
          alert('✓ Đã nhập và áp dụng cấu hình bài thí nghiệm mới thành công!');
        } else {
          alert('File JSON không đúng định dạng cấu hình bài thí nghiệm KHTN 7!');
        }
      } catch {
        alert('Lỗi khi đọc file JSON!');
      }
    };
    reader.readAsText(file);
  };

  // Apply a preset
  const applyPreset = (preset: LabCustomConfig) => {
    if (window.confirm(`Thầy/Cô có muốn chuyển toàn bộ nội dung sang "${preset.lessonTitle}" không?`)) {
      sound.playSuccess();
      setConfigDraft(preset);
      onSaveConfig(preset);
      LabStorage.saveConfig(preset);
      alert(`Đã kích hoạt cấu hình: ${preset.lessonTitle}!`);
    }
  };

  // Reset to default Bài 27
  const handleResetToDefault = () => {
    if (window.confirm('Khôi phục lại toàn bộ nội dung mặc định của Bài 27: Thực hành Hô hấp ở thực vật?')) {
      sound.playSuccess();
      const resetConf = LabStorage.resetConfig();
      setConfigDraft(resetConf);
      onSaveConfig(resetConf);
      alert('Đã khôi phục cài đặt gốc Bài 27!');
    }
  };

  // Change password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim() || newPassword.length < 4) {
      setPwdMsg('Mật khẩu mới phải có ít nhất 4 ký tự!');
      return;
    }
    sound.playSuccess();
    LabStorage.setTeacherPassword(newPassword.trim());
    setPwdMsg('✓ Đã cập nhật mật khẩu giáo viên mới thành công!');
    setNewPassword('');
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchClass = filterClass === 'all' || s.studentClass.toLowerCase() === filterClass.toLowerCase();
    const matchName = !searchName.trim() || s.name.toLowerCase().includes(searchName.toLowerCase().trim());
    return matchClass && matchName;
  });

  const availableClasses = Array.from(new Set(submissions.map((s) => s.studentClass).filter(Boolean)));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border-2 border-emerald-300 w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner">
              🔐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">CHẾ ĐỘ GIÁO VIÊN</h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Teacher Portal
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Quản lý học sinh • Chỉnh sửa đề & câu hỏi • Xuất cấu hình tạo Lab mới
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng điều khiển giáo viên"
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTHENTICATION VIEW IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-300 mx-auto flex items-center justify-center text-3xl">
              <Key className="w-8 h-8 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Xác thực quyền Giáo viên</h3>
              <p className="text-xs text-slate-500 mt-1">
                Vui lòng nhập mật khẩu quản trị để mở khóa quyền chỉnh sửa và xem kết quả học sinh.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-center font-bold text-slate-800 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white"
                  autoFocus
                />
              </div>

              {authError && <p className="text-xs font-bold text-rose-600 animate-bounce">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Mở khóa Chế độ Giáo viên
              </button>
            </form>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              💡 <strong>Mật khẩu mặc định:</strong> <code className="font-mono font-bold text-emerald-700">giaovien2018</code>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED TEACHER DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'submissions'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Kết quả học sinh ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'cases'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Tình huống thí nghiệm ({configDraft.detectiveCases.length})
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'questions'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Dự đoán & Từ khóa chấm
              </button>
              <button
                onClick={() => setActiveTab('presets')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'presets'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Mẫu Thí nghiệm KHTN 7 khác & Xuất/Nhập
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'password'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Đổi mật khẩu
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
              {saveSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  {saveSuccessMsg}
                </div>
              )}

              {/* TAB 1: STUDENT RESULTS */}
              {activeTab === 'submissions' && (
                <div className="space-y-4">
                  {/* Action tools */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tìm tên học sinh..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                      />
                      <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-600"
                      >
                        <option value="all">Tất cả các lớp</option>
                        {availableClasses.map((c) => (
                          <option key={c} value={c}>
                            Lớp {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={exportSubmissionsToCSV}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        title="Xuất bảng điểm ra file Excel/CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Xuất Excel/CSV
                      </button>
                      <button
                        onClick={handleSeedDemoSubmissions}
                        className="px-3 py-1.5 bg-teal-50 border border-teal-300 text-teal-800 hover:bg-teal-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Tạo thử dữ liệu 4 học sinh demo"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Tạo bài làm mẫu
                      </button>
                      {submissions.length > 0 && (
                        <button
                          onClick={handleClearSubmissions}
                          className="px-2.5 py-1.5 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-bold transition-colors"
                          title="Xóa toàn bộ bài nộp"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Submissions Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b">
                          <th className="p-3">STT</th>
                          <th className="p-3">Học sinh</th>
                          <th className="p-3">Lớp</th>
                          <th className="p-3">Thời gian</th>
                          <th className="p-3 text-center">Tổng điểm</th>
                          <th className="p-3 text-center">Chuẩn bị</th>
                          <th className="p-3 text-center">Lắp đặt</th>
                          <th className="p-3 text-center">Dự đoán</th>
                          <th className="p-3 text-center">Quan sát</th>
                          <th className="p-3 text-center">Thám tử</th>
                          <th className="p-3 text-center">Kết luận</th>
                          <th className="p-3">Huy hiệu</th>
                          <th className="p-3 text-center">Xem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredSubmissions.length === 0 ? (
                          <tr>
                            <td colSpan={13} className="p-6 text-center text-slate-400">
                              Chưa có học sinh nào nộp bài. Bấm "Tạo bài làm mẫu" để xem thử bảng tổng hợp.
                            </td>
                          </tr>
                        ) : (
                          filteredSubmissions.map((sub, idx) => (
                            <tr key={sub.id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 text-slate-400">{idx + 1}</td>
                              <td className="p-3 font-bold text-slate-900">{sub.name}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-semibold">
                                  {sub.studentClass}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500 whitespace-nowrap">{sub.completedAt}</td>
                              <td className="p-3 text-center font-black text-sm text-emerald-700">
                                {sub.totalScore}/100
                              </td>
                              <td className="p-3 text-center text-slate-600">{sub.scores?.prep ?? 0}</td>
                              <td className="p-3 text-center text-slate-600">{sub.scores?.assembly ?? 0}</td>
                              <td className="p-3 text-center text-slate-600">{sub.scores?.predict ?? 0}</td>
                              <td className="p-3 text-center text-slate-600">{sub.scores?.simulate ?? 0}</td>
                              <td className="p-3 text-center text-slate-600">{sub.scores?.detective ?? 0}</td>
                              <td className="p-3 text-center text-slate-600">{sub.scores?.conclusion ?? 0}</td>
                              <td className="p-3">
                                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  {sub.badge}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => setSelectedSub(sub)}
                                  className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg transition-colors cursor-pointer"
                                  title="Xem chi tiết bài làm"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Individual Detail Modal */}
                  {selectedSub && (
                    <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 max-w-xl w-full shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b">
                          <div>
                            <h3 className="font-black text-base text-slate-900">
                              BÀI LÀM: {selectedSub.name} ({selectedSub.studentClass})
                            </h3>
                            <p className="text-xs text-slate-500">Nộp lúc: {selectedSub.completedAt}</p>
                          </div>
                          <button
                            onClick={() => setSelectedSub(null)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                          <p className="font-bold text-emerald-950">
                            🏆 Tổng điểm: <span className="text-base text-emerald-800">{selectedSub.totalScore}/100</span> • {selectedSub.badge}
                          </p>
                        </div>

                        <div className="text-xs space-y-2">
                          <p>
                            <strong>Dự đoán Chuông A:</strong> {selectedSub.predictions?.jarA}
                          </p>
                          <p>
                            <strong>Dự đoán Chuông B:</strong> {selectedSub.predictions?.jarB}
                          </p>
                          <div className="p-3 bg-slate-50 rounded-xl border">
                            <span className="font-bold text-slate-800 block mb-1">Kết luận học sinh tự gõ:</span>
                            <p className="italic text-slate-700">"{selectedSub.conclusion || '(Trống)'}"</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedSub(null)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
                          >
                            Đóng
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DETECTIVE CASES EDITOR */}
              {activeTab === 'cases' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-sm text-slate-900">
                        DANH SÁCH TÌNH HUỐNG THÍ NGHIỆM LỖI (MÀN 5)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Thầy/Cô có thể sửa tiêu đề, mô tả hiện trường, gợi ý sư phạm và các phương án chọn.
                      </p>
                    </div>
                    <button
                      onClick={handleAddNewCase}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      + Thêm tình huống mới
                    </button>
                  </div>

                  <div className="space-y-4">
                    {configDraft.detectiveCases.map((c, idx) => (
                      <div key={c.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b">
                          <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                            Vụ án #{idx + 1} (ID: {c.id})
                          </span>
                          <button
                            onClick={() => handleDeleteCase(c.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa vụ án này
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Tiêu đề vụ án:
                          </label>
                          <input
                            type="text"
                            value={c.title}
                            onChange={(e) => {
                              const updated = [...configDraft.detectiveCases];
                              updated[idx].title = e.target.value;
                              setConfigDraft({ ...configDraft, detectiveCases: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Mô tả tình huống lỗi (Hiện trường):
                          </label>
                          <textarea
                            rows={2}
                            value={c.scenarioDesc}
                            onChange={(e) => {
                              const updated = [...configDraft.detectiveCases];
                              updated[idx].scenarioDesc = e.target.value;
                              setConfigDraft({ ...configDraft, detectiveCases: updated });
                            }}
                            className="w-full p-2 bg-slate-50 border rounded-lg text-xs text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Gợi ý sư phạm của Giáo sư:
                          </label>
                          <input
                            type="text"
                            value={c.pedagogicalHint}
                            onChange={(e) => {
                              const updated = [...configDraft.detectiveCases];
                              updated[idx].pedagogicalHint = e.target.value;
                              setConfigDraft({ ...configDraft, detectiveCases: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-slate-50 border rounded-lg text-xs text-slate-800"
                          />
                        </div>

                        {/* Options editor */}
                        <div className="pt-2 border-t">
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-2">
                            Các phương án lựa chọn:
                          </label>
                          <div className="space-y-2">
                            {c.options.map((opt, oIdx) => (
                              <div key={opt.id} className="p-2.5 bg-slate-50 rounded-xl border flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct_opt_${c.id}`}
                                    checked={opt.isCorrect}
                                    onChange={() => {
                                      const updated = [...configDraft.detectiveCases];
                                      updated[idx].options.forEach((o, i) => (o.isCorrect = i === oIdx));
                                      setConfigDraft({ ...configDraft, detectiveCases: updated });
                                    }}
                                  />
                                  <span className={`text-[11px] font-bold ${opt.isCorrect ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {opt.isCorrect ? '✓ ĐÁP ÁN ĐÚNG' : 'Đáp án nhiễu'}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const updated = [...configDraft.detectiveCases];
                                    updated[idx].options[oIdx].text = e.target.value;
                                    setConfigDraft({ ...configDraft, detectiveCases: updated });
                                  }}
                                  placeholder="Nội dung phương án..."
                                  className="w-full px-2.5 py-1 bg-white border rounded text-xs font-medium"
                                />
                                <input
                                  type="text"
                                  value={opt.explanation}
                                  onChange={(e) => {
                                    const updated = [...configDraft.detectiveCases];
                                    updated[idx].options[oIdx].explanation = e.target.value;
                                    setConfigDraft({ ...configDraft, detectiveCases: updated });
                                  }}
                                  placeholder="Giải thích phản hồi khi học sinh chọn..."
                                  className="w-full px-2.5 py-1 bg-white border rounded text-[11px] text-slate-600 italic"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 bg-white p-3 rounded-2xl border flex justify-end shadow-md">
                    <button
                      onClick={handleSaveCurrentConfig}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
                    >
                      💾 Lưu tất cả thay đổi
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: QUESTIONS & KEYWORDS EDITOR */}
              {activeTab === 'questions' && (
                <div className="space-y-5 bg-white p-5 rounded-2xl border border-slate-200">
                  <h3 className="font-black text-sm text-slate-900 border-b pb-2">
                    TÙY CHỈNH CÂU HỎI DỰ ĐOÁN & BỘ TỪ KHÓA CHẤM KẾT LUẬN
                  </h3>

                  {/* Stage 3: Predict questions */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase text-emerald-800">
                      1. Câu hỏi Dự đoán Chuông A (Màn 3):
                    </h4>
                    <input
                      type="text"
                      value={configDraft.predictQuestionA}
                      onChange={(e) => setConfigDraft({ ...configDraft, predictQuestionA: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
                    />

                    <h4 className="font-bold text-xs uppercase text-teal-800 mt-3">
                      2. Câu hỏi Dự đoán Chuông B (Đối chứng):
                    </h4>
                    <input
                      type="text"
                      value={configDraft.predictQuestionB}
                      onChange={(e) => setConfigDraft({ ...configDraft, predictQuestionB: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-semibold"
                    />
                  </div>

                  {/* Stage 6 Keywords */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-bold text-xs uppercase text-slate-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-emerald-600" />
                      3. Bộ từ khóa chấm điểm kết luận thông minh (Màn 6):
                    </h4>
                    <p className="text-xs text-slate-500">
                      Học sinh tự gõ câu kết luận. Thuật toán sẽ kiểm tra xem câu trả lời có chứa ít nhất 1 từ trong mỗi nhóm sau hay không (phân cách bằng dấu phẩy):
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-bold block text-slate-700 mb-1">
                          Nhóm 1: Đối tượng sống (Hạt nảy mầm/lá cây/rong):
                        </label>
                        <input
                          type="text"
                          value={configDraft.conclusionKeywords.seed.join(', ')}
                          onChange={(e) => {
                            const words = e.target.value.split(',').map((w) => w.trim()).filter(Boolean);
                            setConfigDraft({
                              ...configDraft,
                              conclusionKeywords: { ...configDraft.conclusionKeywords, seed: words },
                            });
                          }}
                          className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold block text-slate-700 mb-1">
                          Nhóm 2: Quá trình sinh học (Hô hấp/quang hợp/thoát hơi nước):
                        </label>
                        <input
                          type="text"
                          value={configDraft.conclusionKeywords.process.join(', ')}
                          onChange={(e) => {
                            const words = e.target.value.split(',').map((w) => w.trim()).filter(Boolean);
                            setConfigDraft({
                              ...configDraft,
                              conclusionKeywords: { ...configDraft.conclusionKeywords, process: words },
                            });
                          }}
                          className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold block text-slate-700 mb-1">
                          Nhóm 3: Chất khí/sản phẩm (CO2/O2/hơi nước):
                        </label>
                        <input
                          type="text"
                          value={configDraft.conclusionKeywords.gas.join(', ')}
                          onChange={(e) => {
                            const words = e.target.value.split(',').map((w) => w.trim()).filter(Boolean);
                            setConfigDraft({
                              ...configDraft,
                              conclusionKeywords: { ...configDraft.conclusionKeywords, gas: words },
                            });
                          }}
                          className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold block text-slate-700 mb-1">
                          Nhóm 4: Động từ trao đổi (Thải/giải phóng/sinh ra):
                        </label>
                        <input
                          type="text"
                          value={configDraft.conclusionKeywords.release.join(', ')}
                          onChange={(e) => {
                            const words = e.target.value.split(',').map((w) => w.trim()).filter(Boolean);
                            setConfigDraft({
                              ...configDraft,
                              conclusionKeywords: { ...configDraft.conclusionKeywords, release: words },
                            });
                          }}
                          className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t flex justify-end">
                    <button
                      onClick={handleSaveCurrentConfig}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
                    >
                      💾 Lưu cài đặt câu hỏi & từ khóa
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: PRESETS & EXPORT/IMPORT FOR OTHER LABS */}
              {activeTab === 'presets' && (
                <div className="space-y-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200">
                    <h3 className="font-black text-sm text-slate-900 mb-1">
                      📚 MẪU CẤU HÌNH CHO CÁC BÀI THỰC HÀNH KHTN 7 KHÁC
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Thầy/Cô có thể áp dụng ngay các mẫu có sẵn cho các bài học thực nghiệm khác trong chương trình KHTN 7 GDPT 2018:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Preset 1: Bài 27 */}
                      <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            Mặc định
                          </span>
                          <h4 className="font-black text-sm text-emerald-950 mt-1">
                            Bài 27: Hô hấp ở thực vật
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            Bí mật hơi thở của hạt đậu nảy mầm thải khí CO₂ làm đục nước vôi.
                          </p>
                        </div>
                        <button
                          onClick={handleResetToDefault}
                          className="mt-4 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Kích hoạt mẫu Bài 27
                        </button>
                      </div>

                      {/* Preset 2: Bài 23 */}
                      <div className="p-4 rounded-2xl border-2 border-teal-300 bg-teal-50/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                            Thực vật học
                          </span>
                          <h4 className="font-black text-sm text-teal-950 mt-1">
                            Bài 23: Quang hợp ở thực vật
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            Cành rong đuôi chó chiếu sáng giải phóng bọt khí Oxygen (O₂).
                          </p>
                        </div>
                        <button
                          onClick={() => applyPreset(PRESET_BAI_23_QUANG_HOP)}
                          className="mt-4 w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Kích hoạt mẫu Bài 23
                        </button>
                      </div>

                      {/* Preset 3: Bài 28 */}
                      <div className="p-4 rounded-2xl border-2 border-green-300 bg-green-50/50 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Thực vật học
                          </span>
                          <h4 className="font-black text-sm text-green-950 mt-1">
                            Bài 28: Thoát hơi nước ở lá
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">
                            So sánh cành có lá và cành vặt lá trong túi nilon ngưng tụ giọt nước.
                          </p>
                        </div>
                        <button
                          onClick={() => applyPreset(PRESET_BAI_28_THOAT_HOI_NUOC)}
                          className="mt-4 w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          Kích hoạt mẫu Bài 28
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Export & Import Tools */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="font-black text-sm text-slate-900">
                      💾 XUẤT / NHẬP FILE CẤU HÌNH PHÒNG THÍ NGHIỆM (.JSON)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Thầy/Cô có thể xuất toàn bộ cấu hình bài thí nghiệm hiện tại ra file JSON để lưu trữ, chia sẻ cho đồng nghiệp hoặc nhập file đề thí nghiệm khác vào app.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={exportConfigJson}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Tải file cấu hình JSON hiện tại
                      </button>

                      <label className="px-5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Nhập file cấu hình JSON từ máy
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJson}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PASSWORD MANAGEMENT */}
              {activeTab === 'password' && (
                <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="font-black text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    ĐỔI MẬT KHẨU GIÁO VIÊN
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mật khẩu này dùng để truy cập vào bảng quản trị và quản lý kết quả học sinh.
                  </p>

                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mật khẩu mới (tối thiểu 4 ký tự):
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới..."
                        className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-bold"
                      />
                    </div>

                    {pwdMsg && (
                      <p className={`text-xs font-bold ${pwdMsg.startsWith('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {pwdMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Lưu mật khẩu mới
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
