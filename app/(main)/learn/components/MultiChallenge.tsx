import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { useState } from "react";

interface MultiChallengeProps {
  question: string;
  onCorrectArrangement: () => void;
}

export function MultiChallenge({
  question,
  onCorrectArrangement,
}: MultiChallengeProps) {
  const originalWords = question.split(" ");
  const [arrangedWords, setArrangedWords] = useState(() => {
    return [...originalWords].sort(() => Math.random() - 0.5);
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newArrangement = [...arrangedWords];
    const draggedWord = newArrangement[draggedIndex];
    newArrangement.splice(draggedIndex, 1);
    newArrangement.splice(index, 0, draggedWord);
    setArrangedWords(newArrangement);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    if (arrangedWords.join(" ") === originalWords.join(" ")) {
      onCorrectArrangement();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-4">
          Arrange the words to form a correct sentence
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Drag and drop the words in the correct order
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {arrangedWords.map((word, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border rounded-lg cursor-move select-none",
              draggedIndex === index && "opacity-50",
              "hover:border-primary hover:bg-primary/5"
            )}
          >
            <GripVertical className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{word}</span>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-slate-500 dark:text-slate-400">
          Current sentence: {arrangedWords.join(" ")}
        </p>
      </div>
    </div>
  );
}
