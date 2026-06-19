"use client";

import { Percent } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AksiyaPage() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-6">
        <Percent size={48} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{language === 'uz' ? 'Maxsus Aksiyalar' : 'Специальные акции'}</h1>
      <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
        {language === 'uz' ? "Hozircha saytimizda faol aksiyalar mavjud emas. Yangi chegirmalar va maxsus takliflardan birinchilardan bo'lib xabardor bo'lish uchun bizni kuzatib boring!" : 'На данный момент активных акций нет. Следите за нами, чтобы первыми узнавать о новых скидках и специальных предложениях!'}
      </p>
      <Link href="/katalog" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-primary-600/20 transition-all">
        {language === 'uz' ? "Katalogga o'tish" : 'Перейти в каталог'}
      </Link>
    </div>
  );
}
