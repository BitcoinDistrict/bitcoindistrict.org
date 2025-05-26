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
import { siteConfig } from "@/data/config";

export const viewport: Viewport = siteConfig.viewport;

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  manifest: siteConfig.manifest,
  applicationName: siteConfig.applicationName,
  appleWebApp: siteConfig.appleWebApp,
  formatDetection: siteConfig.formatDetection,
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
        <link rel="apple-touch-icon" href={siteConfig.icons.appleTouchIcon} />
        <link rel="apple-touch-icon" sizes="180x180" href={siteConfig.icons.appleTouchIcon180} />
        <link rel="apple-touch-icon" sizes="152x152" href={siteConfig.icons.appleTouchIcon152} />
        <link rel="apple-touch-icon" sizes="167x167" href={siteConfig.icons.appleTouchIcon167} />
        <link rel="icon" type="image/png" sizes="32x32" href={siteConfig.icons.favicon32} />
        <link rel="icon" type="image/png" sizes="16x16" href={siteConfig.icons.favicon16} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content={siteConfig.appleWebApp.statusBarStyle} />
        <meta name="apple-mobile-web-app-title" content={siteConfig.appleWebApp.title} />
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
                    <Link href={"/"}>{siteConfig.title}</Link>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[50px] z-10">
                    <Image 
                      src="/images/logos/bd.png"
                      //href={siteConfig.url}
                      alt={`${siteConfig.title} Logo`} 
                      width={100} 
                      height={100}
                      className="rounded-full border-3 border-background"
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
