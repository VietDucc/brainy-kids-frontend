import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          Post Not Found
        </h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          The blog post you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
