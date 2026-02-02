import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ThemeSync from "@/components/ui/ThemeSync";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtus - AI Chat Platform",
  description: "Converse com múltiplos modelos de IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased`}
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("theme");var r=document.documentElement;var m=window.matchMedia("(prefers-color-scheme: dark)");var d=(t==="dark")||(t!=="light"&&m.matches);if(d){r.classList.add("dark")}else{r.classList.remove("dark")}}catch(e){}})();`}
        </Script>
        <ThemeSync />
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
