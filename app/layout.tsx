import "./globals.css";
import { Manrope, Sora } from "next/font/google";
import BottomNav from "@/components/BottomNav";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700"]
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"]
});

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="font-[var(--font-manrope)] bg-primary">
        <div className="min-h-screen bg-navy-gradient">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
