import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-segueme-line bg-segueme-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <LogoSegueMe className="h-10 w-10" />
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold text-segueme-ink">
              Segue-Me
            </p>
            <p className="text-xs text-segueme-muted">Equipe da Animação</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

function LogoSegueMe({ className }: { className?: string }) {
  // SVG estilizado inspirado no logo original (pastor + cordeiro + cálice)
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Segue-Me"
    >
      <circle cx="32" cy="32" r="30" fill="#F4C430" />
      <circle cx="32" cy="32" r="26" fill="#FFFBF0" />
      {/* cajado */}
      <path
        d="M22 18c-2 0-3 1.5-3 3v4"
        stroke="#8B6F47"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <line
        x1="19"
        y1="25"
        x2="19"
        y2="42"
        stroke="#8B6F47"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* cálice */}
      <ellipse cx="40" cy="28" rx="7" ry="2.5" fill="#E0A800" />
      <path d="M33 28v6c0 3 3 5 7 5s7-2 7-5v-6" fill="#E0A800" />
      <line
        x1="40"
        y1="39"
        x2="40"
        y2="44"
        stroke="#E0A800"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="40" cy="44" rx="5" ry="1.5" fill="#E0A800" />
      {/* hóstia */}
      <circle cx="40" cy="24" r="3" fill="#FFFBF0" stroke="#8B6F47" strokeWidth="1" />
      <line x1="40" y1="22" x2="40" y2="26" stroke="#8B6F47" strokeWidth="1" />
      <line x1="38" y1="24" x2="42" y2="24" stroke="#8B6F47" strokeWidth="1" />
      {/* cordeiro */}
      <ellipse cx="28" cy="44" rx="6" ry="4" fill="#FFFBF0" stroke="#1A1A1A" strokeWidth="1" />
      <circle cx="34" cy="43" r="2" fill="#1A1A1A" />
    </svg>
  );
}
