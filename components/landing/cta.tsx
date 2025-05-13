"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden w-full">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"></div>

        <motion.div
          className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 h-40 sm:h-64 w-40 sm:w-64 rounded-full bg-primary/10"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -bottom-20 sm:-bottom-32 -left-20 sm:-left-32 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-primary/5"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary hidden sm:block"
            style={{
              width: 6 + (i % 3) * 4,
              height: 6 + (i % 3) * 4,
              left: `${20 + i * 15}%`,
              top: `${30 + ((i * 12) % 40)}%`,
              opacity: 0.1 + (i % 5) * 0.05,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute text-yellow-400 hidden sm:block"
            style={{
              left: `${25 + i * 25}%`,
              top: `${20 + ((i * 20) % 60)}%`,
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z" />
            </svg>
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative">
        <motion.div
          className="mx-auto max-w-3xl rounded-2xl sm:rounded-3xl bg-card p-5 sm:p-8 md:p-12 shadow-xl relative overflow-hidden border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 left-0 h-16 sm:h-20 w-16 sm:w-20 overflow-hidden hidden sm:block">
            <div className="absolute top-0 left-0 h-3 sm:h-4 w-3 sm:w-4 rounded-full bg-primary/20 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-0 left-0 h-12 sm:h-16 w-12 sm:w-16 border-t-3 sm:border-t-4 border-l-3 sm:border-l-4 border-primary/20 rounded-tl-3xl"></div>
          </div>

          <div className="absolute bottom-0 right-0 h-16 sm:h-20 w-16 sm:w-20 overflow-hidden hidden sm:block">
            <div className="absolute bottom-0 right-0 h-3 sm:h-4 w-3 sm:w-4 rounded-full bg-primary/20 transform translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 h-12 sm:h-16 w-12 sm:w-16 border-b-3 sm:border-b-4 border-r-3 sm:border-r-4 border-primary/20 rounded-br-3xl"></div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center relative z-10">
            <motion.div
              className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Sẵn sàng để con bạn bắt đầu học tập?
              </h2>
              <p className="max-w-[600px] text-sm text-muted-foreground md:text-lg/relaxed">
                Đăng ký ngay hôm nay và nhận 7 ngày dùng thử miễn phí gói{" "}
                <span className="text-primary font-semibold">Gia đình</span>
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3 min-[400px]:flex-row w-full sm:w-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="default"
                  className="w-full text-primary-foreground rounded-xl px-3 sm:px-4 md:px-6 h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-medium"
                >
                  <span className="flex items-center gap-1 sm:gap-2">
                    Bắt đầu dùng thử miễn phí
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="default"
                  variant="outline"
                  className="w-full rounded-xl px-3 sm:px-4 md:px-6 h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg font-medium"
                >
                  <span className="flex items-center gap-1 sm:gap-2">
                    Tìm hiểu thêm
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </span>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Không cần thẻ tín dụng</span>
              </div>

              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Hủy bất kỳ lúc nào</span>
              </div>

              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Hỗ trợ 24/7</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
