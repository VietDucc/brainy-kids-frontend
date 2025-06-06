"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "react-i18next";

interface Voice {
  id: number;
  voiceUrl: string;
  pageIndex: number;
}

interface Book {
  id: number;
  title: string;
  pdfUrl: string;
  voices: Voice[];
}

interface BookDetailClientProps {
  bookData: Book | null;
}

export function BookDetailClient({ bookData }: BookDetailClientProps) {
  const [currentVoiceIndex, setCurrentVoiceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { t } = useTranslation("audiobook");

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleNext = useCallback(() => {
    if (bookData && currentVoiceIndex < bookData.voices.length - 1) {
      setCurrentVoiceIndex(currentVoiceIndex + 1);
      setIsPlaying(false);
    }
  }, [bookData, currentVoiceIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => handleNext();
    const handleLoadStart = () => {
      setDuration(0);
      setCurrentTime(0);
    };
    const handleCanPlay = () => {
      updateDuration();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("ended", handleEnded);

    // Reset audio state when voice changes
    setCurrentTime(0);
    setIsPlaying(false);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [bookData, currentVoiceIndex, handleNext]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentVoiceIndex > 0) {
      setCurrentVoiceIndex(currentVoiceIndex - 1);
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration || isNaN(duration)) return;

    const seekTime = value[0];

    // Ensure seek time is within valid range
    if (seekTime >= 0 && seekTime <= duration) {
      try {
        audio.currentTime = seekTime;
        setCurrentTime(seekTime);
      } catch (error) {
        console.error("Error seeking audio:", error);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!bookData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("book_not_found")}</h1>
          <Link href="/audio-book">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back_to_home")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentVoice = bookData.voices[currentVoiceIndex];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/audio-book">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Button>
        </Link>
        <span className="text-muted-foreground font-bold text-md md:text-xl text-center w-full">
          {bookData.title}
        </span>
      </div>

      <div className="space-y-6">
        <Card className="sticky top-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardContent className="p-4">
            {currentVoice && (
              <>
                <audio
                  ref={audioRef}
                  src={currentVoice.voiceUrl}
                  preload="metadata"
                />

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-sm">{bookData.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {t("page")} {currentVoice.pageIndex} (
                        {currentVoiceIndex + 1} {t("of")}{" "}
                        {bookData.voices.length})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentVoiceIndex === 0}
                      className="p-2"
                      title={t("controls.previous_page")}
                    >
                      <SkipBack className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={handlePlayPause}
                      className="h-9 w-9 p-0"
                      title={t("controls.play_pause")}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={
                        currentVoiceIndex === bookData.voices.length - 1
                      }
                      className="p-2"
                      title={t("controls.next_page")}
                    >
                      <SkipForward className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-1">
                    <Slider
                      value={[currentTime]}
                      max={duration > 0 ? duration : 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                      title={t("controls.seek")}
                      disabled={!duration || duration === 0}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {bookData.voices.map((voice, index) => (
                      <Button
                        key={voice.id}
                        variant={
                          index === currentVoiceIndex ? "default" : "outline"
                        }
                        size="sm"
                        className="h-7 w-8 text-xs p-0"
                        onClick={() => {
                          setCurrentVoiceIndex(index);
                          setIsPlaying(false);
                        }}
                        title={`${t("controls.go_to_page")} ${voice.pageIndex}`}
                      >
                        {voice.pageIndex}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="px-0">
            <div className="w-full" style={{ height: "150vh" }}>
              <iframe
                src={`${bookData.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="w-full h-full"
                title={`PDF viewer for ${bookData.title}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
