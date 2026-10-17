import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Stage1Prep } from './components/Stage1Prep';
import { Stage2Assembly } from './components/Stage2Assembly';
import { Stage3Predict } from './components/Stage3Predict';
import { Stage4Simulate } from './components/Stage4Simulate';
import { Stage5Detective } from './components/Stage5Detective';
import { Stage6Conclusion } from './components/Stage6Conclusion';
import { Stage7Report } from './components/Stage7Report';
import { ProfessorAvatar } from './components/ProfessorAvatar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { LabState, StageId, LabLessonConfig } from './types';
import { sound } from './utils/sound';
import { getStoredLessonConfig, saveSubmission, DEFAULT_LESSON_CONFIG } from './utils/defaultConfig';

const STORAGE_KEY = 'bio_lab_7_state_v1';

const INITIAL_STATE: LabState = {
  studentName: '',
  studentClass: '',
  currentStage: 0,
  soundEnabled: true,
  score: {
    prep: 0,
    assembly: 0,
    predict: 0,
    simulate: 0,
    detective: 0,
    conclusion: 0,
  },
  prepCompleted: false,
  assemblyCompleted: false,
  sealedJars: false,
  predictions: {
    jarA: '',
    jarB: '',
    reason: '',
    locked: false,
  },
  simTime: 0,
  simCompleted: false,
  moleculeMode: false,
  detectiveAnswers: {},
  detectiveCompleted: false,
  observations: {
    jarA_phenomenon: '',
    jarA_explanation: '',
    jarB_phenomenon: '',
    jarB_explanation: '',
  },
  userConclusion: '',
  conclusionScoreAwarded: false,
  foodGameCompleted: false,
  foodQuestionsAnswered: false,
  startedAt: new Date().toISOString(),
};

