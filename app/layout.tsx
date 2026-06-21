import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://upackb2b.uz"),
  title: {
    default: "UPack - Sifatli Qadoqlash va Gigiyena Yechimlari",
    template: "%s | UPackB2B.uz"
  },
  description: "UPackB2B.uz - B2B mijozlar uchun sifatli qadoqlash materiallari, bir martalik idishlar, qog'oz mahsulotlari va xo'jalik mollari yetkazib beruvchi ishonchli hamkor.",
  keywords: [
    "qadoqlash", "qadoqlash materiallari", "upack", "upackb2b.uz", "bir martalik idishlar", 
    "xo'jalik mollari", "gofrakarton", "skotch", "paketlar", "maishiy kimyo", "toshkent qadoqlash", "upackb2b",
    "odnorazovaya posuda", "odnorazovaya posuda optom", "odnorazovaya posuda tashkent", "bir martalik idishlar optom",
    "bumajnie stakanchiki", "stakanchiki optom", "qog'oz stakanlar", "b2b qadoqlash", "upakovka optom"
  ],
  authors: [{ name: "UPack" }],
  creator: "UPack Team",
  publisher: "UPack",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://upackb2b.uz",
    siteName: "UPackB2B.uz",
    title: "UPack - Qadoqlash va Gigiyena Yechimlari",
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
    title: "UPack - Qadoqlash Yechimlari",
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
