import {
  CheckCircle2,
  Sparkles,
  Rocket,
  Lock,
  Crown,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "./ui/card";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "./ui/badge";
import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/20 animate-pulse" />
      <div
        className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      />
      <div
        className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce"
        style={{ animationDelay: "1s", animationDuration: "3s" }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-32 h-32 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce"
        style={{ animationDelay: "2s", animationDuration: "3s" }}
      />
    </div>
  );
};

const GlowEffect = () => {
  return (
    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-indigo-500/30 blur-lg animate-pulse" />
  );
};

export const ButtonPayment = ({ activeUser }) => {
  const { toast } = useToast();
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/vnpay", {
        method: "POST",
        body: JSON.stringify({ amount: 100000, orderInfo: userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit order");
      }
      const data = await response.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }

      toast({
        variant: "success",
        title: "Order submitted successfully",
        description: "Redirecting to payment page...",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "error",
        title: "Error submitting order",
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Lock className="h-6 w-6 text-violet-600 dark:text-violet-400" />,
      title: t("premium.benefit1_title"),
      description: t("premium.benefit1_desc"),
      gradient: "from-violet-500/10 to-purple-500/10",
    },
    {
      icon: (
        <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      ),
      title: t("premium.benefit2_title"),
      description: t("premium.benefit2_desc"),
      gradient: "from-purple-500/10 to-indigo-500/10",
    },
    {
      icon: <Rocket className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: t("premium.benefit3_title"),
      description: t("premium.benefit3_desc"),
      gradient: "from-indigo-500/10 to-violet-500/10",
    },
  ];

  const features = [
    t("premium.features.unlimited_access"),
    t("premium.features.ai_tools"),
    t("premium.features.progress_tracking"),
    t("premium.features.interactive_exercises"),
    t("premium.features.ai_pronunciation"),
    t("premium.features.regular_updates"),
    t("premium.features.priority_support"),
    t("premium.features.no_time_limit"),
  ];
  if (activeUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="group relative cursor-pointer max-w-[280px] overflow-hidden">
          <GlowEffect />
          <Card className="relative border-0 bg-gradient-to-br from-white via-violet-50/50 to-purple-50/50 dark:from-gray-900 dark:via-violet-950/30 dark:to-purple-950/30 p-4 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
            <div className="absolute top-2 right-2">
              <Crown className="h-4 w-4 text-violet-600 dark:text-violet-400 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="h-2 w-2 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent dark:from-violet-300 dark:to-purple-300 truncate">
                  {t("actions.upgrade_premium")}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                  {t("actions.upgrade_desc")}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 px-2 py-0.5"
                  >
                    Lifetime
                  </Badge>
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                    100K VND
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] p-0 gap-0 border-0 bg-gradient-to-br from-white to-violet-50/30 dark:from-gray-900 dark:to-violet-950/20">
        <div className="relative overflow-hidden">
          <AnimatedBackground />

          {/* Header Section */}
          <div className="relative z-10 p-5 text-center">
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg text-xs">
                <Crown className="h-3 w-3 mr-1" />
                LIFETIME
              </Badge>
            </div>

            <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl mb-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>

            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent dark:from-violet-300 dark:via-purple-300 dark:to-indigo-300 mb-2">
              {t("premium.lifetime_title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
              {t("premium.lifetime_desc")}
            </DialogDescription>
          </div>

          {/* Benefits Section */}
          <div className="relative z-10 px-5 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`p-3 text-center rounded-lg bg-gradient-to-br ${benefit.gradient}`}
                >
                  <div className="mx-auto w-8 h-8 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center mb-2">
                    {React.cloneElement(benefit.icon, { className: "h-4 w-4" })}
                  </div>
                  <h3 className="font-medium text-xs text-gray-800 dark:text-gray-200 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-violet-200/50 dark:border-violet-800/30">
            <div className="p-5">
              <div className="text-center mb-5">
                <div className="relative inline-block">
                  <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    100.000 VND
                  </div>
                  <div className="absolute -top-1 -right-6 text-xs font-medium text-red-500 dark:text-violet-400 rotate-12">
                    Save 80%
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("premium.one_time_payment")}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-5">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3 w-3 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
                <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  +{features.length - 4} more features
                </div>
              </div>

              <Button
                className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  handleUpgrade();
                  setIsOpen(false);
                }}
              >
                <Crown className="h-4 w-4 mr-2" />
                {t("premium.upgrade_now")}
              </Button>

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  {t("premium.money_back_guarantee")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
