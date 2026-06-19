"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-6 min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-8 relative">
          <span className="text-6xl font-black text-slate-200">404</span>
          <Search size={40} className="absolute text-slate-400 drop-shadow-md" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {language === 'uz' ? 'Sahifa topilmadi' : 'Страница не найдена'}
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {language === 'uz' ? "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin. Qidiruvdan foydalanib ko'ring." : 'Извините, запрашиваемая страница не существует или могла быть удалена. Попробуйте воспользоваться поиском.'}
        </p>
        <Link 
          href="/katalog"
          className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-primary-600/20 transition-all hover:scale-105"
        >
          {language === 'uz' ? 'Katalogga qaytish' : 'Вернуться в каталог'}
        </Link>
      </div>
    </div>
  );
}
