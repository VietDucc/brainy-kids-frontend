"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Star,
  Tag,
  PenSquare,
} from "lucide-react";
import { BlogPost, Comment } from "../type";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import Editor from "./Editor";
import { useToast } from "@/hooks/use-toast";
import { CommentComponent } from "./Comment";

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
  authorId: string;
}

export default function BlogPostDetail({
  post,
  onBack,
  authorId,
}: BlogPostDetailProps) {
  const { t } = useTranslation("blog");
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { userId } = useAuth();
  const [content, setContent] = useState(post.content);
  const [title, setTitle] = useState(post.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const isAuthor = userId === authorId;
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/${post.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now.getTime() - vietnamTime.getTime()) / 1000
    );
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "Vừa xong";
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }

    return vietnamTime.toLocaleString("vi-VN", {
      day: "numeric",
      month: "long",
      year:
        vietnamTime.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/comment/${post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error(t("errors.add_comment"));
      }

      setNewComment("");
      await fetchComments();
      toast({
        variant: "success",
        title: t("success.comment_added"),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: t("errors.add_comment"),
        description: t("errors.try_again"),
      });
    }
  };

  const handleAddReply = async (commentId: number) => {
    if (!replyContent.trim()) return;

    try {
      const response = await fetch(`/api/comment/${post.id}/${commentId}`, {
        method: "POST",
        body: JSON.stringify({
          content: replyContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      setReplyContent("");
      setReplyingTo(null);
      await fetchComments();
      toast({
        title: "Reply added successfully",
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        variant: "destructive",
        title: "Failed to add reply",
        description: "Please try again",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: post.excerpt,
        url: window.location.href,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      setIsEditingTitle(false);
      toast({
        variant: "success",
        title: "Post updated successfully",
        description: "Your post has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        variant: "destructive",
        title: "Failed to update post",
        description: "Please try again",
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comment/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      await fetchComments();
      toast({
        title: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete comment",
        description: "Please try again",
      });
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      const response = await fetch(`/api/comment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      await fetchComments();
      toast({
        title: "Comment updated successfully",
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({
        variant: "destructive",
        title: "Failed to update comment",
        description: "Please try again",
      });
    }
  };

  const getMarginClass = (level: number) => {
    switch (level) {
      case 1:
        return "ml-10";
      case 2:
        return "ml-16";
      case 3:
        return "ml-20";
      case 4:
        return "ml-24";
      default:
        return "ml-10";
    }
  };

  const countTotalComments = (comments: Comment[]): number => {
    let total = comments.length;
    comments.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        total += countTotalComments(comment.replies);
      }
    });
    return total;
  };

  const calculateCommentLevel = (comment: Comment): number => {
    let level = 1;
    let currentComment = comment;

    while (currentComment.parentCommentId) {
      level++;
      const parentComment =
        comments.find((c) => c.id === currentComment.parentCommentId) ||
        comments
          .flatMap((c) => c.replies || [])
          .find((c) => c.id === currentComment.parentCommentId);
      if (!parentComment) break;
      currentComment = parentComment;
    }

    return level;
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="space-y-3">
      <CommentComponent
        comment={comment}
        userId={userId}
        authorId={authorId}
        onReply={() => setReplyingTo(comment.id)}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
        formatDate={formatDate}
      />

      {replyingTo === comment.id && calculateCommentLevel(comment) < 4 && (
        <div
          className={`${getMarginClass(
            calculateCommentLevel(comment)
          )} flex gap-2`}
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback>{userId?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleAddReply(comment.id)}
                disabled={!replyContent.trim()}
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}

      {comment.replies &&
        comment.replies.length > 0 &&
        calculateCommentLevel(comment) < 4 && (
          <div
            className={`${getMarginClass(
              calculateCommentLevel(comment)
            )} space-y-3`}
          >
            {comment.replies.map((reply) => renderComment(reply))}
          </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="shadow-sm border-b">
        <div className="max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("header.back_to_posts")}
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                {t("header.share")}
              </Button>

              {isAuthor && (
                <Button onClick={handleSave} variant="default" size="sm">
                  {t("header.save_changes")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="p-8 pb-6">
            <div className="flex items-center gap-2 mb-4">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
              {post.featured && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  {t("post.featured")}
                </Badge>
              )}
            </div>

            <div className="relative group">
              {isAuthor && !isEditingTitle && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <PenSquare className="w-4 h-4" />
                </Button>
              )}
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-4xl font-bold mb-4 leading-tight"
                  autoFocus
                  onBlur={() => setIsEditingTitle(false)}
                />
              ) : (
                <h1 className="text-4xl font-bold mb-4 leading-tight text-muted-foreground">
                  {title}
                </h1>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={post.authorImg || "/placeholder.svg"} />
                  <AvatarFallback>
                    {post.authorName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-muted-foreground">
                    {post.authorName || t("post.anonymous")}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground/70">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {t("post.read_time", { count: post.readTime })}
                      </span>
                    )}
                    {post.views !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {t("post.stats.views", { count: post.views })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {post.imageUrl && (
              <Image
                src={post.imageUrl || "https://picsum.photos/400/300"}
                alt={title}
                className="w-full h-64 object-cover rounded-lg mb-6"
                width={400}
                height={300}
                objectFit="cover"
              />
            )}
          </div>

          {/* Article Content */}
          <div className="px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              <Editor
                value={content}
                onChange={setContent}
                isEditable={isAuthor}
                onSave={handleSave}
                showSaveButton={isAuthor}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">
                    {t("post.tags")}:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Author Bio */}
        {post.author && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t("post.about_author", { name: post.author.name })}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.author.bio}</p>
                  <Button variant="outline" size="sm">
                    {t("post.view_profile")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        {post.comments && post.comments.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({post.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {comment.authorId.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.authorId}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {t("post.comments_count", {
                count: countTotalComments(comments),
              })}
            </h2>

            {/* Add Comment */}
            <div className="flex gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{userId?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder={t("post.write_comment")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="sm"
                  >
                    {t("post.post_comment")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6 mt-8">
              {comments.map((comment) => renderComment(comment))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
