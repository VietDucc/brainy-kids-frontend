import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";

interface Vocabulary {
  id: number;
  word: string;
  meaning: string;
  example: string;
}

interface VocabularyListProps {
  vocabularies: Vocabulary[];
}

export function VocabularyList({ vocabularies }: VocabularyListProps) {
  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No vocabularies available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Vocabularies ({vocabularies.length})
        </h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Vocabulary
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {vocabularies.map((vocab) => (
          <div
            key={vocab.id}
            className="p-4 border rounded-lg bg-white space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{vocab.word}</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-gray-600">{vocab.meaning}</p>
            <p className="text-sm text-gray-500 italic">
              Example: {vocab.example}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
