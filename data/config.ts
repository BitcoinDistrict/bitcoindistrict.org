const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const siteConfig = {
  url: defaultUrl,
  title: "Bitcoin District",
  description: "Bitcoin District is a network of Bitcoiners living and working in the DC, Maryland & Virginia (DMV) area seeking to network, socialize & collaborate with other Bitcoiners.",
  applicationName: "Bitcoin District",
  manifest: "/api/manifest/default",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#000000",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bitcoin District",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    appleTouchIcon: "/icons/default/apple-touch-icon.png",
    appleTouchIcon180: "/icons/default/icon-180x180.png",
    appleTouchIcon152: "/icons/default/icon-152x152.png",
    appleTouchIcon167: "/icons/default/icon-167x167.png",
    favicon32: "/icons/default/icon-32x32.png",
    favicon16: "/icons/default/icon-16x16.png",
  }
};
