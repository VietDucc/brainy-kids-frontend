"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "../type";
import BlogPostDetail from "../components/BlogPostDetail";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";
export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) {
          throw new Error("Post not found");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          variant: "destructive",
          title: "Failed to fetch post",
          description: "Please try again",
        });
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  if (loading || !post) {
    return <Loading text="post..." />;
  }

  return (
    <BlogPostDetail
      post={post}
      onBack={() => router.push("/blog")}
      authorId={post.authorId}
    />
  );
}
