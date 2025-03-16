export interface ChallengeOptionType {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

export interface ChallengeProgressType {
  id: number;
  userId: string;
  completed: boolean;
}

export interface ChallengeType {
  id: number;
  type: string;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOptionType[];
  challengesProgress: ChallengeProgressType[];
}

export interface LessonType {
  id: number;
  title: string;
  orderIndex: number;
  challenges: ChallengeType[];
}

export interface UnitType {
  id: number;
  title: string;
  description: string;
  orderUnit: number;
  lessons: LessonType[];
}

export interface UserProgressDataType {
  activeCourse: {
    id: number;
    title: string;
    imageSrc: string;
  };
  hearts: number;
  points: number;
}
