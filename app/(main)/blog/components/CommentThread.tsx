"use client";

import { useState } from "react";
import { Comment } from "../type";
import { CommentComponent } from "./Comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentThreadProps {
  comment: Comment;
  userId?: string | null;
  authorId: string;
  level?: number;
  onReply: (commentId: number, content: string) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  formatDate: (date: string) => string;
}

export function CommentThread({
  comment,
  userId,
  authorId,
  level = 0,
  onReply,
  onEdit,
  onDelete,
  formatDate,
}: CommentThreadProps) {
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleReply = (parentId: number) => {
    if (replyContent.trim()) {
      onReply(parentId, replyContent);
      setReplyContent("");
      setReplyingToId(null);
    }
  };

  const handleReplyClick = (commentId: number) => {
    setReplyingToId(commentId);
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyContent("");
  };

  const visibleReplies = showAllReplies
    ? comment.replies
    : comment.replies?.slice(0, 2);
  const hasMoreReplies = comment.replies && comment.replies.length > 2;

  const marginClass = level > 0 ? "ml-4 sm:ml-8" : "";

  return (
    <div className="space-y-4">
      <div className={marginClass}>
        <CommentComponent
          comment={comment}
          userId={userId}
          authorId={authorId}
          onReply={() => handleReplyClick(comment.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          formatDate={formatDate}
        />

        {/* Reply Input */}
        {replyingToId === comment.id && (
          <div className="flex gap-2 pl-4 sm:pl-8 mt-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {userId?.[0]}
              </AvatarFallback>
              <AvatarImage src={userId} />
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[100px] resize-none bg-background border-border"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelReply}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {visibleReplies && visibleReplies.length > 0 && (
        <div className={`space-y-4 pl-4 sm:pl-8 border-l-2 border-border`}>
          {visibleReplies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              userId={userId}
              authorId={authorId}
              level={level + 1}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              formatDate={formatDate}
            />
          ))}

          {/* Show More Replies Button */}
          {!showAllReplies && hasMoreReplies && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/90"
              onClick={() => setShowAllReplies(true)}
            >
              Show {comment.replies.length - 2} more{" "}
              {comment.replies.length - 2 === 1 ? "reply" : "replies"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
