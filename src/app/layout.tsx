import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

// 1. Configure viewport parameters for mobile screen scaling and theme adaptation
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

// 2. Comprehensive production SEO metadata setup
export const metadata: Metadata = {
  title: {
    default: "MediTrack — Hospital Workforce & Attendance Management",
    template: "%s | MediTrack",
  },
  description:
    "A premium, minimalist hospital staff attendance registry and workforce management platform designed for modern healthcare facilities.",
  keywords: [
    "hospital attendance",
    "workforce management",
    "medical staff tracker",
    "shift logger",
    "leave ledger",
    "healthcare portal",
  ],
  authors: [{ name: "MediTrack Team" }],

  // Search Engine Indexing Directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // OpenGraph Metadata for Social Platforms (Facebook, LinkedIn, Slack)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meditrack-in.vercel.app",
    title: "MediTrack — Healthcare Workforce Optimization",
    description:
      "Secure, geolocation-validated employee shift logging and leave tracking system custom-tailored for hospital administration.",
    siteName: "MediTrack",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "MediTrack Hospital Dashboard Preview",
        type: "image/png",
      },
    ],
  },

  // Twitter Cards SEO Optimization
  twitter: {
    card: "summary_large_image",
    title: "MediTrack Portal",
    description:
      "Streamlined medical shift authentication logs and payroll reporting metrics.",
    images: ["/logo.png"],
  },

  // FIXED: Explicitly defined sizes and MIME types for icon variants to satisfy strict PWA / crawler parsing checks
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: { url: "/logo.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden m-0 p-0">
      <body className="h-full w-full overflow-hidden m-0 p-0 antialiased bg-white dark:bg-zinc-950">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
