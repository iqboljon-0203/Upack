"use client";

import { Handshake } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HamkorlarPage() {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-6">
        <Handshake size={48} />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{language === 'uz' ? 'Bizning Hamkorlar' : 'Наши партнеры'}</h1>
      <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
        {language === 'uz' ? "UPack kompaniyasi O'zbekistondagi yuzlab restoranlar, kafelar va do'konlar bilan hamkorlik qiladi. B2B savdo tarmog'imizga qo'shiling va biznesingizni biz bilan rivojlantiring!" : 'Компания UPack сотрудничает с сотнями ресторанов, кафе и магазинов в Узбекистане. Присоединяйтесь к нашей торговой сети B2B и развивайте свой бизнес вместе с нами!'}
      </p>
      <Link href="/katalog" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-primary-600/20 transition-all">
        {language === 'uz' ? "Mahsulotlarni ko'rish" : 'Посмотреть товары'}
      </Link>
    </div>
  );
}
