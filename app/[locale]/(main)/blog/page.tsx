import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { BlogClient } from "./blog-client";
import { BlogSkeleton } from "./blog-skeleton";
import { api } from "@/app/api/config";
import { BlogPost } from "./type";

async function getBlogPosts(token: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(api.blog, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const data = await response.json();

    return data.sort(
      (a: BlogPost, b: BlogPost) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export default async function BlogPage() {
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
    const posts = await getBlogPosts(token);

    return (
      <Suspense fallback={<BlogSkeleton />}>
        <BlogClient initialPosts={posts} token={token} userId={userId} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in BlogPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load the blog posts. Please try again later!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
