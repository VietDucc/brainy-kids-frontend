"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PenTool, Plus } from "lucide-react";
import { BlogPost, BlogFilters as BlogFiltersType } from "./type";
import BlogPostComponent from "./components/BlogPost";
import Editor from "./components/Editor";
import { useRouter } from "next/navigation";
import BlogFilters from "./components/BlogFilters";
import { api } from "@/app/api/config";
import { useToast } from "@/hooks/use-toast";
interface BlogClientProps {
  initialPosts: BlogPost[];
  token: string;
  userId: string;
}

export function BlogClient({ initialPosts, token, userId }: BlogClientProps) {
  const [filters, setFilters] = useState<BlogFiltersType>({
    searchQuery: "",
    category: "All",
    sortBy: "newest",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const createPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      setIsCreating(true);

      const response = await fetch(api.blog, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          clerkUserId: userId,
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          imageUrl: newPost.imageUrl,
        }),
      });

      const data = await response.json();
      setPosts([data, ...posts]);

      setNewPost({
        title: "",
        content: "",
        imageUrl: "",
      });
      setShowCreatePost(false);
      toast({
        variant: "success",
        title: "Post created successfully!",
      });

      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "error",
        title: "Failed to create post. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === "All" || post.category === filters.category;

    return matchesSearch && matchesCategory;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (filters.sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                Blog
              </h1>
              <Badge variant="secondary" className="font-medium">
                Professional
              </Badge>
            </div>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BlogFilters
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div
          className={`mt-8 grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {sortedPosts.map((post) => (
            <BlogPostComponent
              key={post.id}
              post={post}
              viewMode={viewMode}
              onClick={() => router.push(`/blog/${post.id}`)}
            />
          ))}
        </div>

        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts found matching your criteria.
            </p>
          </div>
        )}

        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <PenTool className="w-5 h-5 text-primary" />
                Create New Post
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Share your thoughts with the world
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter an engaging title..."
                  className="bg-background"
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium">Content</Label>
                <Editor
                  value={newPost.content}
                  onChange={(content) =>
                    setNewPost((prev) => ({ ...prev, content }))
                  }
                  placeholder="Write your post content here..."
                  isEditable={true}
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newPost.imageUrl}
                  onChange={(e) =>
                    setNewPost((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  placeholder="Enter image URL..."
                  className="bg-background"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCreatePost(false)}
                className="hover:bg-accent"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={createPost}
                disabled={!newPost.title || !newPost.content || isCreating}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  "Publish"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
