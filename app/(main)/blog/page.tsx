"use client";

import { useState, useEffect } from "react";
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
import Loading from "@/app/loading";

export default function BlogPage() {
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
    authorId: "",
    authorName: "",
    authorImg: "",
  });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const fetchPosts = async () => {
        const response = await fetch("/api/blog");
        const data = await response.json();
        setPosts(data);
      };
      fetchPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.content,
          imageUrl: newPost.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      setPosts([data, ...posts]);

      setNewPost({
        title: "",
        content: "",
        imageUrl: "",
        authorId: "",
        authorName: "",
        authorImg: "",
      });
      setShowCreatePost(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading || !posts.length) {
    return <Loading text="posts..." />;
  }

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
          {posts.map((post) => (
            <BlogPostComponent
              key={post.id}
              post={post}
              viewMode={viewMode}
              onClick={() => router.push(`/blog/${post.id}`)}
            />
          ))}
        </div>

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
              >
                Cancel
              </Button>
              <Button
                onClick={createPost}
                disabled={!newPost.title || !newPost.content}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
