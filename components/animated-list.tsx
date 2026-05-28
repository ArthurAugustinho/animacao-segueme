"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import React from "react";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/** Container ul com stagger — envolve cada filho em motion.li */
export function AnimatedList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <ul className={className}>{children}</ul>;
  }

  return (
    <motion.ul
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child, i) => (
        <motion.li key={i} variants={itemVariants} className="h-full">
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** Hover-lift wrapper para cards (spring y -4px) */
export function AnimatedCard({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className="h-full">{children}</div>;
  }

  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/** Fade + slide-up para blocos de hero */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
