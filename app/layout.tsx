import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { getSettings } from "@/app/actions/settings";
import { UnifiedBackground } from "@/components/UnifiedBackground";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Geek Room — Student Tech Society at JIMS EMTC",
  description:
    "Geek Room is the builder-led student tech society at JIMS EMTC. We run hackathons, workshops, and events that turn curiosity into real-world skills.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: '#4F9EFF',
        colorBackground: '#111111',
        colorInputBackground: '#222222',
        colorInputText: '#EDEDED',
        colorText: '#EDEDED',
        colorTextSecondary: '#A1A1AA',
        colorBackgroundOnProfile: '#111111',
        alpha: 0.9,
      },
      elements: {
        card: "bg-[#141418]/95 backdrop-blur-xl border border-white/10 shadow-2xl",
        navbar: "hidden",
        userButtonPopoverCard: "bg-[#141418]/95 backdrop-blur-xl border border-white/10 shadow-2xl text-white",
        userButtonPopoverActionButtonText: "text-white font-medium",
        userButtonPopoverActionButtonIcon: "text-white",
        userButtonPopoverActionButton: "hover:bg-white/10 text-white",
        userPreviewMainIdentifier: "text-white font-semibold",
        userPreviewSecondaryIdentifier: "text-gray-400",
        userButtonPopoverFooter: "hidden"
      }
    }}>
      <html lang="en">
        <body
          className={`${syne.variable} ${inter.variable} flex min-h-screen flex-col antialiased`}
        >
          {/* Unified background — sits at z-index: -1, behind the whole page */}
          <UnifiedBackground />

          {/* Main layout — no explicit stacking context here */}
          <div
            className="flex flex-col min-h-screen w-full relative"
            style={{ borderTop: "1px solid rgba(0,200,255,0.15)" }}
          >
            <Header hideJoin={settings.hideJoin} />
            <div className="flex-1">{children}</div>
            <Footer hideJoin={settings.hideJoin} />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
