"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Clock, MapPin, CreditCard, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DeliveryPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(content => {
        if (content && content.delivery) {
          setData(content.delivery);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const d = data || {
    title_uz: "Yetkazib berish xizmati",
    title_ru: "Служба доставки",
    subtitle_uz: "Sizning biznesingiz uzluksiz ishlashi uchun tovarlarni o'z vaqtida, tez va xavfsiz yetkazib beramiz.",
    subtitle_ru: "Для бесперебойной работы вашего бизнеса мы доставляем товары вовремя, быстро и безопасно.",
    
    opt1_title_uz: "Tezkor yetkazib berish",
    opt1_title_ru: "Быстрая доставка",
    opt1_desc_uz: "Buyurtmangiz tasdiqlangandan so'ng, Toshkent shahri ichida 24 soat ichida yetkaziladi.",
    opt1_desc_ru: "После подтверждения заказа доставка по Ташкенту осуществляется в течение 24 часов.",

    opt2_title_uz: "Katta hajmdagi buyurtmalar",
    opt2_title_ru: "Крупные оптовые заказы",
    opt2_desc_uz: "Maxsus yuk mashinalarimizda istalgan hajmdagi tovarlarni xavfsiz yetkazamiz.",
    opt2_desc_ru: "Мы безопасно доставляем товары любого объема на наших специальных грузовиках.",

    opt3_title_uz: "Hududlar bo'yicha",
    opt3_title_ru: "По регионам",
    opt3_desc_uz: "Faqatgina Toshkent shahri emas, balki viloyatlarga ham kelishilgan holda jo'natamiz.",
    opt3_desc_ru: "Мы доставляем не только по Ташкенту, но и по договоренности в регионы.",

    opt4_title_uz: "To'lov turlari",
    opt4_title_ru: "Способы оплаты",
    opt4_desc_uz: "Yetkazib berilgandan so'ng naqd pul yoki terminal (Click/Payme) orqali to'lash imkoniyati.",
    opt4_desc_ru: "Возможность оплаты наличными или через терминал (Click/Payme) после доставки.",

    free_delivery_limit: 1000000
  };

  const formatCurrency = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 lg:py-20 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
          {language === 'uz' ? d.title_uz : d.title_ru}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
          {language === 'uz' ? d.subtitle_uz : d.subtitle_ru}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              {language === 'uz' ? d.opt1_title_uz : d.opt1_title_ru}
            </h3>
            <p className="text-sm text-slate-500">
              {language === 'uz' ? d.opt1_desc_uz : d.opt1_desc_ru}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              {language === 'uz' ? d.opt2_title_uz : d.opt2_title_ru}
            </h3>
            <p className="text-sm text-slate-500">
              {language === 'uz' ? d.opt2_desc_uz : d.opt2_desc_ru}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <MapPin size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              {language === 'uz' ? d.opt3_title_uz : d.opt3_title_ru}
            </h3>
            <p className="text-sm text-slate-500">
              {language === 'uz' ? d.opt3_desc_uz : d.opt3_desc_ru}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">
              {language === 'uz' ? d.opt4_title_uz : d.opt4_title_ru}
            </h3>
            <p className="text-sm text-slate-500">
              {language === 'uz' ? d.opt4_desc_uz : d.opt4_desc_ru}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 mb-12">
        <h2 className="text-xl font-bold text-primary-700 mb-3">
          {language === 'uz' ? 'Bepul Yetkazib Berish' : 'Бесплатная доставка'}
        </h2>
        <p className="text-primary-600">
          {language === 'uz' ? (
            <>Agar sizning xaridingiz summasi <strong>{formatCurrency(d.free_delivery_limit)} so'm</strong> dan oshsa, Toshkent shahri ichida yetkazib berish mutlaqo bepul!</>
          ) : (
            <>Если сумма вашей покупки превышает <strong>{formatCurrency(d.free_delivery_limit)} сум</strong>, доставка по Ташкенту абсолютно бесплатно!</>
          )}
        </p>
      </div>
    </div>
  );
}
