export interface FlashCard {
  id: number;
  front: string;
  back: string;
  status?: "correct" | "incorrect" | "skipped";
  lastReviewed?: Date;
}

export interface DeckWithCards {
  id: number;
  name: string;
  flashCards: FlashCard[];
  authorId?: string;
  isPublic?: boolean;
}

export type StudyMode = "flashcard" | "learn" | "overview"; 