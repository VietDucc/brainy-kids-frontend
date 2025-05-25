"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, Heart, MessageCircle } from "lucide-react";
import { BlogPost as BlogPostType } from "../type";

interface BlogPostProps {
  post: BlogPostType;
  viewMode: "grid" | "list";
  onClick: () => void;
}

export default function BlogPost({ post, viewMode, onClick }: BlogPostProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={onClick}
      >
        <CardContent className="flex gap-6 p-6">
          {post.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-48 h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
              {post.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback>{post.author?.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {post.author?.name}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {post.imageUrl && (
        <div className="aspect-video relative overflow-hidden rounded-t-lg">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          {post.category && <Badge variant="secondary">{post.category}</Badge>}
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback>{post.author?.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              {post.author?.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
