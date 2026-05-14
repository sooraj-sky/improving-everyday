export type LessonType = "lesson" | "lab" | "quiz" | "project" | "exercise";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type QuizQuestionType = "scenario" | "hands-on";

export interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty?: "junior" | "mid" | "senior";
}

export interface QuizQuestion {
  question: string;
  answer: string;
  type: QuizQuestionType;
  hint?: string;
  difficulty?: "junior" | "mid" | "senior";
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // minutes
  type: LessonType;
  description: string;
  content: string; // Markdown
  objectives?: string[];
  tags?: string[];
  interviewQuestions?: InterviewQuestion[];
  quizQuestions?: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  level: DifficultyLevel;
  description: string;
  lessons: Lesson[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: string;
  color: string;
  gradient: string;
  modules: Module[];
  tags?: string[];
  level?: DifficultyLevel;
  estimatedHours?: number;
}

export interface LessonWithContext {
  lesson: Lesson;
  module: Module;
  track: Track;
  prevLesson: { trackId: string; moduleId: string; lessonId: string; title: string } | null;
  nextLesson: { trackId: string; moduleId: string; lessonId: string; title: string } | null;
}
