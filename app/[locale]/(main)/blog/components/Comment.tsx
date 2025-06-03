"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "../type";
import { cn } from "@/lib/utils";

interface CommentProps {
  comment: Comment;
  userId?: string | null;
  authorId: string;
  onReply: () => void;
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
  const { t } = useTranslation("blog");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const isCommentAuthor = userId === comment.authorId;
  const isBlogAuthor = userId === authorId;
  const canDelete = isCommentAuthor || isBlogAuthor;

  const getCommentLevel = () => {
    let level = 1;
    let currentComment = comment;
    while (currentComment.parentCommentId) {
      level++;
      currentComment = { ...currentComment, parentCommentId: null };
    }
    return level;
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReply();
  };

  const commentLevel = getCommentLevel();

  const handleEdit = () => {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="flex gap-2 group items-start">
      <Avatar className="w-8 h-8 mt-2">
        <AvatarFallback className="bg-primary/10 text-primary">
          {comment.authorName?.[0]?.toUpperCase()}
        </AvatarFallback>
        <AvatarImage src={comment.authorImg} />
      </Avatar>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2 mb-1"></div>
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
                {t("post.cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={
                  !editContent.trim() || editContent === comment.content
                }
              >
                {t("post.save")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "bg-accent/50 dark:bg-accent rounded-xl px-4 py-2.5",
                "group-hover:bg-accent/70 dark:group-hover:bg-accent/70 transition-colors"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-sm text-foreground truncate">
                    {comment.authorName}
                  </span>
                  {comment.authorId === authorId && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Author
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isCommentAuthor && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t("post.edit")}
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(comment.id);
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      {t("post.delete")}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
            <div className="flex items-center gap-4 px-4">
              {commentLevel < 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReplyClick}
                  className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors p-0 h-auto"
                >
                  {t("post.reply")}
                </Button>
              )}
              <span className="text-[12px] text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
