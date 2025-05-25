"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Tag,
} from "lucide-react";
import { BlogPost } from "../type";
import { Textarea } from "@/components/ui/textarea";

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export default function BlogPostDetail({ post, onBack }: BlogPostDetailProps) {
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: (post.comments?.length || 0) + 1,
      content: newComment,
      authorName: "Current User",
      createdAt: new Date().toISOString(),
    };

    post.comments = [...(post.comments || []), comment];
    setNewComment("");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                {post.likes + (isLiked ? 1 : 0)} Likes
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="p-8 pb-6">
            <div className="flex items-center gap-2 mb-4">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
              {post.featured && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src={post.author?.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {post.author?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {post.author?.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime} min read
                      </span>
                    )}
                    {post.views !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views.toLocaleString()} views
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {post.imageUrl && (
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
          </div>

          {/* Article Content */}
          <div className="px-8 pb-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">
                    Tags:
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
                    About {post.author.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.author.bio}</p>
                  <Button variant="outline" size="sm">
                    View Profile
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
                      {comment.authorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.authorName}
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
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments ({post.comments?.length || 0})
          </h2>

          {/* Add Comment */}
          <div className="space-y-4">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.authorName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
