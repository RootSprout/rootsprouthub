import { apiRequest } from './client';

export type LearningNode = {
  id: string;
  title: string;
  topic: string;
  status: 'locked' | 'available' | 'completed';
  progress: number;
  position: { x: number; y: number };
};

export type LearningStats = {
  totalXP: number;
  level: number;
  xpToNext: number;
};

export type DailyGoal = {
  id: number;
  label: string;
  progress: number;
};

export type Achievement = {
  id: number;
  title: string;
};

export type DashboardPayload = {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  nodes: LearningNode[];
  stats: LearningStats;
  goals: DailyGoal[];
  achievements: Achievement[];
};

export type Lesson = {
  id: string;
  title: string;
  topic: string;
  summary: string;
};

export type LessonStep = {
  id: number;
  title: string;
  content: string;
  task: string;
  order: number;
};

export type LessonPayload = {
  lesson: Lesson;
  steps: LessonStep[];
};

export type ValidatePayload = {
  correct: boolean;
  message: string;
};

export type CompletePayload = {
  message: string;
};

export async function getDashboard() {
  return apiRequest<DashboardPayload>('/learning/dashboard', {}, true);
}

export async function getLesson(id: string) {
  return apiRequest<LessonPayload>(`/learning/lessons/${id}`, {}, true);
}

export async function validateCommand(lessonId: string, stepId: number, input: string) {
  return apiRequest<ValidatePayload>(
    `/learning/lessons/${lessonId}/steps/${stepId}/validate`,
    {
      method: 'POST',
      body: JSON.stringify({ input }),
    },
    true
  );
}

export async function completeLesson(lessonId: string) {
  return apiRequest<CompletePayload>(
    `/learning/lessons/${lessonId}/complete`,
    {
      method: 'POST',
    },
    true
  );
}
