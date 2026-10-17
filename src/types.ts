export type StageId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface LabState {
  studentName: string;
  studentClass: string;
  currentStage: StageId;
  soundEnabled: boolean;
  score: {
    prep: number;       // max 10
    assembly: number;   // max 20
    predict: number;    // max 10
    simulate: number;   // max 15
    detective: number;  // max 30 (6 x 5)
    conclusion: number; // max 15 (10 conclusion + 5 food game)
  };
  // Stage 1
  prepCompleted: boolean;
  // Stage 2
  assemblyCompleted: boolean;
  sealedJars: boolean;
  // Stage 3
  predictions: {
    jarA: string;
    jarB: string;
    reason: string;
    locked: boolean;
  };
  // Stage 4
  simTime: number; // 0 to 60
  simCompleted: boolean;
  moleculeMode: boolean;
  // Stage 5
  detectiveAnswers: Record<number, { fixed: boolean; reason: string; isCorrect: boolean }>;
  detectiveCompleted: boolean;
  // Stage 6
  observations: {
    jarA_phenomenon: string;
    jarA_explanation: string;
    jarB_phenomenon: string;
    jarB_explanation: string;
  };
  userConclusion: string;
  conclusionScoreAwarded: boolean;
  foodGameCompleted: boolean;
  foodQuestionsAnswered: boolean;
  // Meta
  startedAt: string;
  completedAt?: string;
}

export interface StudentSubmissionRecord {
  id: string;
  studentName: string;
  studentClass: string;
  completedAt: string;
  scoreTotal: number;
  scoreBreakdown: {
    prep: number;
    assembly: number;
    predict: number;
    simulate: number;
    detective: number;
    conclusion: number;
  };
  badgeTitle: string;
  predictions: {
    jarA: string;
    jarB: string;
  };
  userConclusion: string;
}

export interface PrepStepConfig {
  id: number;
  correctIndex: number;
  title: string;
  desc: string;
}

export interface DetectiveCaseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface DetectiveCaseConfig {
  id: number;
  title: string;
  scenarioDesc: string;
  pedagogicalHint: string;
  options: DetectiveCaseOption[];
}

export interface PracticalQuestionConfig {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface LabLessonConfig {
  lessonCode: string;
  lessonName: string;
  subtitle: string;
  topic: string;
  prepSteps: PrepStepConfig[];
  detectiveCases: DetectiveCaseConfig[];
  practicalQuestions: PracticalQuestionConfig[];
}