export default function App() {
  const [lessonConfig, setLessonConfig] = useState<LabLessonConfig>(() => getStoredLessonConfig());
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  const [labState, setLabState] = useState<LabState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_STATE;
  });

  const [maxUnlockedStage, setMaxUnlockedStage] = useState<StageId>(() => {
    if (labState.conclusionScoreAwarded) return 7;
    if (labState.detectiveCompleted) return 6;
    if (labState.simCompleted) return 5;
    if (labState.predictions.locked) return 4;
    if (labState.assemblyCompleted) return 3;
    if (labState.prepCompleted) return 2;
    if (labState.studentName) return 1;
    return 1;
  });

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labState));
    } catch {
      // ignore
    }
  }, [labState]);

  // Sync sound manager
  useEffect(() => {
    sound.setEnabled(labState.soundEnabled);
  }, [labState.soundEnabled]);

  const totalScore =
    labState.score.prep +
    labState.score.assembly +
    labState.score.predict +
    labState.score.simulate +
    labState.score.detective +
    labState.score.conclusion;

  const handleStart = (name: string, studentClass: string) => {
    setLabState((prev) => ({
      ...prev,
      studentName: name,
      studentClass,
      currentStage: 1,
      startedAt: prev.startedAt || new Date().toISOString(),
    }));
    setMaxUnlockedStage((prev) => (prev < 1 ? 1 : prev));
  };

  const handleResume = () => {
    setLabState((prev) => ({
      ...prev,
      currentStage: (prev.currentStage === 0 ? 1 : prev.currentStage) as StageId,
    }));
  };

  // Restart keeping the current student information
  const handleRestartSameStudent = () => {
    const studentName = labState.studentName || '';
    const studentClass = labState.studentClass || '';
    const cleanState: LabState = {
      ...INITIAL_STATE,
      studentName,
      studentClass,
      currentStage: 1,
      soundEnabled: labState.soundEnabled,
      startedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
    setLabState(cleanState);
    setMaxUnlockedStage(1);
    setResetKey((prev) => prev + 1);
    setIsResetModalOpen(false);
  };

  // Full reset for a new student (returns to Welcome screen)
  const handleResetNewStudent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLabState(INITIAL_STATE);
    setMaxUnlockedStage(1);
    setResetKey((prev) => prev + 1);
    setIsResetModalOpen(false);
  };

  const handleOpenReset = () => {
    setIsResetModalOpen(true);
  };

  const navigateToStage = (stage: StageId) => {
    setLabState((prev) => ({ ...prev, currentStage: stage }));
  };

  // Stage 1 completion (+10 pts)
  const handleStage1Complete = () => {
    setLabState((prev) => ({
      ...prev,
      prepCompleted: true,
      score: { ...prev.score, prep: 10 },
    }));
    setMaxUnlockedStage((prev) => (prev < 2 ? 2 : prev));
  };

  // Stage 2 sealing (+20 pts)
  const handleSealJars = () => {
    setLabState((prev) => ({
      ...prev,
      sealedJars: true,
      assemblyCompleted: true,
      score: { ...prev.score, assembly: 20 },
    }));
    setMaxUnlockedStage((prev) => (prev < 3 ? 3 : prev));
  };

  // Stage 3 prediction lock (+10 pts)
  const handleLockPrediction = (preds: { jarA: string; jarB: string; reason: string }) => {
    setLabState((prev) => ({
      ...prev,
      predictions: {
        ...preds,
        locked: true,
      },
      score: { ...prev.score, predict: 10 },
    }));
    setMaxUnlockedStage((prev) => (prev < 4 ? 4 : prev));
  };

  // Stage 4 simulation done (+15 pts)
  const handleStage4Complete = () => {
    setLabState((prev) => ({
      ...prev,
      simCompleted: true,
      score: { ...prev.score, simulate: 15 },
    }));
    setMaxUnlockedStage((prev) => (prev < 5 ? 5 : prev));
  };

  // Stage 5 detective answer (+5 pts each, max 30)
  const handleUpdateDetectiveAnswer = (
    caseId: number,
    data: { fixed: boolean; reason: string; isCorrect: boolean }
  ) => {
    setLabState((prev) => {
      const updatedAnswers = { ...prev.detectiveAnswers, [caseId]: data };
      const solvedCount = Object.values(updatedAnswers).filter((a) => a.isCorrect).length;
      const isAllSolved = solvedCount >= 6;

      return {
        ...prev,
        detectiveAnswers: updatedAnswers,
        detectiveCompleted: isAllSolved,
        score: { ...prev.score, detective: solvedCount * 5 },
      };
    });
    setMaxUnlockedStage((prev) => (prev < 6 ? 6 : prev));
  };

  // Stage 6 conclusion award (+10 pts)
  const handleAwardConclusionScore = () => {
    setLabState((prev) => ({
      ...prev,
      conclusionScoreAwarded: true,
      score: { ...prev.score, conclusion: prev.score.conclusion + (prev.conclusionScoreAwarded ? 0 : 10) },
    }));
  };

  // Stage 6 food mini-game award (+5 pts)
  const handleAwardFoodScore = () => {
    setLabState((prev) => ({
      ...prev,
      foodGameCompleted: true,
      foodQuestionsAnswered: true,
      score: { ...prev.score, conclusion: prev.score.conclusion + (prev.foodGameCompleted ? 0 : 5) },
    }));
  };

  const handleFinishLab = () => {
    const completedTime = new Date().toLocaleString('vi-VN');
    const total =
      labState.score.prep +
      labState.score.assembly +
      labState.score.predict +
      labState.score.simulate +
      labState.score.detective +
      labState.score.conclusion;

    let badge = '🌱 NHÀ KHOA HỌC TẬP SỰ';
    if (total >= 90) badge = '🏅 NHÀ KHOA HỌC THỰC VẬT XUẤT SẮC';
    else if (total >= 75) badge = '🌟 NHÀ NGHIÊN CỨU TÀI NĂNG';

    saveSubmission({
      id: Date.now().toString(),
      studentName: labState.studentName || 'Học sinh',
      studentClass: labState.studentClass || '7A',
      completedAt: completedTime,
      scoreTotal: total,
      scoreBreakdown: { ...labState.score },
      badgeTitle: badge,
      predictions: {
        jarA: labState.predictions.jarA,
        jarB: labState.predictions.jarB,
      },
      userConclusion: labState.userConclusion,
    });

    setLabState((prev) => ({
      ...prev,
      currentStage: 7,
      completedAt: completedTime,
    }));
    setMaxUnlockedStage(7);
  };

  // Download standalone HTML version
  const handleDownloadHtml = () => {
    sound.playClick();
    const link = document.createElement('a');
    link.href = '/bio-lab-7-ho-hap-thuc-vat.html';
    link.download = 'bio-lab-7-ho-hap-thuc-vat.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Professor assistant messages per stage
  let professorMsg = 'Chào mừng em đến với phòng thí nghiệm Bio Lab 7!';
  let professorHint = 'Hãy bắt đầu hành trình bằng việc chuẩn bị mẫu hạt đậu nảy mầm.';

  if (labState.currentStage === 1) {
    professorMsg = 'Màn 1: Em hãy sắp xếp 6 bước chuẩn bị mẫu vật sống theo trình tự chuẩn nhé!';
    professorHint = 'Hạt cần được lựa chọn kỹ, rửa sạch, ngâm nước ấm kích hoạt phôi, sau đó ủ ẩm để mọc mầm.';
  } else if (labState.currentStage === 2) {
    professorMsg = 'Màn 2: Nhớ nguyên tắc đối chứng! Chuông A có hạt nảy mầm thì Chuông B giữ nguyên mọi thứ trừ hạt.';
    professorHint = 'Chuông A: Hạt nảy mầm + Cốc nước vôi + Nhãn A. Chuông B: Không hạt + Cốc nước vôi + Nhãn B.';
  } else if (labState.currentStage === 3) {
    professorMsg = 'Màn 3: Nhà khoa học chân chính không ngại dự đoán sai. Hãy đưa ra giả thuyết và khóa lại!';
    professorHint = 'Khí CO₂ sinh ra từ quá trình hô hấp có đặc tính làm vẩn đục dung dịch nước vôi trong Ca(OH)₂.';
  } else if (labState.currentStage === 4) {
    professorMsg = 'Màn 4: Hãy bấm Bắt đầu thí nghiệm và đừng quên bật Chế độ phân tử để nhìn thấy dòng khí vô hình!';
    professorHint = 'Phân tử O₂ từ không khí đi vào hạt, phân tử CO₂ từ hạt khuếch tán vào nước vôi tạo kết tủa CaCO₃.';
  } else if (labState.currentStage === 5) {
    professorMsg = 'Màn 5: Thám tử ơi! 6 nhóm bạn đã gặp sự cố thí nghiệm. Em hãy tìm ra nguyên nhân và khắc phục!';
    professorHint = 'Hạt khô, hở chuông, quên nước vôi hay hạt bị ngập úng đều làm sai lệch kết quả thí nghiệm.';
  } else if (labState.currentStage === 6) {
    professorMsg = 'Màn 6: Bước quyết định! Em hãy hoàn thành bảng số liệu và tự tay viết kết luận khoa học nhé.';
    professorHint = 'Kết luận cần nêu rõ: Hạt đang nảy mầm hô hấp, sử dụng oxygen và thải khí carbon dioxide (CO₂).';
  } else if (labState.currentStage === 7) {
    professorMsg = 'Chúc mừng em! Em đã hoàn thành xuất sắc toàn bộ bài thực hành KHTN 7 với số điểm đáng tự hào!';
    professorHint = 'Em có thể in phiếu báo cáo hoặc lưu lại bản in để nộp cho thầy cô giáo bộ môn.';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#f7fee7] to-[#ecfdf5] text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Header bar */}
      <Header
        currentStage={labState.currentStage}
        totalScore={totalScore}
        studentName={labState.studentName}
        studentClass={labState.studentClass}
        soundEnabled={labState.soundEnabled}
        onToggleSound={() =>
          setLabState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onNavigateStage={navigateToStage}
        onReset={handleOpenReset}
        onViewReport={() => navigateToStage(7)}
        maxUnlockedStage={maxUnlockedStage}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        lessonTitle={lessonConfig.lessonName}
        appSubtitle={lessonConfig.subtitle}
      />

      {/* Main Content Area - key={resetKey} forces full fresh remount on reset */}
      <main key={resetKey} className="flex-1 pb-16">
        {labState.currentStage === 0 && (
          <WelcomeScreen
            initialName={labState.studentName}
            initialClass={labState.studentClass}
            hasSavedProgress={Boolean(labState.studentName && labState.currentStage > 0)}
            savedStage={labState.currentStage}
            savedScore={totalScore}
            onStart={handleStart}
            onResume={handleResume}
          />
        )}

        {labState.currentStage === 1 && (
          <Stage1Prep
            onComplete={handleStage1Complete}
            onNext={() => navigateToStage(2)}
            isCompleted={labState.prepCompleted}
          />
        )}

        {labState.currentStage === 2 && (
          <Stage2Assembly
            onComplete={() => {}}
            onNext={() => navigateToStage(3)}
            isCompleted={labState.assemblyCompleted}
            sealedJars={labState.sealedJars}
            onSealJars={handleSealJars}
          />
        )}

        {labState.currentStage === 3 && (
          <Stage3Predict
            initialPredictions={labState.predictions}
            onLockPrediction={handleLockPrediction}
            onNext={() => navigateToStage(4)}
          />
        )}

        {labState.currentStage === 4 && (
          <Stage4Simulate
            userPredictions={labState.predictions}
            onComplete={handleStage4Complete}
            onNext={() => navigateToStage(5)}
            isCompleted={labState.simCompleted}
          />
        )}

        {labState.currentStage === 5 && (
          <Stage5Detective
            onComplete={() => {}}
            onNext={() => navigateToStage(6)}
            isCompleted={labState.detectiveCompleted}
            detectiveAnswers={labState.detectiveAnswers}
            onUpdateDetectiveAnswer={handleUpdateDetectiveAnswer}
            customCases={lessonConfig.detectiveCases}
          />
        )}

        {labState.currentStage === 6 && (
          <Stage6Conclusion
            onComplete={() => {}}
            onFinishLab={handleFinishLab}
            isCompleted={labState.conclusionScoreAwarded && labState.foodGameCompleted}
            observations={labState.observations}
            onUpdateObservations={(obs) =>
              setLabState((prev) => ({ ...prev, observations: obs }))
            }
            userConclusion={labState.userConclusion}
            onUpdateConclusion={(concl) =>
              setLabState((prev) => ({ ...prev, userConclusion: concl }))
            }
            onAwardConclusionScore={handleAwardConclusionScore}
            conclusionAwarded={labState.conclusionScoreAwarded}
            foodGameCompleted={labState.foodGameCompleted}
            onAwardFoodScore={handleAwardFoodScore}
          />
        )}

        {labState.currentStage === 7 && (
          <Stage7Report
            labState={labState}
            onRestart={handleOpenReset}
            onUpdateStudentInfo={(name, studentClass) =>
              setLabState((prev) => ({ ...prev, studentName: name, studentClass }))
            }
            onDownloadHtml={handleDownloadHtml}
          />
        )}
      </main>

      {/* Persistent AI Professor Assistant (Floating bubble) */}
      <ProfessorAvatar message={professorMsg} hint={professorHint} />

      {/* Footer */}
      <footer className="no-print border-t border-emerald-100 py-3 text-center text-[11px] text-slate-500 bg-white/60">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BIO LAB 7 • Bài 27: Thực hành Hô hấp ở thực vật • KHTN 7 (GDPT 2018)</span>
          <span>Thiết kế tương tác sư phạm chuẩn mực • Phát triển năng lực thực nghiệm</span>
        </div>
      </footer>

      {/* Teacher Mode Management Dashboard Modal */}
      <TeacherDashboard
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        currentConfig={lessonConfig}
        onConfigChange={(newCfg) => setLessonConfig(newCfg)}
      />

      {/* Restart / Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onRestartSameStudent={handleRestartSameStudent}
        onResetNewStudent={handleResetNewStudent}
        studentName={labState.studentName}
        studentClass={labState.studentClass}
      />
    </div>
  );
}
