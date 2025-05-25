"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, Heart, MessageCircle } from "lucide-react";
import { BlogPost as BlogPostType } from "../type";
import Image from "next/image";

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
        className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/40 group"
        onClick={onClick}
      >
        <CardContent className="flex gap-6 p-6">
          {post.imageUrl && (
            <div className="flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={post.imageUrl || "https://picsum.photos/400/300"}
                alt={post.title}
                className="w-48 h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                width={400}
                height={300}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {post.category}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8 border-2 border-background">
                  <AvatarImage src={post.author?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {post.author?.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">
                  {post.author?.name}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min
                </span>
                <span className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Eye className="w-4 h-4" />
                  {post.views}
                </span>
                <span className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </span>
                <span className="flex items-center gap-1 hover:text-primary transition-colors">
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
      className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/40 group overflow-hidden"
      onClick={onClick}
    >
      {post.imageUrl && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.imageUrl || "https://picsum.photos/400/300"}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            width={400}
            height={300}
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          {post.category && (
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              {post.category}
            </Badge>
          )}
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.createdAt)}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border-2 border-background">
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author?.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">
              {post.author?.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 hover:text-primary transition-colors">
              <Clock className="w-4 h-4" />
              {post.readTime} min
            </span>
            <span className="flex items-center gap-1 hover:text-primary transition-colors">
              <Heart className="w-4 h-4" />
              {post.likes}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
