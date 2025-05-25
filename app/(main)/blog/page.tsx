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
import BlogPostDetail from "./components/BlogPostDetail";
import BlogFilters from "./components/BlogFilters";
import BlogPostComponent from "./components/BlogPost";
import Editor from "./components/Editor";

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
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
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const response = await fetch("/api/blog");
        const data = await response.json();
        setPosts(data);
      };
      fetchPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
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
      });
      setShowCreatePost(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (selectedPost) {
    return (
      <BlogPostDetail
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
      />
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="shadow-sm border-b">
        <div className="max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
              <Badge variant="outline">Professional</Badge>
            </div>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <BlogFilters
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Posts Grid/List */}
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
              onClick={() => setSelectedPost(post)}
            />
          ))}
        </div>

        {/* Create Post Dialog */}
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Create New Post
              </DialogTitle>
              <DialogDescription>
                Share your thoughts with the world
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter an engaging title..."
                />
              </div>

              <div className="grid gap-2">
                <Label>Content</Label>
                <Editor
                  value={newPost.content}
                  onChange={(content) =>
                    setNewPost((prev) => ({ ...prev, content }))
                  }
                  placeholder="Write your post content here..."
                />
              </div>

              <div className="grid gap-2">
                <Label>Image URL</Label>
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
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreatePost(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createPost}
                disabled={!newPost.title || !newPost.content}
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
