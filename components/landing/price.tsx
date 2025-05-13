"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Star, Sparkles, Crown, Rocket, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const coinPositions = [
    { x: "15%", y: "20%", size: 30, delay: 0 },
    { x: "85%", y: "15%", size: 40, delay: 1 },
    { x: "25%", y: "85%", size: 25, delay: 2 },
    { x: "70%", y: "75%", size: 35, delay: 3 },
    { x: "50%", y: "30%", size: 20, delay: 4 },
    { x: "35%", y: "50%", size: 45, delay: 5 },
    { x: "80%", y: "60%", size: 30, delay: 2.5 },
    { x: "40%", y: "10%", size: 35, delay: 1.5 },
  ];

  const plans = [
    {
      name: "Cơ bản",
      description: "Dành cho người mới bắt đầu",
      monthlyPrice: 99000,
      yearlyPrice: 990000,
      features: [
        "Truy cập 100+ bài học",
        "Trò chơi học tập cơ bản",
        "Báo cáo tiến độ hàng tuần",
        "Hỗ trợ qua email",
      ],
      color: "#4ECDC4",
      icon: Rocket,
      popular: false,
    },
    {
      name: "Tiêu chuẩn",
      description: "Dành cho học sinh tiểu học",
      monthlyPrice: 199000,
      yearlyPrice: 1990000,
      features: [
        "Truy cập 300+ bài học",
        "Tất cả trò chơi học tập",
        "Báo cáo tiến độ hàng ngày",
        "Hỗ trợ qua email và chat",
        "Bài tập cá nhân hóa",
      ],
      color: "#FFD166",
      icon: Crown,
      popular: true,
    },
    {
      name: "Cao cấp",
      description: "Dành cho học sinh nghiêm túc",
      monthlyPrice: 299000,
      yearlyPrice: 2990000,
      features: [
        "Truy cập toàn bộ bài học",
        "Báo cáo tiến độ thời gian thực",
        "Hỗ trợ ưu tiên 24/7",
        "Bài tập cá nhân hóa",
        "Kèm 1-1 với giáo viên",
      ],
      color: "#FF6B6B",
      icon: Shield,
      popular: false,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section
      id="pricing"
      className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5"></div>

        {isClient && (
          <>
            <motion.div
              className="absolute top-20 left-10 text-primary/10"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 200,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
            >
              <svg width="120" height="120" viewBox="0 0 120 120">
                <path
                  d="M60,10 L70,40 L100,40 L75,60 L85,90 L60,75 L35,90 L45,60 L20,40 L50,40 Z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>

            <motion.div
              className="absolute bottom-20 right-10 text-primary/10"
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{
                duration: 200,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
            >
              <svg width="150" height="150" viewBox="0 0 150 150">
                <path
                  d="M75,20 L90,60 L135,60 L100,85 L115,125 L75,105 L35,125 L50,85 L15,60 L60,60 Z"
                  fill="currentColor"
                />
              </svg>
            </motion.div>

            {coinPositions.map((coin, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-yellow-400 opacity-20"
                style={{
                  width: coin.size,
                  height: coin.size,
                  left: coin.x,
                  top: coin.y,
                }}
                initial={{ y: 0, rotate: 0 }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10 + (i % 5) * 2,
                  repeat: Infinity,
                  delay: coin.delay,
                  repeatType: "loop",
                }}
              />
            ))}

            <motion.div
              className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5"
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-yellow-200/20"
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="space-y-4">
            <motion.div
              className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-current" />
                Gói học tập
              </span>
            </motion.div>
            <motion.h2
              className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Chọn gói phù hợp với <span className="text-primary">con bạn</span>
            </motion.h2>
            <motion.p
              className="max-w-[900px] text-xs sm:text-sm md:text-base text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Chúng tôi cung cấp nhiều gói học tập khác nhau để phù hợp với nhu
              cầu và ngân sách của bạn.
            </motion.p>
          </div>

          <motion.div
            className="mt-6 inline-flex items-center rounded-full border-2 border-border p-1 bg-card/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <button
              className={`relative rounded-full px-4 py-2 text-sm font-medium ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Hàng tháng
            </button>
            <button
              className={`relative ml-0.5 rounded-full px-4 py-2 text-sm font-medium ${
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Hàng năm
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] py-1 px-4 font-bold text-white">
                -17%
              </span>
            </button>
          </motion.div>
        </motion.div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;

            const smallScreenClass = isPopular
              ? "sm:col-span-2 sm:mx-auto sm:max-w-md"
              : "";

            const largeScreenClass = isPopular
              ? "lg:col-span-1 lg:-mt-6 lg:mb-6 lg:pt-8 lg:pb-8"
              : "lg:col-span-1";

            return (
              <motion.div
                key={index}
                className={`relative flex flex-col rounded-2xl border-2 bg-card shadow-lg ${
                  isPopular
                    ? `border-primary ${smallScreenClass} ${largeScreenClass}`
                    : `border-border ${largeScreenClass}`
                }`}
                style={{
                  height: "100%",
                  padding: "1.25rem",
                  width: "100%",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 * index,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                onMouseEnter={() => setHoveredPlan(index)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Phổ biến nhất
                  </div>
                )}

                <div
                  className="mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${plan.color}20` }}
                >
                  <plan.icon
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    style={{ color: plan.color }}
                  />
                </div>

                <h3
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: plan.color }}
                >
                  {plan.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <div className="my-4 min-h-[60px]">
                  <div className="flex items-baseline">
                    <motion.span
                      className="text-2xl sm:text-3xl font-extrabold"
                      style={{ color: plan.color }}
                      key={`${plan.name}-${billingCycle}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {
                        formatPrice(
                          billingCycle === "monthly"
                            ? plan.monthlyPrice
                            : plan.yearlyPrice
                        ).split("₫")[0]
                      }
                    </motion.span>
                    <span className="text-base sm:text-lg font-bold text-muted-foreground">
                      ₫
                    </span>
                    <span className="ml-1 text-xs sm:text-sm text-muted-foreground">
                      /{billingCycle === "monthly" ? "tháng" : "năm"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <motion.p
                      className="mt-1 text-xs text-green-500 font-medium"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      Tiết kiệm{" "}
                      {formatPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)}
                    </motion.p>
                  )}
                </div>

                <div
                  className="mb-4 flex-grow overflow-y-auto overflow-x-hidden"
                  style={{ maxHeight: "180px" }}
                >
                  <ul className="space-y-2 text-left">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0.7, x: 0 }}
                        animate={
                          hoveredPlan === index
                            ? {
                                opacity: 1,
                                x: 0,
                                transition: {
                                  delay: 0.05 * i,
                                  duration: 0.2,
                                },
                              }
                            : { opacity: 0.9 }
                        }
                      >
                        <div
                          className="mr-2 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0"
                          style={{ backgroundColor: `${plan.color}20` }}
                        >
                          <Check
                            className="h-2.5 w-2.5"
                            style={{ color: plan.color }}
                          />
                        </div>
                        <span className="text-foreground text-xs sm:text-sm">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-2">
                  <Button
                    className="relative w-full overflow-hidden group rounded-xl"
                    style={{
                      backgroundColor: plan.color,
                      color: "white",
                      borderColor: plan.color,
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <span className="relative z-10 dark:text-black/70 text-xs sm:text-sm font-medium">
                      {plan.popular ? "Bắt đầu ngay" : "Đăng ký"}
                    </span>
                    {plan.popular && (
                      <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                        style={{ opacity: 0.3 }}
                      />
                    )}
                  </Button>
                </div>

                {plan.popular && (
                  <motion.div
                    className="absolute -right-2 -top-2"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  >
                    <Sparkles
                      className="h-5 w-5"
                      style={{ color: plan.color }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <style jsx global>{`
          @media (min-width: 640px) and (max-width: 1023px) {
            .grid > div:nth-child(2):not(:last-child) {
              order: -1;
            }
          }
        `}</style>

        <p className="text-center text-xs text-muted-foreground mt-4 lg:hidden">
          Vuốt để xem tất cả các gói
        </p>
      </div>
    </section>
  );
};

export default Pricing;
