"use client";

import { HelpCircle, Mail, Phone, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const getFAQS = (language: string) => [
  {
    q: language === 'uz' ? "Eng kam buyurtma hajmi qancha?" : "Каков минимальный объем заказа?",
    a: language === 'uz' ? "Har bir mahsulotning o'zining minimal buyurtma soni bor. Odatda bu miqdor 100 yoki 500 donani tashkil qiladi. Aniq miqdorni mahsulot sahifasida ko'rishingiz mumkin." : "У каждого товара есть свое минимальное количество для заказа. Обычно это 100 или 500 штук. Точное количество можно посмотреть на странице товара."
  },
  {
    q: language === 'uz' ? "Yetkazib berish xizmati qanday ishlaydi?" : "Как работает служба доставки?",
    a: language === 'uz' ? "Toshkent shahar ichida yetkazib berish xizmatimiz mavjud. 1,000,000 so'mdan oshgan yirik hajmdagi buyurtmalar uchun yetkazib berish bepul." : "У нас есть служба доставки по городу Ташкент. Для крупных заказов на сумму более 1 000 000 сум доставка бесплатна."
  },
  {
    q: language === 'uz' ? "To'lovni qanday amalga oshirsam bo'ladi?" : "Как я могу оплатить заказ?",
    a: language === 'uz' ? "Siz naqd pul, Payme, Click yoki korporativ mijozlar uchun bank o'tkazmasi orqali to'lov qilishingiz mumkin." : "Вы можете оплатить наличными, через Payme, Click или банковским переводом для корпоративных клиентов."
  },
  {
    q: language === 'uz' ? "Buzilgan yoki sifatsiz mahsulotni qaytarish mumkinmi?" : "Можно ли вернуть бракованный товар?",
    a: language === 'uz' ? "Ha, agar mahsulotda zavod defekti bo'lsa yoki yetkazib berish vaqtida shikastlangan bo'lsa, uni 3 kun ichida bepul almashtirib beramiz." : "Да, если товар имеет заводской брак или был поврежден при доставке, мы бесплатно заменим его в течение 3 дней."
  }
];

export default function YordamPage() {
  const { language } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const FAQS = getFAQS(language);

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mx-auto mb-6">
          <HelpCircle size={40} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{language === 'uz' ? 'Yordam markazi' : 'Центр поддержки'}</h1>
        <p className="text-lg text-slate-500">{language === 'uz' ? "Sizni qiziqtirgan savollarga javob toping yoki biz bilan bog'laning" : 'Найдите ответы на интересующие вас вопросы или свяжитесь с нами'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 mb-4">
            <Phone size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{language === 'uz' ? 'Telefon orqali' : 'По телефону'}</h3>
          <p className="text-slate-500 mb-4">{language === 'uz' ? 'Ish vaqti: 09:00 - 18:00 (Dushanba-Shanba)' : 'Режим работы: 09:00 - 18:00 (Пн-Сб)'}</p>
          <a href="tel:+998909013938" className="text-2xl font-black text-primary-600 hover:text-primary-700 transition-colors">
            +998 90 901-39-38
          </a>
        </div>
        
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-700 mb-4">
            <Mail size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{language === 'uz' ? 'Telegram orqali' : 'Через Telegram'}</h3>
          <p className="text-slate-500 mb-4">{language === 'uz' ? 'Operatorlarimiz sizga tez orada javob berishadi' : 'Наши операторы ответят вам в ближайшее время'}</p>
          <a href="https://t.me/upackuz" target="_blank" rel="noopener noreferrer" className="text-2xl font-black text-primary-600 hover:text-primary-700 transition-colors">
            @upackuz
          </a>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{language === 'uz' ? "Ko'p beriladigan savollar" : 'Часто задаваемые вопросы'}</h2>
        
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 transition-colors hover:border-primary-200">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-slate-900 pr-8">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-slate-400 shrink-0 transition-transform duration-300 ${openIdx === idx ? 'rotate-180 text-primary-600' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 pt-1 text-slate-600 leading-relaxed border-t border-slate-100 mx-6 mt-1">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
