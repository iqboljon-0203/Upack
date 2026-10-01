import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://restock.uz"),
  title: {
    default: "Restock.uz - Qadoqlash Materiallari va Bir Martalik Idishlar Optom Toshkent",
    template: "%s | Restock.uz"
  },
  description: "Restock.uz - O'zbekistonda B2B qadoqlash materiallari va bir martalik idishlar ulgurji savdo platformasi. Toshkent bo'ylab gofrakarton qutilar, kraft paketlar, skotch, qog'oz stakanlar, plastik idishlar va xo'jalik mollarini eng arzon ulgurji (optom) narxlarda xarid qiling. Tezkor yetkazib berish!",
  keywords: [
    // Uzbek asosiy kalit so'zlar
    "qadoqlash materiallari", "qadoqlash toshkent", "qadoqlash materiallari optom", "qadoqlash vositalari",
    "bir martalik idishlar", "bir martalik idishlar optom toshkent", "bir martalik idishlar narxlari",
    "bir martalik stakanlar", "qog'oz stakanlar", "qog'oz stakan optom", "kofe stakanlari",
    "gofrakarton", "gofrakarton qutilar", "karton korobkalar toshkent", "qutilar optom", "korobkalar optom",
    "skotch", "skotch optom", "skotch toshkent", "streych plyonka", "strech plenka optom",
    "kraft paketlar", "kraft paket toshkent", "paketlar optom", "mayka paketlar", "polietilen paketlar",
    "fast food qadoqlari", "burger qutisi", "pizza qutisi", "konteynerlar", "plastik konteynerlar",
    "plastik idishlar", "sous idishlari", "alyumin qoliplar",
    "xo'jalik mollari", "xo'jalik mollari optom", "maishiy kimyo toshkent", "tozalash vositalari",
    "salfetkalar", "tualet qog'ozi optom", "qog'oz sochiqlar",
    "restock", "restock uz", "restock.uz", "restock toshkent", "restock uzbekistan", "b2b qadoqlash", "ulgurji savdo toshkent",
    
    // Ruscha yuqori talabli kalit so'zlar (Yandex va Google RU)
    "упаковочные материалы ташкент", "упаковка оптом узбекистан", "упаковочные материалы",
    "одноразовая посуда ташкент", "одноразовая посуда оптом ташкент", "одноразовая посуда",
    "бумажные стаканчики", "бумажные стаканы оптом", "стаканы для кофе",
    "гофрокартон ташкент", "картонные коробки оптом", "коробки для пиццы",
    "крафт пакеты ташкент", "пакеты майка оптом", "полиэтиленовые пакеты",
    "скотч упаковочный оптом", "стрейч пленка ташкент", "стрейч пленка оптом",
    "упаковка для фастфуда", "ланч боксы", "контейнеры для еды", "соусники пластиковые",
    "хозяйственные товары оптом", "бытовая химия ташкент", "салфетки бумажные оптом",
    "ресток", "ресток уз", "b2b упаковка ташкент"
  ],
  authors: [{ name: "Restock Uzbekistan", url: "https://restock.uz" }],
  creator: "Restock Team",
  publisher: "Restock.uz",
  category: "ecommerce",
  classification: "B2B E-commerce Wholesale Packaging and Tableware",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://restock.uz",
    languages: {
      "uz-UZ": "https://restock.uz",
      "ru-RU": "https://restock.uz",
    },
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://restock.uz",
    siteName: "Restock.uz",
    title: "Restock.uz - Qadoqlash Materiallari va Bir Martalik Idishlar Optom Toshkent",
    description: "B2B va ulgurji mijozlar uchun ishonchli hamkor. Qadoqlash materiallari, bir martalik idishlar, gofrakarton qutilar va xo'jalik mollari ulgurji narxda.",
    images: [
      {
        url: "https://restock.uz/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Restock.uz B2B Qadoqlash Yechimlari",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restock.uz - O'zbekistonda B2B Qadoqlash Materiallari",
    description: "B2B mijozlar uchun sifatli qadoqlash va bir martalik idishlar ulgurji yetkazib beruvchisi.",
    images: ["https://restock.uz/logo-full.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#008ca7",
    "geo.region": "UZ-TO",
    "geo.placename": "Tashkent",
    "format-detection": "telephone=no",
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
