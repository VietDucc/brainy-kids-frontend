"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronRight, Sparkles, Stars, BookOpen, Rocket } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-8 sm:py-12 md:py-20 lg:py-28 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-yellow-200 opacity-70"
              style={{
                width: Math.random() * 80 + 40,
                height: Math.random() * 80 + 40,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0.8, 1],
                opacity: [0, 0.7, 0.5, 0.7],
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute text-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0.8, 1],
                opacity: [0, 1, 0.5, 1],
                rotate: 360,
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Stars size={Math.random() * 16 + 16} />
            </motion.div>
          ))}

          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
            <motion.div
              className="absolute -left-20 bottom-0"
              animate={{
                x: ["calc(-5vw)", "calc(105vw)"],
                y: [0, -40, -20, -60, 0],
              }}
              transition={{
                x: {
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 5,
                },
                y: {
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeatDelay: 5,
                },
              }}
            >
              <div className="relative">
                <Rocket
                  size={28}
                  className="text-primary transform rotate-90"
                  strokeWidth={1.5}
                />

                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-12 origin-top rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,100,50,0.8), rgba(255,100,50,0))",
                  }}
                  animate={{
                    height: [12, 24, 12],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: i % 2 === 0 ? "#FFD166" : "#FF6B6B",
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 20],
                      y: [0, Math.random() * 30 + 10],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-20 bottom-5"
              animate={{
                x: ["calc(-5vw)", "calc(105vw)"],
                y: [0, -20, -50, -30, 0],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  repeatDelay: 2,
                  delay: 7,
                },
                y: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.3, 0.6, 0.8, 1],
                  repeatDelay: 2,
                  delay: 7,
                },
              }}
            >
              <div className="relative">
                <Rocket
                  size={20}
                  className="text-blue-500 transform rotate-90"
                  strokeWidth={1.5}
                />

                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-8 origin-top rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(59,130,246,0.8), rgba(59,130,246,0))",
                  }}
                  animate={{
                    height: [8, 16, 8],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`particle-small-${i}`}
                    className="absolute -bottom-1 left-1/2 w-0.5 h-0.5 rounded-full bg-blue-300"
                    initial={{
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 15],
                      y: [0, Math.random() * 20 + 5],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 0.8 + Math.random() * 0.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className="absolute -left-10 bottom-10 hidden sm:block"
              animate={{
                x: ["calc(-5vw)", "calc(105vw)"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 8,
                delay: 3,
              }}
            >
              <div className="relative">
                <Rocket
                  size={14}
                  className="text-yellow-500 transform rotate-90"
                  strokeWidth={1.5}
                />

                <motion.div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-5 origin-top rounded-full"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(234,179,8,0.8), rgba(234,179,8,0))",
                  }}
                  animate={{
                    height: [5, 10, 5],
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
          <motion.div
            className="flex flex-col justify-center space-y-4 sm:space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-3 sm:space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary"
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Học tập vui vẻ mỗi ngày</span>
              </motion.div>

              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="text-primary">Giúp trẻ</span> học tập{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="inline-block text-orange-500"
                >
                  vui vẻ
                </motion.span>{" "}
                và{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="inline-block text-destructive dark:text-red-500"
                >
                  hiệu quả
                </motion.span>
              </motion.h1>

              <motion.p
                className="max-w-[600px] mx-auto lg:mx-0 text-sm sm:text-base md:text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Nền tảng học tập tương tác giúp trẻ phát triển ngôn ngữ, tư duy,
                toán học và lập trình một cách thú vị.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/courses">
                  <Button
                    variant="default"
                    size="default"
                    className="w-full sm:w-auto text-primary-foreground text-sm sm:text-base group h-10 sm:h-11"
                  >
                    <span className="text-white">Bắt đầu ngay</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:text-yellow-200 text-white" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="default"
                  variant="outline"
                  className="w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
                >
                  <BookOpen className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Tìm hiểu thêm
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center lg:justify-start gap-3 mt-2 sm:mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="flex -space-x-2 sm:-space-x-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-7 w-7 sm:h-10 sm:w-10 rounded-full border-2 border-background overflow-hidden"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    <Image
                      src={`/User${i + 1}.jpg`}
                      alt={`User${i + 1}`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                <span className="font-bold text-primary">1000+</span> học sinh
                đang sử dụng
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto aspect-video w-full max-w-[500px] lg:max-w-none overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-primary bg-background lg:order-last"
            initial={{ opacity: 0, x: 50, rotate: -5, y: 0 }}
            animate={{
              opacity: 1,
              x: 0,
              rotate: 0,
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
            <Image
              src="/kid_study.jpg"
              width={850}
              height={750}
              alt="Trẻ em đang học tập"
              className="object-cover"
              priority
            />

            <motion.div
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-background/90 backdrop-blur-sm rounded-full p-1 sm:p-2 shadow-lg"
              initial={{ scale: 0, y: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                y: [0, -10, 0],
              }}
              transition={{
                scale: { delay: 1.5, duration: 0.5 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Stars className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-400" />
            </motion.div>

            <motion.div
              className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-background/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{
                y: [50, 0, -10, 0],
                opacity: 1,
              }}
              transition={{
                opacity: { delay: 1.8, duration: 0.5 },
                y: {
                  times: [0, 0.3, 0.65, 1],
                  duration: 2,
                  delay: 1.8,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-medium">
                    Tiến độ học tập
                  </div>
                  <div className="text-xs sm:text-sm font-bold">
                    85% hoàn thành
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
