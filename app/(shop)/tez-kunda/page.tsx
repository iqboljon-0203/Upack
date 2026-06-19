"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TezKundaPage() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-6">
        <Clock size={48} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{language === 'uz' ? 'Tez kunda' : 'Скоро'}</h1>
      <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
        {language === 'uz' ? "Bu sahifa hozirda ishlab chiqilmoqda. Tez orada to'liq ma'lumotlar joylanadi." : 'Эта страница в настоящее время находится в разработке. Полная информация будет добавлена в ближайшее время.'}
      </p>
      <Link href="/" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-primary-600/20 transition-all">
        {language === 'uz' ? 'Bosh sahifaga qaytish' : 'Вернуться на главную'}
      </Link>
    </div>
  );
}
