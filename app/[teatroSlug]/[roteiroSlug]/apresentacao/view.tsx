"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";

interface Props {
  titulo: string;
  html: string;
  returnUrl: string;
}

function parseScenes(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = Array.from(doc.body.children);

  const scenes: string[] = [];
  let current: Element[] = [];

  for (const el of elements) {
    const tag = el.tagName.toLowerCase();
    if ((tag === "h2" || tag === "h3") && current.length > 0) {
      scenes.push(current.map((e) => e.outerHTML).join(""));
      current = [];
    }
    current.push(el);
  }
  if (current.length > 0) {
    scenes.push(current.map((e) => e.outerHTML).join(""));
  }

  return scenes.length > 0 ? scenes : [html];
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function ApresentacaoView({ titulo, html, returnUrl }: Props) {
  const shouldReduce = useReducedMotion();
  const [[sceneIndex, direction], setScene] = useState([0, 0]);
  const [scenes, setScenes] = useState<string[]>([html]);

  useEffect(() => {
    setScenes(parseScenes(html));
  }, [html]);

  const paginate = useCallback(
    (dir: number) => {
      setScene(([current]) => {
        const next = current + dir;
        if (next < 0 || next >= scenes.length) return [current, 0];
        return [next, dir];
      });
    },
    [scenes.length]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [paginate]);

  const isFirst = sceneIndex === 0;
  const isLast = sceneIndex === scenes.length - 1;

  return (
    <div className="flex h-screen select-none flex-col overflow-hidden bg-segueme-ink text-segueme-cream">
      {/* Barra superior */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="font-sans text-xs font-medium uppercase tracking-widest text-segueme-yellow">
          Cena {sceneIndex + 1} de {scenes.length}
        </span>
        <Link
          href={returnUrl}
          className="rounded-lg px-3 py-1 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-segueme-cream"
        >
          Sair ✕
        </Link>
      </div>

      {/* Conteúdo da cena */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={sceneIndex}
            custom={direction}
            variants={shouldReduce ? undefined : slideVariants}
            initial={shouldReduce ? false : "enter"}
            animate="center"
            exit={shouldReduce ? undefined : "exit"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            drag={shouldReduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) paginate(1);
              else if (info.offset.x > 50) paginate(-1);
            }}
            className="absolute inset-0 overflow-y-auto px-6 py-10 sm:px-12"
          >
            <div
              className="prose-apresentacao mx-auto max-w-2xl"
              dangerouslySetInnerHTML={{ __html: scenes[sceneIndex] ?? "" }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegação inferior */}
      <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-5 py-4">
        <button
          onClick={() => paginate(-1)}
          disabled={isFirst}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-segueme-cream disabled:opacity-20"
          aria-label="Cena anterior"
        >
          ← Anterior
        </button>
        <span className="hidden font-display text-xs text-white/30 sm:block">
          {titulo}
        </span>
        <button
          onClick={() => paginate(1)}
          disabled={isLast}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-segueme-cream disabled:opacity-20"
          aria-label="Próxima cena"
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
