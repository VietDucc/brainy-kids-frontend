import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import Image from "next/image";

interface ChallengeOption {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
}

interface Challenge {
  id: number;
  type: "SELECT" | "SINGLE" | "MULTI";
  imgSrc: string | null;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
}

interface ChallengeListProps {
  challenges: Challenge[];
}

export function ChallengeList({ challenges }: ChallengeListProps) {
  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No challenges available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Challenges ({challenges.length})
        </h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Challenge
        </Button>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                    {challenge.orderChallenge + 1}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium",
                      challenge.type === "SELECT" &&
                        "border-purple-200 bg-purple-50 text-purple-700",
                      challenge.type === "SINGLE" &&
                        "border-blue-200 bg-blue-50 text-blue-700",
                      challenge.type === "MULTI" &&
                        "border-green-200 bg-green-50 text-green-700"
                    )}
                  >
                    {challenge.type}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Challenge
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Challenge
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {challenge.imgSrc && (
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  <Image
                    src={challenge.imgSrc}
                    alt={challenge.question}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              <p className="text-gray-900 font-medium">{challenge.question}</p>

              {challenge.type !== "MULTI" && (
                <div className="grid grid-cols-1 gap-2">
                  {challenge.challengesOption?.map((option) => (
                    <div
                      key={option.id}
                      className={cn(
                        "p-3 rounded-md border transition-all duration-200",
                        option.correct
                          ? "border-green-200 bg-green-50 text-green-900"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{option.textOption}</span>
                        {option.correct && (
                          <Badge className="bg-green-600">Correct</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {challenge.type === "MULTI" && (
                <div className="p-4 rounded-md border border-blue-200 bg-blue-50">
                  <p className="text-sm text-blue-700 font-medium">
                    Multi-word Translation Challenge
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
