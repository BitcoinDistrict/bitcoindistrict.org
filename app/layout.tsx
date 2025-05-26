import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { Viewport } from "next";
import Image from "next/image";
import "./globals.css";
import Footer from '@/components/Footer';
import '@fortawesome/fontawesome-svg-core/styles.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bitcoin District",
  description: "Bitcoin District is a network of Bitcoiners living and working in the DC, Maryland & Virginia (DMV) area seeking to network, socialize & collaborate with other Bitcoiners.",
  manifest: "/api/manifest/default",
  applicationName: "Bitcoin District",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bitcoin District",
  },
  formatDetection: {
    telephone: false,
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/default/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/default/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/default/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/default/icon-167x167.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/default/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/default/icon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bitcoin District" />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-1 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 relative">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Bitcoin District</Link>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[50px] z-10">
                    <Image 
                      src="/images/logos/bd.png" 
                      alt="Bitcoin District Logo" 
                      width={100} 
                      height={100}
                      className="rounded-full border-4 border-background"
                    />
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              {children}
              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
