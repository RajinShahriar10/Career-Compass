import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { DataProvider } from "@/components/DataProvider";
import { AppShell } from "@/components/AppShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skill সেতু — AI Career Copilot",
  description:
    "AI career copilot for Bangladeshi youth: skill assessment, personalised roadmap, higher-education & scholarship guidance, CV review and mock interviews. Bangla-first and free.",
  applicationName: "Skill Setu",
  keywords: [
    "career",
    "skill",
    "Bangladesh",
    "AI",
    "scholarship",
    "MyGP",
    "resume",
    "interview",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0e9f6e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${bengali.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <LanguageProvider>
          <DataProvider>
            <AppShell>{children}</AppShell>
          </DataProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
