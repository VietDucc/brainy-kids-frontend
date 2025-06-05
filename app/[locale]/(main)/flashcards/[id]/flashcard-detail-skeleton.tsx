import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Upload } from "lucide-react";

export function FlashCardDetailSkeleton() {
  return (
    <div className="container px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-8 mb-6 sm:mb-8">
          <Button variant="ghost" className="flex items-center gap-2" disabled>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="h-6 sm:h-8 w-32 bg-muted rounded animate-pulse"></div>
            <Badge variant="secondary" className="whitespace-nowrap">
              <div className="h-4 w-12 bg-muted-foreground/20 rounded animate-pulse"></div>
            </Badge>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="outline" size="sm" className="h-9" disabled>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
            <Button variant="outline" size="sm" className="h-9" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Bulk Import
            </Button>
            <Button size="sm" className="h-9" disabled>
              Start Learning
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="h-6 sm:h-8 w-8 bg-muted rounded animate-pulse mx-auto mb-2"></div>
                  <div className="h-3 sm:h-4 w-16 bg-muted rounded animate-pulse mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Cards List */}
          <div className="space-y-4">
            <div className="h-6 sm:h-7 w-20 bg-muted rounded animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Card key={index} className="h-auto border-muted">
                  <CardContent className="flex items-start justify-between p-3 sm:p-4">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="h-4 w-full bg-muted-foreground/20 rounded animate-pulse mb-2"></div>
                      <div className="h-3 w-3/4 bg-muted-foreground/20 rounded animate-pulse mb-1"></div>
                      <div className="h-2 w-1/2 bg-muted-foreground/20 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 w-8 bg-muted rounded animate-pulse flex-shrink-0"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
