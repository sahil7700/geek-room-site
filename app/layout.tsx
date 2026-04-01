import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { getSettings } from "@/app/actions/settings";
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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${syne.variable} ${inter.variable} flex min-h-screen flex-col antialiased`}
          style={{ backgroundColor: "#050505", color: "#ededed" }}
        >
          <Header hideJoin={settings.hideJoin} />
          <div className="flex-1">{children}</div>
          <Footer hideJoin={settings.hideJoin} />
        </body>
      </html>
    </ClerkProvider>
  );
}
