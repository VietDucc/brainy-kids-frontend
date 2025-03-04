import { mockCourses, mockUserProgress } from "./mock-data";
import { List } from "./list";

const CoursesPage = async () => {
  const languagesCourses = mockCourses;
  const userProgress = mockUserProgress;

  return (
    <div className="mx-auto h-full max-w-[912px] px-3 py-4">
      <h1 className="text-2xl font-bold">Language Courses</h1>

      <List
        courses={languagesCourses}
        activeCourseId={userProgress?.activeCourseId}
      />
      <h1 className="text-xl md:text-2xl font-semibold mt-8">Math Courses</h1>

      <List
        courses={languagesCourses}
        activeCourseId={userProgress?.activeCourseId}
      />
      <h1 className="text-xl md:text-2xl font-semibold mt-8">Math Courses</h1>

      <List
        courses={languagesCourses}
        activeCourseId={userProgress?.activeCourseId}
      />
      <h1 className="text-xl md:text-2xl font-semibold mt-8">Math Courses</h1>

      <List
        courses={languagesCourses}
        activeCourseId={userProgress?.activeCourseId}
      />
    </div>
  );
};

export default CoursesPage;
