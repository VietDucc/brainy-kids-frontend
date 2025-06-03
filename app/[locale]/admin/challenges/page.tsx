"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Pencil,
  Trash,
  Eye,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { DataTable } from "../components/data-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Challenge {
  id: number;
  type: string;
  imgSrc: string | null;
  question: string;
  orderChallenge: number;
  unitTitle?: string;
  lessonTitle?: string;
  challengesOption: {
    id: number;
    textOption: string;
    correct: boolean;
    imageSrc: string | null;
    audioSrc: string | null;
  }[];
}

interface Lesson {
  id: number;
  title: string;
  challenges: Challenge[];
}

interface Unit {
  id: number;
  title: string;
  lessons: Lesson[];
}

type Column = {
  header: string;
  accessorKey: keyof Challenge;
  cell?: (item: Challenge) => React.ReactNode;
};

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const courseId = 1;
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchChallenges = async () => {
      try {
        const response = await fetch(`/api/units/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch units");
        }
        const unitsData: Unit[] = await response.json();

        // Extract all challenges from units and lessons
        const allChallenges = unitsData.flatMap((unit) =>
          unit.lessons.flatMap((lesson) =>
            lesson.challenges.map((challenge) => ({
              ...challenge,
              unitTitle: unit.title,
              lessonTitle: lesson.title,
            }))
          )
        );

        setChallenges(allChallenges);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch challenges",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, [toast, courseId]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete challenge");
      }

      setChallenges((prevChallenges) =>
        prevChallenges.filter((challenge) => challenge.id !== id)
      );

      toast({
        title: "Success",
        description: "Challenge deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting challenge:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete challenge",
      });
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      SELECT: "bg-blue-100 text-blue-600 border-blue-200",
      ASSIST: "bg-purple-100 text-purple-600 border-purple-200",
      FILL_IN_BLANK: "bg-green-100 text-green-600 border-green-200",
      SPEAKING: "bg-orange-100 text-orange-600 border-orange-200",
      LISTENING: "bg-pink-100 text-pink-600 border-pink-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-600 border-gray-200"
    );
  };

  const columns: Column[] = [
    {
      header: "Question",
      accessorKey: "question",
      cell: (challenge) => (
        <div className="flex items-center gap-3">
          {challenge.imgSrc && (
            <Image
              src={challenge.imgSrc}
              alt="Question"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
          <span className="font-medium">{challenge.question}</span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (challenge) => (
        <Badge
          variant="outline"
          className={`rounded-full ${getTypeColor(challenge.type)}`}
        >
          {challenge.type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      header: "Unit",
      accessorKey: "unitTitle",
    },
    {
      header: "Lesson",
      accessorKey: "lessonTitle",
    },
    {
      header: "Order",
      accessorKey: "orderChallenge",
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (challenge) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-50"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem
              onClick={() => router.push(`/admin/challenges/${challenge.id}`)}
              className="rounded-lg cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4 text-blue-500" />
              <span>Detail Challenge</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this challenge?"
                  )
                ) {
                  handleDelete(challenge.id);
                }
              }}
              className="rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Challenge</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Fun Challenges 🎮
          </h1>
          <p className="text-gray-600 mt-2">
            Create interactive activities to make learning enjoyable
          </p>
        </div>
        <Button
          asChild
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
        >
          <Link
            href="/admin/challenges/new"
            className="flex items-center gap-2 px-6"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Challenge</span>
          </Link>
        </Button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold">All Challenges</h2>
        </div>
        <DataTable columns={columns} data={challenges} loading={loading} />
      </div>
    </div>
  );
}
