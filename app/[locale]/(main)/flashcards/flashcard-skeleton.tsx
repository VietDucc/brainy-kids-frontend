import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

export function FlashcardSkeleton() {
  return (
    <div className="container px-6 md:px-0 py-2 sm:py-6 space-y-4 sm:space-y-8 max-w-7xl mx-auto">
      <div className="space-y-1 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 sm:h-10 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-3 sm:h-4 w-48 bg-muted rounded animate-pulse mt-0.5 sm:mt-1"></div>
          </div>
        </div>
        <Separator className="my-2 sm:my-6" />
      </div>

      {/* My Decks Section */}
      <div className="space-y-2 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 sm:h-7 w-20 bg-muted rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-4">
          {/* Skeleton User Decks */}
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-muted">
              <div className="aspect-square rounded-lg sm:rounded-xl bg-gradient-to-br from-muted/60 to-muted p-1.5 sm:p-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded animate-pulse mb-1 sm:mb-3"></div>
                <div className="w-full">
                  <div className="h-3 sm:h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
                </div>
              </div>
            </Card>
          ))}

          {/* Create New Deck Card */}
          <Card className="overflow-hidden border-dashed border-muted-foreground/30">
            <div className="aspect-square rounded-lg sm:rounded-xl border-2 border-dashed border-muted-foreground/30 p-1.5 sm:p-4 hover:border-primary/50 transition-colors flex flex-col items-center justify-center">
              <Plus className="w-6 h-6 sm:w-12 sm:h-12 text-muted-foreground/60 mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-sm font-medium text-muted-foreground text-center">
                Create New Deck
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Public Decks Section */}
      <div className="space-y-2 sm:space-y-6">
        <div className="h-5 sm:h-7 w-28 bg-muted rounded animate-pulse"></div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-4">
          {/* Skeleton Public Decks */}
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-muted">
              <div className="aspect-square rounded-lg sm:rounded-xl bg-gradient-to-br from-muted/60 to-muted p-1.5 sm:p-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted-foreground/20 rounded animate-pulse mb-1 sm:mb-3"></div>
                <div className="w-full">
                  <div className="h-3 sm:h-4 bg-muted-foreground/20 rounded animate-pulse"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
