import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { BlogDetailClient } from "./blog-detail-client";
import { BlogDetailSkeleton } from "./blog-detail-skeleton";
import { api } from "@/app/api/config";
import { BlogPost } from "../type";
import { notFound } from "next/navigation";
import Link from "next/link";

interface BlogPostPageProps {
  params: {
    id: string;
  };
}

async function getBlogPost(
  id: string,
  token: string
): Promise<BlogPost | null> {
  try {
    const response = await fetch(api.blogById(parseInt(id)), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch blog post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { getToken, userId } = await auth();
  const token = await getToken({ template: "jwt-clerk" });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Unauthorized access. Please sign in.</p>
      </div>
    );
  }

  try {
    const post = await getBlogPost(params.id, token);

    if (!post) {
      notFound();
    }

    return (
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogDetailClient post={post} userId={userId} token={token} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in BlogPostPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load this blog post. Please try again later!
          </p>
          <Link
            href="/blog"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors inline-block"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
}
