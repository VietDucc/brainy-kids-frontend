import { cn } from "@/lib/utils";
import { GripVertical, ArrowRight } from "lucide-react";
import { useState, useRef, TouchEvent } from "react";
import { Button } from "@/components/ui/button";

interface MultiChallengeProps {
  question: string;
  onCorrectArrangement: () => void;
  onIncorrectAttempt: () => void;
  onNext: () => void;
}

export function MultiChallenge({
  question,
  onCorrectArrangement,
  onIncorrectAttempt,
  onNext,
}: MultiChallengeProps) {
  const originalWords = question.split(" ");
  const [arrangedWords, setArrangedWords] = useState(() => {
    return [...originalWords].sort(() => Math.random() - 0.5);
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [touchedWord, setTouchedWord] = useState<{
    index: number;
    element: HTMLElement | null;
  }>({
    index: -1,
    element: null,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
    checkArrangement();
  };

  const handleTouchStart = (e: TouchEvent, index: number) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    const element = e.currentTarget as HTMLElement;

    setTouchedWord({
      index,
      element,
    });

    // Add visual feedback
    element.style.opacity = "0.5";
    element.style.transform = "scale(1.05)";
    element.style.zIndex = "50";
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    if (!touchedWord.element) return;

    const touch = e.touches[0];
    const element = touchedWord.element;
    const touchY = touch.clientY;

    // Move the element
    element.style.position = "fixed";
    element.style.top = `${touchY - 30}px`; // 30px offset for better visibility

    // Find the element we're hovering over
    const elements = document.elementsFromPoint(touch.clientX, touchY);
    const droppableElement = elements.find(
      (el) => el.classList.contains("word-item") && el !== element
    ) as HTMLElement;

    if (droppableElement) {
      const dropIndex = parseInt(droppableElement.dataset.index || "-1");
      if (dropIndex !== -1 && dropIndex !== touchedWord.index) {
        // Rearrange the words
        const newArrangement = [...arrangedWords];
        const draggedWord = newArrangement[touchedWord.index];
        newArrangement.splice(touchedWord.index, 1);
        newArrangement.splice(dropIndex, 0, draggedWord);
        setArrangedWords(newArrangement);
        setTouchedWord((prev) => ({ ...prev, index: dropIndex }));
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchedWord.element) return;

    // Reset the element's style
    const element = touchedWord.element;
    element.style.opacity = "";
    element.style.transform = "";
    element.style.position = "";
    element.style.top = "";
    element.style.zIndex = "";

    setTouchedWord({ index: -1, element: null });
    checkArrangement();
  };

  const checkArrangement = () => {
    if (arrangedWords.join(" ") === originalWords.join(" ")) {
      onCorrectArrangement();
    }
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (arrangedWords.join(" ") === originalWords.join(" ")) {
      onCorrectArrangement();
    } else {
      onIncorrectAttempt();
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
            data-index={index}
            className={cn(
              "word-item flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border rounded-lg cursor-move select-none touch-none",
              draggedIndex === index && "opacity-50",
              "hover:border-primary hover:bg-primary/5",
              "transition-transform",
              hasSubmitted &&
                arrangedWords.join(" ") === originalWords.join(" ")
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "",
              hasSubmitted &&
                arrangedWords.join(" ") !== originalWords.join(" ")
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : ""
            )}
            draggable={!hasSubmitted}
            onDragStart={() => !hasSubmitted && handleDragStart(index)}
            onDragOver={(e) => !hasSubmitted && handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => !hasSubmitted && handleTouchStart(e, index)}
            onTouchMove={(e) => !hasSubmitted && handleTouchMove(e)}
            onTouchEnd={handleTouchEnd}
          >
            <GripVertical className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{word}</span>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Current sentence: {arrangedWords.join(" ")}
        </p>
        {!hasSubmitted ? (
          <Button
            onClick={handleSubmit}
            className="w-full py-6 rounded-xl font-semibold text-lg"
          >
            Check Answer
          </Button>
        ) : (
          arrangedWords.join(" ") !== originalWords.join(" ") && (
            <Button
              onClick={onNext}
              className="w-full py-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
            >
              Next
              <ArrowRight className="h-5 w-5" />
            </Button>
          )
        )}
      </div>
    </div>
  );
}
