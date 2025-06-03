"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const { t } = useTranslation("price");
  const { isSignedIn, userId } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkActiveStatus = async () => {
      if (!isSignedIn) return;

      try {
        const response = await fetch("/api/active-user");
        const data = await response.json();
        setIsActive(data.active);
      } catch (error) {
        console.error("Failed to check active status:", error);
      }
    };

    checkActiveStatus();
  }, [isSignedIn]);

  const handleUpgrade = async () => {
    if (!isSignedIn) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/vnpay", {
        method: "POST",
        body: JSON.stringify({ amount: 100000, orderInfo: userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }

      toast({
        title: t("lifetime.toast.success"),
        description: t("lifetime.toast.redirect"),
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t("lifetime.toast.error"),
        description: t("lifetime.toast.try_again"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="pricing"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-background to-purple-500/5"></div>
        {isClient && (
          <>
            <motion.div
              className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-500/5"
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/5"
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

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="inline-block rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 dark:text-violet-400"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="flex items-center gap-1.5">
              <Crown className="h-4 w-4" />
              {t("lifetime.badge")}
            </span>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t("lifetime.title")}
          </motion.h2>
          <motion.p
            className="max-w-[600px] text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {t("lifetime.description")}
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative rounded-2xl border-2 border-violet-500 bg-card p-6 shadow-lg">
            <div className="absolute -top-3 right-4">
              <div className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                {t("lifetime.access")}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {t("lifetime.plan_name")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("lifetime.plan_description")}
                </p>
              </div>
            </div>

            <div className="mb-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                100.000 VND
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("lifetime.one_time_payment")}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {(
                t("lifetime.features", { returnObjects: true }) as string[]
              ).map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <div className="h-5 w-5 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-violet-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            {isActive ? (
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  {t("lifetime.already_upgraded")}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("lifetime.enjoy_premium")}
                </p>
              </div>
            ) : isSignedIn ? (
              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
                onClick={handleUpgrade}
                disabled={isLoading}
              >
                <Crown className="h-4 w-4 mr-2" />
                {isLoading
                  ? t("lifetime.processing")
                  : t("lifetime.upgrade_button")}
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {t("lifetime.signin_to_upgrade")}
                </Button>
              </SignInButton>
            )}

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t("lifetime.money_back_guarantee")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
