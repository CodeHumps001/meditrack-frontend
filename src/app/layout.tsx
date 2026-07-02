import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
// FIX: Converted root reference paths into an explicit relative workspace destination locator
import "./globals.css";

export const metadata: Metadata = {
  title: "MediTrack",
  description: "Hospital Staff Attendance & Workforce Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
