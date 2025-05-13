"use client";
import React from "react";
import {
  BookOpen,
  BrainCircuit,
  Calculator,
  Code,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group relative flex flex-col items-center space-y-2 sm:space-y-3 overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 md:p-6 shadow-sm transition-all"
    >
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-5"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      />

      <motion.div
        className={`relative flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-lg sm:rounded-xl shadow-sm`}
        style={{
          backgroundColor: `${color}15`,
          borderColor: `${color}30`,
          borderWidth: 1,
        }}
        whileHover={{
          rotate: [0, -5, 5, -3, 0],
          scale: 1.05,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 0 }}
          whileHover={{ rotate: [0, -10, 10, -5, 0] }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <Icon
            className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7`}
            style={{ color }}
          />
        </motion.div>

        <div
          className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <div
          className="absolute -bottom-0.5 -left-0.5 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
      </motion.div>

      <div className="z-10 flex flex-col items-center space-y-0.5 sm:space-y-1 text-center">
        <h3
          className="text-sm sm:text-base md:text-lg font-bold"
          style={{ color: `${color}` }}
        >
          {title}
        </h3>
        <p className="text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: delay + 0.4,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
        className="absolute -right-0.5 -top-0.5 sm:-right-1 sm:-top-1"
      >
        <Sparkles
          className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5"
          style={{ color }}
        />
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 transition-transform duration-300 group-hover:scale-100"
        style={{
          backgroundColor: color,
          transform: "scaleX(0.6)",
          transformOrigin: "center",
        }}
      />
    </motion.div>
  );
};

const Feature = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Ngôn ngữ",
      description:
        "Học đọc, viết và phát triển vốn từ vựng qua các trò chơi tương tác.",
      color: "#FF6B6B",
    },
    {
      icon: BrainCircuit,
      title: "Tư duy",
      description:
        "Phát triển kỹ năng giải quyết vấn đề và tư duy logic qua các thử thách.",
      color: "#4ECDC4",
    },
    {
      icon: Calculator,
      title: "Toán học",
      description:
        "Học toán qua các bài tập tương tác và trò chơi số học thú vị.",
      color: "#FFD166",
    },
    {
      icon: Code,
      title: "Lập trình",
      description:
        "Làm quen với tư duy lập trình qua các trò chơi kéo thả đơn giản.",
      color: "#b433bd",
    },
  ];

  return (
    <section
      id="features"
      className="py-10 sm:py-14 md:py-20 lg:py-28 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.svg
          className="absolute top-0 left-0 text-primary/5 w-36 sm:w-48 md:w-64 h-36 sm:h-48 md:h-64 -translate-x-1/4 -translate-y-1/4"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 0, scale: 0.8 }}
          animate={{
            rotate: 360,
            scale: [0.8, 0.85, 0.8],
          }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: "linear" },
            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.4,81.4,26.8,73.6,38.6C65.8,50.4,55.9,60.6,43.7,66.5C31.6,72.4,17.3,74,2.4,71.6C-12.5,69.1,-27.9,62.7,-41.2,54.2C-54.5,45.7,-65.7,35.1,-70.8,22.2C-75.9,9.3,-74.9,-5.9,-70.8,-19.5C-66.7,-33.1,-59.5,-45.1,-49,-56.5C-38.5,-67.9,-24.7,-78.7,-9.2,-83.9C6.3,-89.1,30.7,-83.7,44.7,-76.4Z"
            transform="translate(100 100)"
          />
        </motion.svg>
        <motion.svg
          className="absolute bottom-0 right-0 text-primary/5 w-36 sm:w-48 md:w-64 h-36 sm:h-48 md:h-64 translate-x-1/4 translate-y-1/4"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ rotate: 0, scale: 0.8 }}
          animate={{
            rotate: -360,
            scale: [0.8, 0.85, 0.8],
          }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: "linear" },
            scale: { duration: 20, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <path
            fill="currentColor"
            d="M39.9,-65.7C54.3,-60.5,70.2,-54.3,79.7,-42.5C89.2,-30.7,92.3,-13.4,89.5,2.8C86.7,19,78,34,67.8,46.7C57.6,59.4,45.9,69.8,32.6,74.3C19.2,78.9,4.3,77.5,-10.7,75.2C-25.7,72.9,-40.8,69.6,-53.8,61.5C-66.8,53.4,-77.7,40.4,-83.3,25.5C-88.9,10.7,-89.2,-6,-83.8,-20.1C-78.3,-34.2,-67.1,-45.7,-54.2,-51.9C-41.3,-58.1,-26.7,-59,-14.1,-65.5C-1.5,-72,11.1,-84.1,22.8,-83.4C34.5,-82.7,45.2,-69.2,39.9,-65.7Z"
            transform="translate(100 100)"
          />
        </motion.svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
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
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-xs font-medium text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Tính năng nổi bật
              </span>
            </motion.div>
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            >
              Học tập <span className="text-primary">đa dạng lĩnh vực</span>
            </motion.h2>
            <motion.p
              className="max-w-[900px] text-xs sm:text-sm md:text-base text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
            >
              Nền tảng của chúng tôi cung cấp nhiều lĩnh vực học tập khác nhau,
              giúp trẻ phát triển toàn diện.
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="mx-auto grid max-w-4xl items-center gap-3 sm:gap-4 md:gap-6 py-2 sm:py-4 md:py-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={0.3 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
