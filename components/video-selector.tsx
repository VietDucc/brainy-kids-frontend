"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Video {
  id: number | string;
  title: string;
  url: string;
  subtitleUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  category?: string;
}

interface VideoSelectorProps {
  videos: Video[];
  selectedVideo: Video;
  onSelectVideo: (video: Video) => void;
}

export default function VideoSelector({
  videos,
  selectedVideo,
  onSelectVideo,
}: VideoSelectorProps) {
  return (
    <Card className="border border-purple-100 dark:border-purple-900 overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-md">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3">
          <h3 className="font-bold text-white">Recommended Videos</h3>
        </div>
        <div className="p-3 space-y-3">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden"
            >
              <Button
                variant="ghost"
                onClick={() => onSelectVideo(video)}
                className={cn(
                  "w-full p-2 h-auto justify-start text-left rounded-lg",
                  selectedVideo.id === video.id
                    ? "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800"
                    : "hover:bg-purple-50 dark:hover:bg-purple-900/20"
                )}
              >
                <div className="flex items-center w-full gap-3">
                  {video.thumbnailUrl ? (
                    <div className="relative min-w-[80px] h-[45px] bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                      <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${video.thumbnailUrl})`,
                        }}
                      />
                      {selectedVideo.id === video.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="bg-purple-600 rounded-full p-1">
                            <Play size={12} className="text-white" />
                          </div>
                        </div>
                      )}
                      {video.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      {selectedVideo.id === video.id ? (
                        <Check
                          size={12}
                          className="text-purple-600 dark:text-purple-300"
                        />
                      ) : (
                        <Play
                          size={12}
                          className="text-purple-600 dark:text-purple-300"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "font-medium line-clamp-1 text-sm",
                        selectedVideo.id === video.id
                          ? "text-purple-700 dark:text-purple-300"
                          : "text-gray-800 dark:text-gray-200"
                      )}
                    >
                      {video.title}
                    </span>
                    {video.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {video.category}
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
