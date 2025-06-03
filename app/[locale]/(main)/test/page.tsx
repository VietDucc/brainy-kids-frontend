"use client";
import { ExamCard } from "./components/exam-card";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/exam");
        const data = await response.json();
        setExams(data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return <Loading text="exams..." />;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">English Exam Platform</h1>
        <p className="text-gray-600">
          Practice your English skills with TOEIC-style exams
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
}
