import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "../type";

interface CommentProps {
  comment: Comment;
  userId?: string | null;
  authorId: string;
  onReply: (commentId: number) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  formatDate: (date: string) => string;
}

export function CommentComponent({
  comment,
  userId,
  authorId,
  onReply,
  onEdit,
  onDelete,
  formatDate,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const isCommentAuthor = userId === comment.authorId;
  const isBlogAuthor = userId === authorId;
  const canDelete = isCommentAuthor || isBlogAuthor;

  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-primary/10 text-primary">
          {comment.authorId[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[100px] resize-none bg-background border-border"
              placeholder="Edit your comment..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onEdit(comment.id, editContent);
                  setIsEditing(false);
                }}
                disabled={
                  !editContent.trim() || editContent === comment.content
                }
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-accent/50 dark:bg-accent rounded-xl px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold block text-sm text-foreground">
                  {comment.authorId}
                </span>
                <div className="flex items-center gap-2">
                  {isCommentAuthor && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/90 mt-1">
                {comment.content}
              </p>
            </div>
            <div className="flex items-center gap-4 px-4">
              <button
                onClick={() => onReply(comment.id)}
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Reply
              </button>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
