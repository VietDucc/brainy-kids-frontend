"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Rocket, Lightbulb, Trophy, ArrowRight } from "lucide-react";

const WorkFlow = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Tạo tài khoản",
      description:
        "Đăng ký tài khoản và tạo hồ sơ cho con bạn với các thông tin về độ tuổi và sở thích.",
      icon: Rocket,
      color: "#FF6B6B",
    },
    {
      number: 2,
      title: "Khám phá bài học",
      description:
        "Truy cập vào kho bài học và trò chơi đa dạng được thiết kế phù hợp với độ tuổi.",
      icon: Lightbulb,
      color: "#4ECDC4",
    },
    {
      number: 3,
      title: "Học và tiến bộ",
      description:
        "Theo dõi sự tiến bộ của con bạn và nhận báo cáo chi tiết về quá trình học tập.",
      icon: Trophy,
      color: "#FFD166",
    },
  ];

  const bgElements = [
    { x: "10%", y: "20%", size: 80, color: "hsl(var(--primary))", delay: 0 },
    { x: "85%", y: "15%", size: 100, color: "#FFD166", delay: 1 },
    { x: "25%", y: "85%", size: 120, color: "#FF6B6B", delay: 2 },
    { x: "70%", y: "75%", size: 90, color: "hsl(var(--primary))", delay: 3 },
    { x: "50%", y: "30%", size: 70, color: "#FFD166", delay: 4 },
    { x: "15%", y: "50%", size: 110, color: "#FF6B6B", delay: 5 },
    { x: "80%", y: "60%", size: 85, color: "hsl(var(--primary))", delay: 2.5 },
    { x: "40%", y: "10%", size: 95, color: "#FFD166", delay: 1.5 },
    { x: "60%", y: "90%", size: 75, color: "#FF6B6B", delay: 3.5 },
    { x: "30%", y: "40%", size: 65, color: "hsl(var(--primary))", delay: 4.5 },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-10 sm:py-14 md:py-20 lg:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/80 to-background/50"></div>

        {isClient &&
          bgElements.map((el, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: el.size,
                height: el.size,
                backgroundColor: el.color,
                left: el.x,
                top: el.y,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1, 0.9, 1],
                opacity: [0.1, 0.2, 0.15, 0.2],
                x: [0, 10, -10, 0],
                y: [0, -10, 10, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
                delay: el.delay,
                ease: "easeInOut",
              }}
            />
          ))}

        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-40 hidden md:block"
          viewBox="0 0 800 100"
        >
          <motion.path
            d="M 50,50 C 150,20 250,80 400,50 C 550,20 650,80 750,50"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeDasharray="10,10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <motion.circle
            cx="0"
            cy="0"
            r="8"
            fill="hsl(var(--primary))"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <animateMotion
              path="M 50,50 C 150,20 250,80 400,50 C 550,20 650,80 750,50"
              dur="6s"
              repeatCount="indefinite"
              rotate="auto"
            />
          </motion.circle>
        </svg>

        <div className="absolute top-10 left-10 text-primary/20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <path
                d="M60,10 L70,40 L100,40 L75,60 L85,90 L60,75 L35,90 L45,60 L20,40 L50,40 Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        </div>

        <div className="absolute bottom-10 right-10 text-primary/20">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            <svg width="150" height="150" viewBox="0 0 150 150">
              <path
                d="M75,20 L90,60 L135,60 L100,85 L115,125 L75,105 L35,125 L50,85 L15,60 L60,60 Z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 sm:px-8 md:px-10 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 text-center mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Dễ dàng bắt đầu
              </span>
            </motion.div>
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Cách thức <span className="text-primary">hoạt động</span>
            </motion.h2>
            <motion.p
              className="max-w-[900px] text-xs sm:text-sm md:text-base text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Quy trình học tập đơn giản, hiệu quả và thú vị cho trẻ em mọi lứa
              tuổi.
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="mx-auto grid max-w-4xl items-center gap-4 sm:gap-6 md:gap-8 py-2 sm:py-4 md:py-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col items-center space-y-3 sm:space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.2 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Step card */}
              <motion.div
                className="relative flex h-full w-full flex-col items-center space-y-2 sm:space-y-3 rounded-xl sm:rounded-2xl bg-card p-4 sm:p-5 md:p-6 text-center shadow-sm border border-border"
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                {/* Number badge */}
                <motion.div
                  className="absolute -top-4 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-sm sm:text-base font-bold text-primary-foreground shadow-md"
                  style={{ backgroundColor: step.color }}
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  {step.number}
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-xl sm:rounded-2xl"
                  style={{ backgroundColor: `${step.color}20` }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <step.icon
                    className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                    style={{ color: step.color }}
                  />
                  <motion.div
                    className="absolute right-0 top-0 sm:-top-1 sm:-right-1 h-2 w-2 sm:h-3 sm:w-3 rounded-full"
                    style={{ backgroundColor: step.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 * index + 0.5,
                    }}
                  />
                </motion.div>

                {/* Content */}
                <h3
                  className="text-sm sm:text-base md:text-lg font-bold"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                  {step.description}
                </p>

                {/* Arrow to next step - only show between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block lg:-right-6">
                    <motion.div
                      animate={{
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkFlow;
