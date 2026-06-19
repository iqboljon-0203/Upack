"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, ShieldCheck, Target, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(content => {
        if (content && content.about) {
          setData(content.about);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const aboutData = data || {
    title_uz: "Biz haqimizda",
    title_ru: "О нас",
    subtitle_uz: "UPack - O'zbekistondagi yetakchi qadoqlash vositalari va bir martalik idishlar ta'minotchisi.",
    subtitle_ru: "UPack - ведущий поставщик упаковочных материалов и одноразовой посуды в Узбекистане.",
    history_title_uz: "Bizning tariximiz",
    history_title_ru: "Наша история",
    history_desc_uz: "Biz o'z faoliyatimizni kichik bir korxona sifatida boshlaganmiz. Bugungi kunda yuzlab restoranlar, kafelar va bizneslar uchun ishonchli hamkorga aylandik.",
    history_desc_ru: "Мы начинали свою деятельность как небольшое предприятие. Сегодня мы стали надежным партнером для сотен ресторанов, кафе и бизнесов.",
    goal_title_uz: "Bizning maqsadimiz",
    goal_title_ru: "Наша цель",
    goal_desc_uz: "Mijozlarimizga eng yuqori sifatli qadoqlash mahsulotlarini, eng hamyonbop narxlarda yetkazib berish orqali ularning biznes rivojiga hissa qo'shish.",
    goal_desc_ru: "Вносить вклад в развитие бизнеса наших клиентов, поставляя высококачественную упаковочную продукцию по самым доступным ценам.",
    why_title_uz: "Nega aynan UPack?",
    why_title_ru: "Почему именно UPack?",
    why_item1_title_uz: "Sifat kafolati:",
    why_item1_title_ru: "Гарантия качества:",
    why_item1_desc_uz: "Barcha mahsulotlarimiz sanitariya-gigiyena talablariga to'la javob beradi.",
    why_item1_desc_ru: "Вся наша продукция полностью соответствует санитарно-гигиеническим требованиям.",
    why_item2_title_uz: "Mijozlarga e'tibor:",
    why_item2_title_ru: "Внимание к клиентам:",
    why_item2_desc_uz: "Har bir mijoz uchun individual yondashuv va maxsus chegirmalar.",
    why_item2_desc_ru: "Индивидуальный подход к каждому клиенту и специальные скидки."
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
          {language === 'uz' ? aboutData.title_uz : aboutData.title_ru}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
          {language === 'uz' ? aboutData.subtitle_uz : aboutData.subtitle_ru}
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
            <Building2 size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            {language === 'uz' ? aboutData.history_title_uz : aboutData.history_title_ru}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {language === 'uz' ? aboutData.history_desc_uz : aboutData.history_desc_ru}
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
            <Target size={28} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            {language === 'uz' ? aboutData.goal_title_uz : aboutData.goal_title_ru}
          </h3>
          <p className="text-slate-600 leading-relaxed">
            {language === 'uz' ? aboutData.goal_desc_uz : aboutData.goal_desc_ru}
          </p>
        </div>
      </div>

      <div className="prose prose-slate prose-lg max-w-none bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'uz' ? aboutData.why_title_uz : aboutData.why_title_ru}
        </h2>
        <ul className="space-y-4 text-slate-600 list-none pl-0">
          <li className="flex items-start gap-3">
            <ShieldCheck className="text-primary-600 shrink-0 mt-1" />
            <span>
              <strong>{language === 'uz' ? aboutData.why_item1_title_uz : aboutData.why_item1_title_ru}</strong> {language === 'uz' ? aboutData.why_item1_desc_uz : aboutData.why_item1_desc_ru}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Users className="text-primary-600 shrink-0 mt-1" />
            <span>
              <strong>{language === 'uz' ? aboutData.why_item2_title_uz : aboutData.why_item2_title_ru}</strong> {language === 'uz' ? aboutData.why_item2_desc_uz : aboutData.why_item2_desc_ru}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
