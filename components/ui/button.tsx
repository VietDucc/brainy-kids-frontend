import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-1 active:shadow-none transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-[#58CC02] text-white shadow-[0_5px_0_0_#58A700] border-[#58A700] border-b-4 hover:bg-[#61E002] hover:border-[#61D800]",
        destructive:
          "bg-[#FF4B4B] text-white shadow-[0_5px_0_0_#EA2B2B] border-[#EA2B2B] border-b-4 hover:bg-[#FF5E5E] hover:border-[#FF3A3A]",
        outline:
          "border-2 border-[#E5E5E5] bg-white shadow-[0_2px_0_0_#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]",
        secondary:
          "bg-[#FFC800] text-[#4B4B4B] shadow-[0_5px_0_0_#E5A600] border-[#E5A600] border-b-4 hover:bg-[#FFD500] hover:border-[#FFBE00]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        sidebar:
          "bg-transparent text-slate-500 border-2 border-transparent hover:bg-slate-100 transition-none",
        sidebarOutline:
          "bg-sky-500/15 text-sky-500 border-sky-300 border-2 hover:bg-sky-500/20 transition-none",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-xl px-4 py-2 text-xs",
        lg: "h-14 rounded-xl px-8 py-4 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
