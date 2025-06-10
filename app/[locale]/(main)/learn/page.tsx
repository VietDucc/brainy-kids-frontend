import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { HeaderClient } from "./header-client";
import { LessonCard } from "./lesson-card";
import { Button } from "@/components/ui/button";
import { LearnClient } from "./learn-client";
import { api } from "@/app/api/config";
import { UnitType } from "@/types/learn";
import Link from "next/link";

interface UserProgressData {
  activeCourse: {
    id: number;
    title: string;
    imageSrc: string;
  };
  hearts: number;
  points: number;
}

const fallbackData: UserProgressData = {
  activeCourse: {
    id: 1,
    title: "French",
    imageSrc: "/france.svg",
  },
  hearts: 2,
  points: 120,
};

async function getUnits(courseId: number, token: string): Promise<UnitType[]> {
  const response = await fetch(api.units(courseId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch units");
  }

  return response.json();
}

async function getCompletedLessons(
  userId: string,
  token: string
): Promise<number[]> {
  const response = await fetch(`${api.getLessonProgress(userId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const completedLessons = await response.json();
  return completedLessons.map(
    (lesson: { lessonId: number }) => lesson.lessonId
  );
}

async function getActiveUser(userId: string, token: string): Promise<boolean> {
  const response = await fetch(`${api.activeUser(userId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.active;
}

interface SearchParams {
  unitId?: string;
}

const LearnPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { userId, getToken } = await auth();

  const token = await getToken({ template: "jwt-clerk" });

  try {
    const [completedLessonIds, activeUser] = await Promise.all([
      getCompletedLessons(userId, token),
      getActiveUser(userId, token),
    ]);

    const userProgressData = fallbackData;

    if (!userProgressData || !userProgressData.activeCourse) {
      redirect("/courses");
    }

    const units = await getUnits(userProgressData.activeCourse.id, token);
    const selectedUnitId = (await searchParams.unitId)
      ? parseInt(searchParams.unitId, 10)
      : null;

    const getLessonStatus = (
      lessonId: number
    ): "locked" | "available" | "completed" => {
      if (completedLessonIds && completedLessonIds.includes(lessonId)) {
        return "completed";
      }
      return "available";
    };

    const getLessonStatusDescription = (
      status: "locked" | "available" | "completed"
    ): string => {
      switch (status) {
        case "completed":
          return "Đã hoàn thành";
        case "available":
          return "Bắt đầu bài học";
        case "locked":
          return "Đã khóa";
      }
    };

    const getLessonIcon = (title: string): string => {
      if (title.toLowerCase().includes("noun")) return "📝";
      if (title.toLowerCase().includes("verb")) return "🏃";
      if (title.toLowerCase().includes("adjective")) return "🌈";
      if (title.toLowerCase().includes("pronoun")) return "👤";
      if (title.toLowerCase().includes("adverb")) return "⏱️";
      if (title.toLowerCase().includes("preposition")) return "📍";
      if (title.toLowerCase().includes("conjunction")) return "🔗";
      if (title.toLowerCase().includes("interjection")) return "😲";
      return "📚";
    };

    if (selectedUnitId !== null) {
      const selectedUnit = units.find((unit) => unit.id === selectedUnitId);

      if (!selectedUnit) {
        return (
          <div className="flex h-screen w-full items-center justify-center">
            <p>Không tìm thấy đơn vị học tập</p>
          </div>
        );
      }

      return (
        <LearnClient units={units} token={token}>
          <div className="flex flex-col lg:flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
              <UserProgress
                activeCourse={userProgressData.activeCourse}
                hearts={userProgressData.hearts}
                points={userProgressData.points}
                hasActiveSubscription={false}
              />
            </StickyWrapper>
            <FeedWrapper>
              <HeaderClient
                title={userProgressData.activeCourse.title}
                showBackToUnits
              />
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                  {selectedUnit.title}
                </h2>

                {(activeUser
                  ? selectedUnit.lessons
                  : selectedUnit.lessons.slice(0, 3)
                ).map((lesson) => {
                  const status = getLessonStatus(lesson.id);
                  const statusDescription = getLessonStatusDescription(status);

                  return (
                    <div
                      key={lesson.id}
                      data-lesson-id={lesson.id}
                      data-status={status}
                    >
                      <LessonCard
                        id={lesson.id}
                        title={lesson.title}
                        description={statusDescription}
                        status={status}
                        icon={getLessonIcon(lesson.title)}
                        isLoading={false}
                      />
                    </div>
                  );
                })}

                {!activeUser && selectedUnit.lessons.length > 3 && (
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                      <span className="text-white text-xl">🚀</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Nâng cấp để mở khóa thêm bài học
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Còn {selectedUnit.lessons.length - 3} bài học nữa đang chờ
                      bạn khám phá
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                      Nâng cấp ngay
                    </Button>
                  </div>
                )}
              </div>
            </FeedWrapper>
          </div>
        </LearnClient>
      );
    }

    return (
      <LearnClient units={units} token={token}>
        <div className="flex flex-col lg:flex-row-reverse gap-[48px] px-6">
          <StickyWrapper>
            <UserProgress
              activeCourse={userProgressData.activeCourse}
              hearts={userProgressData.hearts}
              points={userProgressData.points}
              hasActiveSubscription={false}
            />
          </StickyWrapper>
          <FeedWrapper>
            <HeaderClient
              title={userProgressData.activeCourse.title}
              showBackToUnits
            />
            <div className="space-y-8 mt-8">
              {units.length > 0 ? (
                units.map((unit) => (
                  <div key={unit.id} className="space-y-3">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                      {unit.title}
                    </h3>
                    {unit.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {unit.description}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                      {unit.lessons && unit.lessons.length > 0 ? (
                        <>
                          {(activeUser
                            ? unit.lessons
                            : unit.lessons.slice(0, 3)
                          ).map((lesson) => {
                            const status = getLessonStatus(lesson.id);
                            const statusDescription =
                              getLessonStatusDescription(status);

                            return (
                              <div
                                key={lesson.id}
                                data-lesson-id={lesson.id}
                                data-status={status}
                              >
                                <LessonCard
                                  id={lesson.id}
                                  title={lesson.title}
                                  description={statusDescription}
                                  status={status}
                                  icon={getLessonIcon(lesson.title)}
                                  isLoading={false}
                                />
                              </div>
                            );
                          })}
                          {!activeUser && unit.lessons.length > 3 && (
                            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                                <span className="text-white text-xl">🚀</span>
                              </div>
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                Nâng cấp để mở khóa thêm bài học
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Còn {unit.lessons.length - 3} bài học nữa đang
                                chờ bạn khám phá
                              </p>
                              <Link href="/premium">
                                <Button>Nâng cấp ngay</Button>
                              </Link>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm italic text-slate-500 dark:text-slate-400">
                          Không có bài học nào
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-slate-500 dark:text-slate-400">
                    Không có đơn vị học tập nào
                  </p>
                </div>
              )}
            </div>
          </FeedWrapper>
        </div>
      </LearnClient>
    );
  } catch (error) {
    console.error("Error fetching learn data:", error);
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col">
        <p className="text-red-500 mb-4">Không thể tải dữ liệu khóa học</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Thử lại
        </button>
      </div>
    );
  }
};

export default LearnPage;
