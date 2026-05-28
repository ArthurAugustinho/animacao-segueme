"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export function RoteiroReveal({ html }: { html: string }) {
  const shouldReduce = useReducedMotion();
  const [blocks, setBlocks] = useState<string[] | null>(null);

  useEffect(() => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    setBlocks(Array.from(doc.body.children).map((el) => el.outerHTML));
  }, [html]);

  // SSR e reduced-motion: HTML completo (sem animação, sem hydration mismatch)
  if (!blocks || shouldReduce) {
    return (
      <div
        className="prose-roteiro"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="prose-roteiro">
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          dangerouslySetInnerHTML={{ __html: block }}
        />
      ))}
    </div>
  );
}
