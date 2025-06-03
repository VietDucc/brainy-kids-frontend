"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/nextjs";
import {
  CheckCircle2,
  Sparkles,
  Rocket,
  Lock,
  Crown,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const PremiumPage = () => {
  const { toast } = useToast();
  const { userId } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [activeUser, setActiveUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const fetchActiveUser = async () => {
      try {
        const response = await fetch("/api/active-user", {
          method: "GET",
        });
        const data = await response.json();
        setActiveUser(data.active);

        if (data.active) {
          router.push("/learn");
        }
      } catch (error) {
        console.error("Error fetching active user:", error);
        setActiveUser(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    if (userId) {
      fetchActiveUser();
    } else {
      setCheckingStatus(false);
    }
  }, [userId, router]);

  const handleUpgrade = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to upgrade your account",
      });
      return;
    }

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
        variant: "default",
        title: "Order submitted successfully",
        description: "Redirecting to payment page...",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error submitting order",
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Lock className="h-5 w-5" />,
      title: t("premium.benefit1_title"),
      description: t("premium.benefit1_desc"),
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: t("premium.benefit2_title"),
      description: t("premium.benefit2_desc"),
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: t("premium.benefit3_title"),
      description: t("premium.benefit3_desc"),
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

  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (activeUser) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            You&apos;re Already Premium!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enjoy all premium features and unlimited access.
          </p>
          <Button onClick={() => router.push("/learn")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center">
          <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white mb-3">
            <Crown className="h-4 w-4 mr-1" />
            LIFETIME PREMIUM
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {t("premium.lifetime_title")}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("premium.lifetime_desc")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 items-start px-6">
        {/* Left: Benefits */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Why Upgrade?
          </h2>

          <div className="grid gap-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              What You Get:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Pricing Card */}
        <div className="lg:sticky lg:top-6">
          <Card className="p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  100.000 VND
                </div>
                <div className="absolute -top-1 -right-6 text-xs font-medium text-red-500 rotate-12 bg-red-50 dark:bg-red-900/20 px-1 rounded">
                  Save 80%
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t("premium.one_time_payment")}
              </div>
            </div>

            <Button
              className="w-full h-11 mb-4"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Crown className="h-4 w-4 mr-2" />
              )}
              {loading ? "Processing..." : t("premium.upgrade_now")}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                {t("premium.money_back_guarantee")}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
