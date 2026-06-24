"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(content => {
        if (content && content.privacy) {
          setData(content.privacy);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const p = data || {
    title_uz: "Maxfiylik Siyosati",
    title_ru: "Политика конфиденциальности",
    desc_uz: "Ushbu Maxfiylik Siyosati UPackB2B.uz veb-sayti tomonidan foydalanuvchilarning shaxsiy ma'lumotlari qanday yig'ilishi, foydalanilishi va himoya qilinishini belgilaydi. Biz sizning maxfiyligingizni hurmat qilamiz va ma'lumotlaringiz xavfsizligini ta'minlashga intilamiz.",
    desc_ru: "Данная Политика конфиденциальности определяет, как веб-сайт UPackB2B.uz собирает, использует и защищает личную информацию пользователей. Мы уважаем вашу конфиденциальность и стремимся обеспечить безопасность ваших данных.",
    
    sec1_title_uz: "1. Qanday ma'lumotlarni yig'amiz?",
    sec1_title_ru: "1. Какую информацию мы собираем?",
    sec1_content_uz: "Saytdan foydalanish va buyurtma berish jarayonida biz quyidagi ma'lumotlarni so'rashimiz mumkin:\n- Ismingiz va familiyangiz\n- Aloqa ma'lumotlari (Telefon raqami, elektron pochta)\n- Yetkazib berish manzili\n- Buyurtma tarixi va saytdagi xatti-harakatlaringiz",
    sec1_content_ru: "В процессе использования сайта и оформления заказа мы можем запросить следующую информацию:\n- Ваше имя и фамилия\n- Контактные данные (Номер телефона, электронная почта)\n- Адрес доставки\n- История заказов и ваши действия на сайте",
 
    sec2_title_uz: "2. Ma'lumotlardan qanday foydalanamiz?",
    sec2_title_ru: "2. Как мы используем информацию?",
    sec2_content_uz: "Yig'ilgan ma'lumotlar quyidagi maqsadlarda ishlatiladi:\n- Buyurtmangizni qayta ishlash va yetkazib berish\n- Siz bilan bog'lanish (Buyurtma holati haqida xabar berish)\n- Saytimizni yanada yaxshilash va xizmat sifatini oshirish\n- Yangi aksiyalar va chegirmalar haqida xabar berish (ixtiyoriy)",
    sec2_content_ru: "Собранная информация используется в следующих целях:\n- Обработка и доставка вашего заказа\n- Связь с вами (уведомление о статусе заказа)\n- Улучшение нашего сайта и повышение качества обслуживания\n- Уведомление о новых акциях и скидках (по желанию)",
 
    sec3_title_uz: "3. Ma'lumotlar xavfsizligi",
    sec3_title_ru: "3. Безопасность данных",
    sec3_content_uz: "Biz sizning ma'lumotlaringizni ruxsatsiz kirish, o'zgartirish, oshkor qilish yoki yo'q qilishdan himoya qilish uchun tegishli texnik va tashkiliy xavfsizlik choralarini ko'ramiz. Sizning ma'lumotlaringiz uchinchi shaxslarga sotilmaydi yoki ijaraga berilmaydi.",
    sec3_content_ru: "Мы принимаем соответствующие технические и организационные меры безопасности для защиты вашей информации от несанкционированного доступа, изменения, раскрытия или уничтожения. Ваша информация не продается и не сдается в аренду третьим лицам.",
 
    sec4_title_uz: "4. Bog'lanish",
    sec4_title_ru: "4. Контакты",
    sec4_content_uz: "Agar ushbu maxfiylik siyosati bo'yicha savollaringiz bo'lsa, biz bilan quyidagi manzil orqali bog'lanishingiz mumkin:\nTelefon: +998 90 901 39 38\nPochta: info@upackb2b.uz",
    sec4_content_ru: "Если у вас есть вопросы по поводу этой политики конфиденциальности, вы можете связаться с нами по следующим контактам:\nТелефон: +998 90 901 39 38\nПочта: info@upackb2b.uz"
  };

  const renderBulletList = (content: string) => {
    return (
      <ul className="list-disc pl-5 space-y-1 mt-2">
        {content.split('\n').map((line, i) => {
          const cleanLine = line.replace(/^-\s*/, '');
          if (!cleanLine.trim()) return null;
          return <li key={i}>{cleanLine}</li>;
        })}
      </ul>
    );
  };

  const renderParagraphs = (content: string) => {
    if (content.includes('\n-') || content.includes('\n*')) {
      const parts = content.split(/\n[-*]/);
      const intro = parts[0];
      const listItems = parts.slice(1);
      return (
        <>
          <p>{intro}</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            {listItems.map((item, i) => (
              <li key={i}>{item.trim()}</li>
            ))}
          </ul>
        </>
      );
    }

    return content.split('\n').map((para, i) => {
      if (!para.trim()) return null;
      return <p key={i} className="mb-4">{para}</p>;
    });
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="container mx-auto px-6 py-12 lg:py-20 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-8">
          {language === 'uz' ? p.title_uz : p.title_ru}
        </h1>
        
        <div className="prose prose-slate prose-lg max-w-none bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div>
            <p className="lead">
              {language === 'uz' ? p.desc_uz : p.desc_ru}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {language === 'uz' ? p.sec1_title_uz : p.sec1_title_ru}
            </h3>
            {renderParagraphs(language === 'uz' ? p.sec1_content_uz : p.sec1_content_ru)}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {language === 'uz' ? p.sec2_title_uz : p.sec2_title_ru}
            </h3>
            {renderParagraphs(language === 'uz' ? p.sec2_content_uz : p.sec2_content_ru)}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {language === 'uz' ? p.sec3_title_uz : p.sec3_title_ru}
            </h3>
            {renderParagraphs(language === 'uz' ? p.sec3_content_uz : p.sec3_content_ru)}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {language === 'uz' ? p.sec4_title_uz : p.sec4_title_ru}
            </h3>
            {renderParagraphs(language === 'uz' ? p.sec4_content_uz : p.sec4_content_ru)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
