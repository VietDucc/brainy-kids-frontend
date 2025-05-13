"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const Feedback = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      content:
        "Con tôi rất thích học trên nền tảng này. Các bài học thú vị và con tiến bộ rõ rệt trong việc học toán.",
      author: "Nguyễn Thị Hương",
      role: "Phụ huynh học sinh lớp 2",
      avatar: "/User1.jpg",
      rating: 5,
      color: "#FF6B6B",
    },
    {
      content:
        "Giao diện thân thiện và dễ sử dụng. Con tôi đã học được nhiều từ vựng mới và rất hào hứng mỗi khi học.",
      author: "Trần Văn Minh",
      role: "Phụ huynh học sinh lớp 1",
      avatar: "/User2.jpg",
      rating: 5,
      color: "#4ECDC4",
    },
    {
      content:
        "Tôi rất ấn tượng với cách nền tảng này giúp con tôi học lập trình cơ bản. Các bài học rất trực quan.",
      author: "Lê Thị Hà",
      role: "Phụ huynh học sinh lớp 4",
      avatar: "/User3.jpg",
      rating: 5,
      color: "#FFD166",
    },
    {
      content:
        "Các trò chơi học tập rất cuốn hút, con tôi thường xuyên đòi được học thêm mỗi ngày.",
      author: "Phạm Văn Đức",
      role: "Phụ huynh học sinh lớp 3",
      avatar: "/User4.jpg",
      rating: 5,
      color: "#6A0572",
    },
    {
      content:
        "Tôi thấy con mình tự tin hơn rất nhiều khi giao tiếp bằng tiếng Anh sau khi học trên nền tảng này.",
      author: "Hoàng Thị Mai",
      role: "Phụ huynh học sinh lớp 5",
      avatar: "/User5.jpg",
      rating: 5,
      color: "#58CC02",
    },
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  // Get visible testimonials (current, previous, and next)
  const visibleTestimonials = () => {
    const result = [];
    for (let i = -1; i <= 1; i++) {
      const index =
        (activeIndex + i + testimonials.length) % testimonials.length;
      result.push({
        ...testimonials[index],
        position: i, // -1 = previous, 0 = current, 1 = next
      });
    }
    return result;
  };

  return (
    <section
      id="testimonials"
      className="relative py-10 sm:py-16 md:py-24 lg:py-28 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/80"></div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.5,
                scale: 0.5 + Math.random() * 1.5,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
            </motion.div>
          ))}

          <motion.div
            className="absolute top-10 left-10 text-primary/10 hidden sm:block"
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          >
            <Quote size={60} />
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-10 text-primary/10 hidden sm:block"
            animate={{ rotate: [0, -10, 0, 10, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          >
            <Quote size={60} />
          </motion.div>

          <motion.div
            className="absolute -top-20 -right-20 h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-yellow-200 opacity-20"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />

          <motion.div
            className="absolute -bottom-40 -left-40 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-primary opacity-10"
            animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-3 sm:space-y-4">
            <motion.div
              className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="flex items-center gap-1.5">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                Phản hồi từ phụ huynh
              </span>
            </motion.div>
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tighter"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Phụ huynh nói gì về{" "}
              <span className="text-primary">chúng tôi</span>
            </motion.h2>
            <motion.p
              className="max-w-[900px] text-xs sm:text-sm md:text-base text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Hàng ngàn phụ huynh đã tin tưởng chúng tôi trong việc hỗ trợ con
              em họ học tập.
            </motion.p>
          </div>
        </motion.div>

        <div className="relative mx-auto max-w-4xl sm:max-w-5xl px-4 sm:px-8">
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px] overflow-visible">
            <AnimatePresence mode="popLayout">
              {visibleTestimonials().map((testimonial) => (
                <motion.div
                  key={`${testimonial.author}-${testimonial.position}`}
                  className="absolute top-0 w-full md:w-2/3 mx-auto left-0 right-0 p-4 sm:p-6 md:p-8"
                  initial={{
                    opacity: 0,
                    x: testimonial.position * 100 + "%",
                    scale: testimonial.position === 0 ? 0.8 : 0.6,
                  }}
                  animate={{
                    opacity: testimonial.position === 0 ? 1 : 0.5,
                    x: testimonial.position * 100 + "%",
                    scale: testimonial.position === 0 ? 1 : 0.8,
                    zIndex: testimonial.position === 0 ? 10 : 5,
                  }}
                  exit={{
                    opacity: 0,
                    x: -100 + "%",
                    scale: 0.6,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className="relative flex flex-col justify-between rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 shadow-md h-[200px] sm:h-[350px] md:h-[300px] bg-card"
                    style={{
                      borderColor: `${testimonial.color}30`,
                      boxShadow:
                        testimonial.position === 0
                          ? `0 10px 30px -5px ${testimonial.color}20`
                          : "none",
                    }}
                  >
                    <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 rounded-full bg-background p-1 sm:p-2 shadow-md z-20">
                      <div
                        className="flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full"
                        style={{ backgroundColor: testimonial.color }}
                      >
                        <Quote className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-background" />
                      </div>
                    </div>

                    <div className="mb-2 sm:mb-4 flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * i, duration: 0.5 }}
                        >
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex-grow">
                      <p className="text-xs sm:text-sm md:text-base italic text-foreground">
                        &quot;{testimonial.content}&quot;
                      </p>
                    </div>

                    <div className="mt-3 sm:mt-4 md:mt-6 flex items-center space-x-3 sm:space-x-4">
                      <div
                        className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 overflow-hidden rounded-full border-2"
                        style={{ borderColor: testimonial.color }}
                      >
                        {testimonial.avatar ? (
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary/10" />
                        )}
                      </div>
                      <div>
                        <p
                          className="text-xs sm:text-sm md:text-base font-medium"
                          style={{ color: testimonial.color }}
                        >
                          {testimonial.author}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div
                      className="absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 rounded-b-xl sm:rounded-b-2xl"
                      style={{ backgroundColor: testimonial.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center gap-2 sm:gap-4">
            <motion.button
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background shadow-md text-primary hover:bg-primary/10"
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            <div className="flex items-center gap-1 sm:gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`h-2 sm:h-2.5 rounded-full ${
                    index === activeIndex
                      ? "w-4 sm:w-6 bg-primary"
                      : "w-2 sm:w-2.5 bg-primary/30"
                  }`}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            <motion.button
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background shadow-md text-primary hover:bg-primary/10"
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
