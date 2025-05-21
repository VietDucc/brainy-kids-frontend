export interface ChallengeOption {
  id: number;
  textOption: string | null;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

export interface Challenge {
  id: number;
  type: "SELECT" | "SINGLE" | "MULTI" | "ASSIST";
  imgSrc: string | null;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
  challengesProgress: {
    id: number;
    userId: string;
    completed: boolean;
  }[];
} 