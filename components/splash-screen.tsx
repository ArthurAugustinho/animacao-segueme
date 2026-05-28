"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { LogoSegueMe } from "@/components/logo-segueme";

const SPLASH_KEY = "splash-shown";
const SPLASH_DURATION_MS = 1800;

export function SplashScreen({ logoDataUri }: { logoDataUri: string | null }) {
  const [show, setShow] = useState(false);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) return;
    sessionStorage.setItem(SPLASH_KEY, "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (shouldReduce) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-3 bg-segueme-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setShow(false)}
          aria-hidden="true"
        >
          {/* 1. Logo: scale spring 0 → 1 */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            {logoDataUri ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoDataUri}
                className="h-24 w-24 object-contain"
                alt=""
              />
            ) : (
              <LogoSegueMe className="h-24 w-24" />
            )}
          </motion.div>

          {/* 2. Título: slide-up (delay 400ms) */}
          <motion.p
            className="mt-2 font-display text-2xl font-semibold text-segueme-ink"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
          >
            Animação Segue-Me
          </motion.p>

          {/* 3. Subtítulo: fade (delay 700ms) */}
          <motion.p
            className="text-sm text-segueme-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.2 }}
          >
            Equipe da Animação
          </motion.p>

          {/* Dica de skip */}
          <motion.p
            className="absolute bottom-8 text-xs text-segueme-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            Toque para pular
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
