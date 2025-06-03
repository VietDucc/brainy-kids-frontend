"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Eye, EyeOff, FileText } from "lucide-react";

interface BulkImportCard {
  front: string;
  back: string;
  deckId: number;
}

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckId: number;
  onImport: (cards: BulkImportCard[]) => Promise<void>;
}

export default function BulkImportDialog({
  open,
  onOpenChange,
  deckId,
  onImport,
}: BulkImportDialogProps) {
  const [inputText, setInputText] = useState("");
  const [previewCards, setPreviewCards] = useState<BulkImportCard[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const parseTabSeparatedText = (text: string): BulkImportCard[] => {
    const lines = text.trim().split("\n");
    const cards: BulkImportCard[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const parts = trimmedLine.split(/\t+|\s{2,}/).map((part) => part.trim());

      if (parts.length >= 2) {
        cards.push({
          front: parts[0],
          back: parts[1],
          deckId: deckId,
        });
      }
    }

    return cards;
  };

  const handlePreview = () => {
    const parsed = parseTabSeparatedText(inputText);
    setPreviewCards(parsed);
    setShowPreview(true);
  };

  const handleImport = async () => {
    setIsLoading(true);
    try {
      await onImport(previewCards);
      setInputText("");
      setPreviewCards([]);
      setShowPreview(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to import cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setPreviewCards([]);
    setShowPreview(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import Cards
          </DialogTitle>
          <DialogDescription>
            Import multiple flashcards at once. Paste tab-separated or
            double-space separated text. Format:{" "}
            <code className="bg-muted px-1 rounded">
              Front Text[TAB]Back Text
            </code>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!showPreview ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="import-text">Import Data</Label>
                <Textarea
                  id="import-text"
                  placeholder={`Example format:
Hello	Xin chào
Goodbye	Tạm biệt
Thank you	Cảm ơn

Or paste from Excel/Google Sheets (automatically tab-separated)`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>
                  {inputText.trim()
                    ? `${inputText.trim().split("\n").length} lines detected`
                    : "No data entered"}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">Preview</span>
                  <Badge variant="secondary">{previewCards.length} cards</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Edit Text
                </Button>
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {previewCards.length > 0 ? (
                  previewCards.map((card, index) => (
                    <Card key={index} className="p-3">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Front
                            </p>
                            <p className="text-sm font-medium">{card.front}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Back
                            </p>
                            <p className="text-sm">{card.back}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6 text-center">
                    <CardContent className="p-0">
                      <p className="text-muted-foreground">
                        No valid cards found. Check your format.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </div>

        <Separator />

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!showPreview ? (
            <Button onClick={handlePreview} disabled={!inputText.trim()}>
              <Eye className="h-4 w-4 mr-2" />
              Preview ({parseTabSeparatedText(inputText).length} cards)
            </Button>
          ) : (
            <Button
              onClick={handleImport}
              disabled={previewCards.length === 0 || isLoading}
            >
              {isLoading
                ? "Importing..."
                : `Import ${previewCards.length} Cards`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
