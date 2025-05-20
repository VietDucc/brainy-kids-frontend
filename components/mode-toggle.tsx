"use client";

import * as React from "react";
import { Moon, Sun, Cloud, Stars } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="h-6 w-6 sm:h-8 sm:w-8 relative z-100"
      >
        <Button
          variant="outline"
          size="icon"
          className="dark:bg-background/40 dark:border-gray-600 rounded-full overflow-hidden relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100"
            initial={{ opacity: isDark ? 0 : 1 }}
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-purple-900"
            initial={{ opacity: isDark ? 1 : 0 }}
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />

          <AnimatePresence>
            {!isDark && (
              <>
                <motion.div
                  className="absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute top-1 left-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-yellow-300"
                    animate={{
                      scale: isHovered ? [1, 1.2, 1] : 1,
                      rotate: isHovered ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isHovered ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-1 w-1 sm:h-1.5 sm:w-1.5 bg-yellow-300 rounded-full"
                        style={{
                          left: "50%",
                          top: "50%",
                          transformOrigin: "0 0",
                          transform: `rotate(${i * 45}deg) translate(3px, 0)`,
                        }}
                        animate={{
                          scale: isHovered ? [1, 1.5, 1] : 1,
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.1,
                          repeat: isHovered ? Infinity : 0,
                          repeatType: "reverse",
                        }}
                      />
                    ))}
                  </motion.div>

                  <motion.div
                    className="absolute bottom-1 right-1 text-white"
                    animate={{
                      x: isHovered ? [0, 3, 0] : 0,
                      y: isHovered ? [0, -1, 0] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isHovered ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <Cloud className="h-3 w-3 sm:h-4 sm:w-4" />
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDark && (
              <>
                <motion.div
                  className="absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute top-1 right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-yellow-100"
                    animate={{
                      scale: isHovered ? [1, 1.1, 1] : 1,
                      rotate: isHovered ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 3,
                      repeat: isHovered ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <motion.div
                      className="absolute top-1 left-1 h-1 w-1 rounded-full bg-yellow-200/50"
                      animate={{
                        opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
                      }}
                      transition={{
                        duration: 2,
                        repeat: isHovered ? Infinity : 0,
                        repeatType: "reverse",
                      }}
                    />
                    <motion.div
                      className="absolute bottom-1 right-1 h-0.5 w-0.5 rounded-full bg-yellow-200/50"
                      animate={{
                        opacity: isHovered ? [0.5, 0.8, 0.5] : 0.5,
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.5,
                        repeat: isHovered ? Infinity : 0,
                        repeatType: "reverse",
                      }}
                    />
                  </motion.div>

                  {/* Stars */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-0.5 w-0.5 sm:h-1 sm:w-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${20 + (i % 3) * 20}%`,
                      }}
                      animate={{
                        scale: isHovered ? [1, 1.5, 1] : 1,
                        opacity: isHovered ? [0.7, 1, 0.7] : 0.7,
                      }}
                      transition={{
                        duration: 1 + i * 0.5,
                        repeat: isHovered ? Infinity : 0,
                        repeatType: "reverse",
                      }}
                    />
                  ))}

                  {isHovered && (
                    <motion.div
                      className="absolute h-0.5 w-2 sm:h-1 sm:w-3 bg-white rounded-full"
                      initial={{
                        x: -10,
                        y: 0,
                        opacity: 0,
                        rotate: -45,
                      }}
                      animate={{
                        x: 20,
                        y: 20,
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
            <Sun className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium">Ngày</span>
          {theme === "light" && (
            <motion.div
              className="ml-auto h-2 w-2 rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
            <Moon className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium">Đêm</span>
          {theme === "dark" && (
            <motion.div
              className="ml-auto h-2 w-2 rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <Stars className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium">Tự động</span>
          {theme === "system" && (
            <motion.div
              className="ml-auto h-2 w-2 rounded-full bg-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
