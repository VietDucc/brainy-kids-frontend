"use client";
import {
  BookOpen,
  Star,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Home,
  Lightbulb,
  Puzzle,
  Award,
  CreditCard,
  LogIn,
  Rocket,
  Zap,
  ArrowRight,
  Crown,
  Loader,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { ModeToggle } from "../mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ClerkLoading,
  ClerkLoaded,
  useAuth,
  SignUpButton,
} from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Add a function to scroll to top
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const scrollToSection = (
  id: string,
  closeMenu = false,
  setIsOpen?: (isOpen: boolean) => void
) => {
  const targetId = id.startsWith("#") ? id.substring(1) : id;

  const element = document.getElementById(targetId);

  if (element) {
    if (closeMenu && setIsOpen) {
      setIsOpen(false);
    }
    setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }
};

const Header = () => {
  const [hoverItem, setHoverItem] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const { isSignedIn } = useAuth();

  // Handle scroll direction for hiding/showing header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we've scrolled enough to change header appearance
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: "features", label: "Tính năng", icon: Lightbulb },
    { id: "how-it-works", label: "Cách thức hoạt động", icon: Puzzle },
    { id: "testimonials", label: "Đánh giá", icon: Award },
    { id: "pricing", label: "Gói dịch vụ", icon: CreditCard },
  ];

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-background/80 shadow-md backdrop-blur-md"
          : "bg-transparent",
        hidden && "transform -translate-y-full"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-14 sm:h-18 items-center justify-between py-2 sm:py-4 px-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 group relative"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            <div className="relative z-10">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
                className="relative"
              >
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                </motion.div>
              </motion.div>
            </div>

            <div className="relative">
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                Kids<span className="text-primary font-light">Learn</span>
              </span>

              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/80 to-primary/30 rounded-full origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="absolute -z-10 inset-0 rounded-full bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                className="relative px-3 py-2 text-md font-medium text-foreground/80 hover:text-primary transition-colors rounded-md group"
                onMouseEnter={() => setHoverItem(item.id)}
                onMouseLeave={() => setHoverItem(null)}
              >
                <div className="flex items-center gap-1.5">
                  <item.icon className="h-3.5 w-3.5 opacity-70 group-hover:text-primary group-hover:opacity-100" />
                  <span>{item.label}</span>
                </div>

                {hoverItem === item.id && (
                  <motion.div
                    layoutId="navBubble"
                    className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
            <div className="flex gap-x-3">
              <ClerkLoading>
                <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
              </ClerkLoading>
              <ClerkLoaded>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      className="hidden lg:flex group text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 rounded-lg gap-1.5 shadow-md shadow-primary/20"
                      variant="outline"
                    >
                      <span className="mr-1">Đăng nhập</span>
                    </Button>
                  </SignInButton>
                </SignedOut>
              </ClerkLoaded>
            </div>

            {!isSignedIn && (
              <SignUpButton mode="modal">
                <Button
                  className="hidden lg:flex group text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 rounded-lg gap-1.5 shadow-md shadow-primary/20"
                  variant="default"
                >
                  <span className="mr-1">Dùng thử</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Star className="h-3.5 w-3.5 text-yellow-300 group-hover:text-yellow-100" />
                  </motion.div>

                  <motion.div
                    className="absolute right-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </motion.div>
                </Button>
              </SignUpButton>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8 rounded-full hover:bg-primary/10"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-80 p-0 overflow-y-auto"
              >
                <div className="bg-primary/10 backdrop-blur-md p-3 flex items-center justify-between sticky top-0 z-10 ">
                  <div className="flex items-center">
                    <div className="bg-primary/20 rounded-full p-1.5 ">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold ml-2">
                      Kids
                      <span className="text-primary font-light">Learn</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-primary/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <div className="p-4 pb-20">
                  <nav className="flex flex-col gap-1">
                    <Link
                      href="#hero"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("hero", true, setIsOpen);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors group"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1.5 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors">
                        <Home className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm font-medium">Trang chủ</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />
                    </Link>

                    {navItems.map((item, index) => {
                      const colors = [
                        {
                          bg: "bg-green-100 dark:bg-green-900/30",
                          hover:
                            "group-hover:bg-green-200 dark:group-hover:bg-green-800/30",
                          text: "text-green-600 dark:text-green-400",
                        },
                        {
                          bg: "bg-purple-100 dark:bg-purple-900/30",
                          hover:
                            "group-hover:bg-purple-200 dark:group-hover:bg-purple-800/30",
                          text: "text-purple-600 dark:text-purple-400",
                        },
                        {
                          bg: "bg-amber-100 dark:bg-amber-900/30",
                          hover:
                            "group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30",
                          text: "text-amber-600 dark:text-amber-400",
                        },
                        {
                          bg: "bg-pink-100 dark:bg-pink-900/30",
                          hover:
                            "group-hover:bg-pink-200 dark:group-hover:bg-pink-800/30",
                          text: "text-pink-600 dark:text-pink-400",
                        },
                      ];

                      const color = colors[index % colors.length];

                      return (
                        <Link
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(item.id, true, setIsOpen);
                          }}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors group"
                        >
                          <div
                            className={`${color.bg} rounded-full p-1.5 ${color.hover} transition-colors`}
                          >
                            <item.icon
                              className={`h-3.5 w-3.5 ${color.text}`}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />
                        </Link>
                      );
                    })}

                    <Link
                      href="/login"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-colors group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-1.5 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors">
                        <LogIn className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-sm font-medium">Đăng nhập</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />
                    </Link>
                  </nav>

                  <div className="mt-6 mb-4 bg-gradient-to-r from-amber-100/80 to-amber-50/80 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-3 border border-amber-200/50 dark:border-amber-700/30">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-200 dark:bg-amber-700/50 rounded-full p-1.5 mt-0.5">
                        <Crown className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200">
                          Nâng cấp lên Premium
                        </h4>
                        <p className="text-xs text-amber-700/80 dark:text-amber-300/70 mt-0.5">
                          Mở khóa tất cả tính năng và nội dung học tập không
                          giới hạn
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="my-4 border-t border-border relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-background px-3">
                      <Star className="h-4 w-4 text-yellow-400" />
                    </div>
                  </div>

                  <Button className="w-full rounded-lg py-4 h-auto group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border-none shadow-md shadow-primary/20">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold mb-0.5 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-yellow-200" />
                        Dùng thử miễn phí
                      </span>
                      <span className="text-[10px] opacity-90">
                        7 ngày dùng thử không giới hạn
                      </span>
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                    </motion.div>
                  </Button>

                  {/* Footer - reduced spacing */}
                  <div className="mt-6 text-center text-[10px] text-muted-foreground">
                    <p>© 2023 KidsLearn. Mọi quyền được bảo lưu.</p>
                    <div className="flex justify-center gap-2 mt-1.5">
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        Điều khoản
                      </Link>
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        Bảo mật
                      </Link>
                      <Link
                        href="#"
                        className="hover:text-primary transition-colors"
                      >
                        Trợ giúp
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <motion.div
        className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.div
        className="absolute bottom-0 h-6 pointer-events-none z-10"
        style={{
          left: `calc(${scrollYProgress.get() * 100}% - 12px)`,
          opacity: scrollYProgress.get() > 0 ? 1 : 0,
        }}
      >
        <Rocket size={14} className="text-primary transform -rotate-90" />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-6 origin-top"
          style={{
            background:
              "linear-gradient(to top, rgba(var(--primary), 0.8), rgba(var(--primary), 0))",
          }}
          animate={{
            height: [6, 12, 6],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.header>
  );
};

export default Header;
