import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/splash-screen";
import { buscarConfiguracao } from "@/lib/db/queries";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Animação Segue-Me",
  description: "Roteiros dos teatros do encontro Segue-Me",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4C430",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let logoDataUri: string | null = null;
  try {
    const config = await buscarConfiguracao();
    logoDataUri = config.logoDataUri;
  } catch {
    // tabela ainda não criada — splash usa logo padrão
  }

  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <SplashScreen logoDataUri={logoDataUri} />
        {children}
      </body>
    </html>
  );
}
