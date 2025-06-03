"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/video-player";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { VIDEOS } from "../data";
export default function VideoDetailPage() {
  const router = useRouter();
  const { videoId } = useParams();
  const [video, setVideo] = useState<(typeof VIDEOS)[0] | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<typeof VIDEOS>([]);

  useEffect(() => {
    if (videoId) {
      const foundVideo = VIDEOS.find((v) => v.id === videoId);
      if (foundVideo) {
        setVideo(foundVideo);

        if (foundVideo.relatedVideos) {
          const related = foundVideo.relatedVideos
            .map((id) => VIDEOS.find((v) => v.id === id))
            .filter(Boolean) as typeof VIDEOS;
          setRelatedVideos(related);
        }
      } else {
        router.push("/videos");
      }
    }
  }, [videoId, router]);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-6 md:p-0">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center">
          <Link href="/videos">
            <Button variant="ghost">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Videos
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background/30 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-border"
            >
              <VideoPlayer
                selectedVideo={{
                  id: video.id,
                  title: video.title,
                  url: video.url,
                  subtitleUrl: video.subtitleUrl,
                }}
              />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {video.category}
                </span>
                <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {video.difficulty}
                </span>
                <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {video.duration}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <RotateCcw className="h-5 w-5 mr-2" />
              Related Videos
            </h2>
            <div className="space-y-4">
              {relatedVideos.map((relVideo) => (
                <motion.div
                  key={relVideo.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/videos/${relVideo.id}`}>
                    <Button variant="ghost" className="p-0 h-auto w-full">
                      <Card className="w-full overflow-hidden flex border-border bg-card/70 backdrop-blur-sm group-hover:bg-card transition-all duration-300">
                        <div className="relative w-32 h-20">
                          <Image
                            src={relVideo.thumbnailUrl}
                            alt={relVideo.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="text-white font-medium text-xs bg-black/50 px-2 py-1 rounded">
                              {relVideo.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 p-3 text-left">
                          <h3 className="font-medium text-sm line-clamp-2 text-foreground">
                            {relVideo.title}
                          </h3>
                          <div className="mt-1 flex">
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                              {relVideo.category}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Button>
                  </Link>
                </motion.div>
              ))}

              <Link href="/videos">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Videos
                </Button>
              </Link>
            </div>

            <Card className="p-4 bg-card/70 backdrop-blur-sm border-border mt-6">
              <h3 className="font-semibold text-foreground mb-2">
                Your Learning Progress
              </h3>
              <div className="h-2.5 bg-accent rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "35%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                You&apos;ve watched 3 out of 6 videos in our collection!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
