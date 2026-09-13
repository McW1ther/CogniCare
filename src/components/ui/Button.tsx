import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

type Props = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[15px]",
  sm: "px-4 py-1.5 text-sm",
};

export function Button({ variant = "secondary", size = "md", icon, className = "", children, style, ...rest }: Props) {
  const reduceMotion = useReducedMotion();

  const variantClass: Record<Variant, string> = {
    primary: "text-paper",
    secondary: "glass text-ink hover:accent-wash",
    ghost: "text-ink-soft hover:text-ink hover:bg-white/50",
    danger: "glass text-ink-soft hover:text-ink hover:border-clay/50",
  };

  const variantStyle =
    variant === "primary"
      ? {
          backgroundImage:
            "linear-gradient(160deg, color-mix(in srgb, var(--accent) 100%, white 10%), var(--accent) 55%, color-mix(in srgb, var(--accent) 100%, black 8%))",
          color: "var(--color-paper)",
          ...style,
        }
      : style;

  return (
    <motion.button
      whileHover={reduceMotion ? undefined : { scale: 1.035 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className={`${base} ${sizes[size]} ${variantClass[variant]} ${className}`}
      style={variantStyle}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  );
}
