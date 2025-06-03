import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  description: string;
  voice: string;
}

interface ExamCardProps {
  exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{exam.name}</CardTitle>
        <CardDescription>{exam.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {exam.voice && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Headphones className="h-4 w-4 mr-2" />
            <span>Audio available</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/test/${exam.id}`} className="w-full">
          <Button className="w-full">Start Exam</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
