"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Award, Sparkles } from "lucide-react";

const CountUp = ({
  end,
  duration = 2,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-10px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, inView]);

  return (
    <span ref={nodeRef} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const StatCard = ({
  icon: Icon,
  value,
  suffix = "",
  label,
  color,
  delay,
}: {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  color: string;
  delay: number;
}) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 },
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${color}40, transparent 60%)`,
        }}
      />

      <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8">
        <div
          className="absolute w-full h-full rounded-full opacity-20"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="absolute bottom-0 left-0 w-16 h-16 -mb-6 -ml-6">
        <div
          className="absolute w-full h-full rounded-full opacity-10"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="relative flex flex-col h-full p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <motion.div
            className="relative flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}20` }}
            whileHover={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-7 w-7" style={{ color }} />

            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 30],
                  y: [0, (Math.random() - 0.5) * 30],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6 + Math.random(),
                  repeatDelay: 1,
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5, duration: 0.3 }}
          >
            <Sparkles className="h-5 w-5 text-muted-foreground/30" />
          </motion.div>
        </div>

        <motion.div
          className="relative text-4xl sm:text-5xl font-bold mb-2"
          style={{ color }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          <CountUp end={value} suffix={suffix} />
        </motion.div>

        <motion.p
          className="text-base sm:text-lg font-medium text-foreground/80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.4 }}
        >
          {label}
        </motion.p>

        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: "40%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.6 }}
        />
      </div>
    </motion.div>
  );
};

const Stat = () => {
  const stats = [
    {
      icon: Users,
      value: 10000,
      suffix: "+",
      label: "Học sinh đang sử dụng",
      color: "#FF6B6B",
    },
    {
      icon: BookOpen,
      value: 500,
      suffix: "+",
      label: "Bài học tương tác",
      color: "#4ECDC4",
    },
    {
      icon: Award,
      value: 98,
      suffix: "%",
      label: "Phụ huynh hài lòng",
      color: "#FFD166",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"></div>

        <motion.div
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeOpacity="0.1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-md bg-primary"
              style={{
                width: 6 + (i % 3) * 4,
                height: 6 + (i % 3) * 4,
                left: `${15 + i * 15}%`,
                top: `${20 + ((i * 10) % 60)}%`,
                opacity: 0.1 + (i % 5) * 0.05,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 45, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              Thành tựu
            </span>
          </motion.div>
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Con số <span className="text-primary">ấn tượng</span>
          </motion.h2>
          <motion.p
            className="max-w-[900px] text-xs sm:text-sm md:text-base text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Chúng tôi tự hào về những thành tựu đã đạt được trong việc hỗ trợ
            học tập cho trẻ em.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              color={stat.color}
              delay={0.2 * index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stat;
