import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-5xl mx-auto">
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="flex items-center gap-2 mb-6"
        >
          <Link href="/flashcards">
            <ArrowLeft className="w-4 h-4" />
            Back to Flashcards
          </Link>
        </Button>

        <Card className="text-center p-6 sm:p-8">
          <CardContent className="space-y-4">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Deck Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The flashcard deck you&apos;re looking for doesn&apos;t exist or
                has been removed.
              </p>
              <Button asChild>
                <Link href="/flashcards">Browse Flashcards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
