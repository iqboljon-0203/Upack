import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://upackb2b.uz"),
  title: {
    default: "UPack - O'zbekistonda B2B Qadoqlash va Gigiyena Yechimlari",
    template: "%s | UPack Toshkent"
  },
  description: "UPackB2B.uz - O'zbekiston, Toshkent bo'ylab B2B mijozlar uchun sifatli qadoqlash materiallari, bir martalik idishlar, qog'oz mahsulotlari ulgurji yetkazib beruvchi hamkor.",
  keywords: [
    "qadoqlash toshkent", "qadoqlash materiallari o'zbekiston", "upack", "upack uzbekistan", "upack toshkent", "bir martalik idishlar", 
    "xo'jalik mollari", "gofrakarton", "skotch", "paketlar", "maishiy kimyo", "toshkent qadoqlash", "upackb2b",
    "odnorazovaya posuda tashkent", "odnorazovaya posuda optom uzbekistan", "bir martalik idishlar optom toshkent",
    "qog'oz stakanlar", "b2b qadoqlash o'zbekiston", "upakovka optom tashkent"
  ],
  authors: [{ name: "UPack Uzbekistan" }],
  creator: "UPack Team",
  publisher: "UPack",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://upackb2b.uz",
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://upackb2b.uz",
    siteName: "UPackB2B.uz",
    title: "UPack - Toshkentda Qadoqlash va Gigiyena Yechimlari",
    description: "B2B va ulgurji mijozlar uchun ishonchli hamkor. Toshkent bo'ylab tez yetkazib berish xizmati.",
    images: [
      {
        url: "/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "UPack qadoqlash yechimlari",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UPack - O'zbekistonda Qadoqlash Yechimlari",
    description: "B2B mijozlar uchun qadoqlash va gigiyena mahsulotlari ulgurji yetkazib beruvchisi.",
    images: ["/hero-bg.png"],
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // Google Search Console verification code
    yandex: "YOUR_YANDEX_VERIFICATION_CODE", // Yandex Webmaster verification code
  },
};

import NextTopLoader from 'nextjs-toploader';
import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={jakarta.className}>
        <NextTopLoader color="#008ca7" showSpinner={false} height={3} />
        <LanguageProvider>
          {children}
          <Toaster position="top-right" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
