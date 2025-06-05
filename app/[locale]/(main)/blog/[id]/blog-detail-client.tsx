"use client";

import { BlogPost } from "../type";
import BlogPostDetail from "../components/BlogPostDetail";
import { useRouter } from "next/navigation";

interface BlogDetailClientProps {
  post: BlogPost;
  userId: string;
  token: string;
}

export function BlogDetailClient({
  post,
  userId,
  token,
}: BlogDetailClientProps) {
  const router = useRouter();

  return (
    <BlogPostDetail
      post={post}
      onBack={() => router.push("/blog")}
      authorId={post.authorId}
      userId={userId}
      token={token}
    />
  );
}
