"use client";

import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import SubtitleDisplay from "./subtitle-display";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";

interface VideoProps {
  id?: number | string;
  title: string;
  url: string;
  subtitleUrl: string;
}

interface SubtitleItem {
  start: number;
  end: number;
  text: string;
}

export default function VideoPlayer({
  selectedVideo,
}: {
  selectedVideo: VideoProps;
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentEnglishSubtitle, setCurrentEnglishSubtitle] = useState("");
  const [currentVietnameseSubtitle, setCurrentVietnameseSubtitle] =
    useState("");
  const [englishSubtitles, setEnglishSubtitles] = useState<SubtitleItem[]>([]);
  const [vietnameseSubtitles, setVietnameseSubtitles] = useState<
    SubtitleItem[]
  >([]);
  const playerRef = useRef<ReactPlayer>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const parseSRT = (srtText: string): SubtitleItem[] => {
    const subtitles: SubtitleItem[] = [];
    const entries = srtText.trim().split(/\r?\n\r?\n/);

    entries.forEach((entry) => {
      const lines = entry.split(/\r?\n/);
      if (lines.length >= 3) {
        const timestamps = lines[1].split(" --> ");
        if (timestamps.length === 2) {
          const start = convertTimestampToSeconds(timestamps[0]);
          const end = convertTimestampToSeconds(timestamps[1]);
          const text = lines.slice(2).join(" ");
          subtitles.push({ start, end, text: text.trim() });
        }
      }
    });

    return subtitles;
  };

  const convertTimestampToSeconds = (timestamp: string) => {
    const parts = timestamp.replace(",", ".").trim().split(":");
    let seconds = 0;

    if (parts.length === 3) {
      const [hours, minutes, secondsPart] = parts;
      seconds =
        Number.parseInt(hours) * 3600 +
        Number.parseInt(minutes) * 60 +
        Number.parseFloat(secondsPart);
    }

    return seconds;
  };

  useEffect(() => {
    // Load English subtitles
    fetch(selectedVideo.subtitleUrl)
      .then((response) => response.text())
      .then((text) => {
        const parsedSubtitles = parseSRT(text);
        setEnglishSubtitles(parsedSubtitles);
      })
      .catch((error) => {
        console.error("Error loading English subtitles:", error);
      });

    // Generate Vietnamese subtitle URL and load it
    const getVietnameseSubtitleUrl = () => {
      const urlParts = selectedVideo.subtitleUrl.split("/");
      const filename = urlParts.pop() || "";
      return [...urlParts, `vi-${filename}`].join("/");
    };

    const viSubtitleUrl = getVietnameseSubtitleUrl();

    fetch(viSubtitleUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load Vietnamese subtitles: ${response.status}`
          );
        }
        return response.text();
      })
      .then((text) => {
        const parsedSubtitles = parseSRT(text);
        setVietnameseSubtitles(parsedSubtitles);
      })
      .catch((error) => {
        console.warn("Error loading Vietnamese subtitles:", error);
        // If Vietnamese subtitles fail to load, we can still continue with just English
      });
  }, [selectedVideo.subtitleUrl]);

  const showControls = () => {
    setControlsVisible(true);

    // Clear any existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Set a new timeout to hide controls after 3 seconds
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setControlsVisible(false);
      }
    }, 3000);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    showControls();
  }, [playing]);

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    // Only update if we're not currently seeking
    if (!seeking) {
      setPlayed(state.played);
      setCurrentTime(state.playedSeconds);

      // Find current English subtitle
      const currentEnSub = englishSubtitles.find(
        (sub) =>
          state.playedSeconds >= sub.start && state.playedSeconds <= sub.end
      );
      setCurrentEnglishSubtitle(currentEnSub ? currentEnSub.text : "");

      // Find current Vietnamese subtitle
      const currentViSub = vietnameseSubtitles.find(
        (sub) =>
          state.playedSeconds >= sub.start && state.playedSeconds <= sub.end
      );
      setCurrentVietnameseSubtitle(currentViSub ? currentViSub.text : "");
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
    showControls();
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setMuted(value[0] === 0);
  };

  const handleSeekStart = () => {
    setSeeking(true);
    setPlaying(false);
  };

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
  };

  const handleSeekEnd = (value: number[]) => {
    setSeeking(false);
    playerRef.current?.seekTo(value[0]);
    setPlaying(true);
    showControls();
  };

  const getVolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  const skipBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    playerRef.current?.seekTo(newTime / duration);
    showControls();
  };

  const skipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    playerRef.current?.seekTo(newTime / duration);
    showControls();
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!isFullscreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="space-y-5">
      <div
        ref={playerContainerRef}
        className={cn(
          "relative rounded-xl overflow-hidden bg-background shadow-xl border border-border",
          isFullscreen ? "w-screen h-screen" : "aspect-video"
        )}
        onMouseMove={showControls}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            loading ? "opacity-100" : "opacity-0 pointer-events-none",
            "transition-opacity duration-500 z-20"
          )}
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Video title overlay - top */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-background/70 to-transparent z-20",
            "transition-opacity duration-300",
            controlsVisible || !playing ? "opacity-100" : "opacity-0"
          )}
        >
          <h2 className="text-lg md:text-xl font-medium text-foreground line-clamp-1">
            {selectedVideo.title}
          </h2>
        </div>

        <ReactPlayer
          ref={playerRef}
          url={selectedVideo.url}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={() => setLoading(false)}
          onBuffer={() => setLoading(true)}
          onBufferEnd={() => setLoading(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
              },
            },
          }}
        />

        {/* Overlay for pause/play on click */}
        <div
          className="absolute inset-0 cursor-pointer z-10"
          onClick={handlePlayPause}
        />

        {/* Play button overlay when paused */}
        {!playing && !loading && (
          <div className="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
            <div className="bg-background/40 p-5 rounded-full">
              <Play size={32} className="text-primary" />
            </div>
          </div>
        )}

        {/* Controls - Always visible on mobile, visible on hover for desktop */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-4 transition-opacity duration-300 z-30",
            controlsVisible || !playing ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress bar */}
          <Slider
            max={1}
            step={0.001}
            value={[played]}
            onValueChange={handleSeekChange}
            onValueCommit={handleSeekEnd}
            onPointerDown={handleSeekStart}
            className="cursor-pointer mb-3"
          />

          {/* Time and controls */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="h-8 w-8 text-primary hover:bg-primary/20 rounded-full"
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={skipBackward}
                className="h-8 w-8 text-primary hover:bg-primary/20 rounded-full hidden sm:flex"
              >
                <SkipBack size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={skipForward}
                className="h-8 w-8 text-primary hover:bg-primary/20 rounded-full hidden sm:flex"
              >
                <SkipForward size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  playerRef.current?.seekTo(0);
                  setPlaying(true);
                }}
                className="h-8 w-8 text-primary hover:bg-primary/20 rounded-full hidden sm:flex"
              >
                <RotateCcw size={16} />
              </Button>
            </div>

            {/* Time display */}
            <span className="text-xs font-medium text-primary">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex items-center space-x-2">
              {/* Volume control */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMuted(!muted)}
                  className="h-8 w-8 text-primary hover:bg-primary/20 rounded-full"
                >
                  {getVolumeIcon()}
                </Button>
                <div className="w-20">
                  <Slider
                    max={1}
                    step={0.01}
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Fullscreen button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="h-8 w-8 text-primary hover:bg-primary/20 rounded-full"
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle container - always visible */}
      <SubtitleDisplay
        englishText={currentEnglishSubtitle}
        vietnameseText={currentVietnameseSubtitle}
      />
    </div>
  );
}
