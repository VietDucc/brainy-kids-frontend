"use client";

import { BlogFilters as BlogFiltersType } from "@/app/(main)/blog/type";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface BlogFiltersProps {
  filters: BlogFiltersType;
  onFiltersChange: (filters: BlogFiltersType) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function BlogFilters({
  viewMode,
  onViewModeChange,
}: BlogFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 border rounded-lg p-1">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className="w-8 h-8 p-0"
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("list")}
          className="w-8 h-8 p-0"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
