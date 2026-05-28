"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();

  if (shouldReduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
