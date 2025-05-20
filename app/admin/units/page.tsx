"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash, Eye, MoreHorizontal } from "lucide-react";
import { DataTable } from "../components/data-table";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChallengeOption = {
  id: number;
  textOption: string;
  correct: boolean;
  imageSrc: string | null;
  audioSrc: string | null;
};

type Challenge = {
  id: number;
  type: "SELECT" | "ASSIST";
  imgSrc: string | null;
  question: string;
  orderChallenge: number;
  challengesOption: ChallengeOption[];
  challengesProgress: any[];
};

type Vocabulary = {
  id: number;
  note: string;
  orderVocabulary: number;
  eng: string;
  vie: string;
};

type Lesson = {
  id: number;
  title: string;
  difficulty: string | null;
  orderIndex: number;
  challenges: Challenge[];
  vocabularies: Vocabulary[];
};

type Unit = {
  id: number;
  title: string;
  description: string;
  orderUnit: number;
  lessons: Lesson[];
};

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const courseId = 1;

  useEffect(() => {
    setLoading(true);
    const fetchUnits = async () => {
      try {
        const unitsResponse = await fetch(`/api/units/${courseId}`);
        if (!unitsResponse.ok) {
          throw new Error("Failed to fetch course units");
        }
        const unitsData = await unitsResponse.json();
        setUnits(unitsData);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast({
          variant: "error",
          title: "Error fetching units",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [toast]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/units/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete unit");
      }

      setUnits(units.filter((unit) => unit.id !== id));
      toast({
        variant: "success",
        title: "Unit deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast({
        variant: "error",
        title: "Error deleting unit",
      });
    }
  };
  const columns = [
    {
      header: "Title",
      accessorKey: "title" as keyof Unit,
    },
    {
      header: "Description",
      accessorKey: "description" as keyof Unit,
    },
    {
      header: "Order",
      accessorKey: "orderUnit" as keyof Unit,
    },
    {
      header: "Lessons",
      accessorKey: "lessons" as keyof Unit,
      cell: (item: Unit) => item.lessons.length,
    },
    {
      header: "Actions",
      accessorKey: "id" as keyof Unit,
      cell: (item: Unit) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/units/${courseId}/${item.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/units/${courseId}/${item.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(item.id)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Units</h1>
          <p className="text-muted-foreground">Manage your course units</p>
        </div>
        <Button asChild>
          <Link href="/admin/units/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Unit
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={units} loading={loading} />
    </div>
  );
}
