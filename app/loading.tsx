"use client";

import { useEffect, useState } from "react";

export default function ProfessionalLoading({ text = "Đang xử lý..." }) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const emojis = ["🌠", "⭐", "🌟", "✨", "💫", "🌍", "🚀", "🌌"];

  useEffect(() => {
    setMounted(true);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return prev;

        if (prev >= 85 && !isCompleting) {
          // Slow down near the end
          return prev + Math.random() * 0.5;
        }

        if (isCompleting) {
          // Speed up to completion
          return prev + (100 - prev) * 0.15;
        }

        // Normal progress
        const increment = Math.max(0.5, Math.random() * (20 - prev * 0.15));
        const nextProgress = prev + increment;

        // If we're getting close to the end, start slowing down
        if (nextProgress >= 85) {
          setIsCompleting(true);
        }

        return nextProgress;
      });
    }, 200);

    const emojiInterval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % emojis.length);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(emojiInterval);
    };
  }, [isCompleting]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center overflow-hidden">
      {/* Galaxy background */}
      <div className="absolute inset-0">
        {/* Stars layer */}
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Meteors */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-20 bg-gradient-to-r from-transparent via-white to-transparent animate-meteor"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${45 + Math.random() * 45}deg)`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}

        {/* Nebula effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 animate-nebula" />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/10 via-indigo-500/10 to-violet-500/10 animate-nebula-reverse" />
      </div>

      {/* Main loading container */}
      <div
        className={`relative z-10 transition-all duration-1000 ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Cosmic rings */}
        <div className="absolute inset-0 -m-20">
          <div
            className="w-40 h-40 border-2 border-cyan-500/30 rounded-full animate-spin-slow"
            style={{ animationDuration: "20s" }}
          />
        </div>
        <div className="absolute inset-0 -m-16">
          <div
            className="w-32 h-32 border-2 border-purple-500/30 rounded-full animate-spin-reverse"
            style={{ animationDuration: "15s" }}
          />
        </div>
        <div className="absolute inset-0 -m-12">
          <div
            className="w-24 h-24 border-2 border-pink-500/30 rounded-full animate-spin-slow"
            style={{ animationDuration: "10s" }}
          />
        </div>

        {/* Center content */}
        <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
          {/* Logo/Icon area */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              {/* Cosmic glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" />

              {/* Emoji display */}
              <div className="relative text-6xl animate-float">
                {emojis[currentEmoji]}
              </div>

              {/* Orbiting stars */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${angle}deg) translateY(-3rem)`,
                  }}
                >
                  <div
                    className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-64 h-2 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent mb-2">
              {text.split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>

            <div className="flex justify-center items-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(0.5);
          }
        }

        @keyframes meteor {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(200%) translateY(200%) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes nebula {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }

        @keyframes nebula-reverse {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1.2);
          }
          50% {
            opacity: 0.3;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-meteor {
          animation: meteor 5s linear infinite;
        }

        .animate-nebula {
          animation: nebula 10s ease-in-out infinite;
        }

        .animate-nebula-reverse {
          animation: nebula-reverse 10s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
