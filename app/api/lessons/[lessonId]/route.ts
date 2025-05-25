import { NextRequest, NextResponse } from "next/server";
import { api } from "../../config";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic"; // Use Next.js dynamic configuration

interface ChallengeOption {
  id?: number;
  textOption: string | null;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

interface Challenge {
  id?: number;
  type: "SELECT" | "SINGLE" | "MULTI" | "ASSIST";
  imgSrc: string | null;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
}

interface Vocabulary {
  id?: number;
  note: string;
  orderVocabulary: number;
  eng: string;
  vie: string;
}

interface LessonPayload {
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  orderLesson: number;
  challenges?: Challenge[];
  vocabularies?: Vocabulary[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { userId, getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const lessonId = parseInt(params.lessonId, 10);
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });
    }

    const response = await fetch(api.lessons(lessonId), {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch lesson ${lessonId}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { userId, getToken } = await auth();
    const token = await getToken({ template: "jwt-clerk" });

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lessonId = parseInt(params.lessonId, 10);
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson ID" }, { status: 400 });
    }

    const values = await request.json();
  
    // Transform the data to match API requirements with type safety and null checks
    const payload: LessonPayload = {
      title: values.title,
      difficulty: values.difficulty,
      orderLesson: values.orderLesson,
      challenges: Array.isArray(values.challenges) 
        ? values.challenges.map((challenge: Challenge) => ({
            id: challenge.id,
            type: challenge.type,
            imgSrc: challenge.imgSrc,
            question: challenge.question,
            orderChallenge: challenge.orderChallenge,
            challengesOption: Array.isArray(challenge.challengesOption)
              ? challenge.challengesOption.map((option: ChallengeOption) => ({
                  id: option.id,
                  textOption: option.textOption,
                  correct: option.correct,
                  imageSrc: option.imageSrc,
                  audioSrc: option.audioSrc
                }))
              : []
          }))
        : [],
      vocabularies: Array.isArray(values.vocabularies)
        ? values.vocabularies.map((vocab: Vocabulary) => ({
            id: vocab.id,
            note: vocab.note,
            orderVocabulary: vocab.orderVocabulary,
            eng: vocab.eng,
            vie: vocab.vie
          }))
        : []
    };

    const response = await fetch(api.editLesson(lessonId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to update lesson ${lessonId}: ${errorData.message || response.statusText}`
      );
    }

    return NextResponse.json({ message: "Lesson updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update lesson" },
      { status: 500 }
    );
  }
}
