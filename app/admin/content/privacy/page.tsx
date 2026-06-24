"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PrivacyContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
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
  });

  useEffect(() => {
    fetch(`/api/admin/content?id=privacy&t=${Date.now()}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setData(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'privacy', data })
      });
      if (res.ok) {
        toast.success("Muvaffaqiyatli saqlandi!");
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } catch (err) {
      toast.error("Tarmoq xatosi");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Maxfiylik siyosati</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">/privacy sahifasidagi matnlarni tahrirlash</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Saqlash
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Title & Desc */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Bosh qism</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavha (UZ / RU)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={data.title_uz} onChange={(e) => setData({ ...data, title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" />
                <input type="text" value={data.title_ru} onChange={(e) => setData({ ...data, title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kirish matni (O'zbekcha)</label>
              <textarea rows={3} value={data.desc_uz} onChange={(e) => setData({ ...data, desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kirish matni (Ruscha)</label>
              <textarea rows={3} value={data.desc_ru} onChange={(e) => setData({ ...data, desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">1-Bo'lim</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={data.sec1_title_uz} onChange={(e) => setData({ ...data, sec1_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (UZ)" />
            <input type="text" value={data.sec1_title_ru} onChange={(e) => setData({ ...data, sec1_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (RU)" />
            <textarea rows={4} value={data.sec1_content_uz} onChange={(e) => setData({ ...data, sec1_content_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (UZ)"></textarea>
            <textarea rows={4} value={data.sec1_content_ru} onChange={(e) => setData({ ...data, sec1_content_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (RU)"></textarea>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">2-Bo'lim</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={data.sec2_title_uz} onChange={(e) => setData({ ...data, sec2_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (UZ)" />
            <input type="text" value={data.sec2_title_ru} onChange={(e) => setData({ ...data, sec2_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (RU)" />
            <textarea rows={4} value={data.sec2_content_uz} onChange={(e) => setData({ ...data, sec2_content_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (UZ)"></textarea>
            <textarea rows={4} value={data.sec2_content_ru} onChange={(e) => setData({ ...data, sec2_content_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (RU)"></textarea>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">3-Bo'lim</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={data.sec3_title_uz} onChange={(e) => setData({ ...data, sec3_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (UZ)" />
            <input type="text" value={data.sec3_title_ru} onChange={(e) => setData({ ...data, sec3_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (RU)" />
            <textarea rows={4} value={data.sec3_content_uz} onChange={(e) => setData({ ...data, sec3_content_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (UZ)"></textarea>
            <textarea rows={4} value={data.sec3_content_ru} onChange={(e) => setData({ ...data, sec3_content_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (RU)"></textarea>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">4-Bo'lim (Bog'lanish)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={data.sec4_title_uz} onChange={(e) => setData({ ...data, sec4_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (UZ)" />
            <input type="text" value={data.sec4_title_ru} onChange={(e) => setData({ ...data, sec4_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm font-bold" placeholder="Sarlavha (RU)" />
            <textarea rows={4} value={data.sec4_content_uz} onChange={(e) => setData({ ...data, sec4_content_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (UZ)"></textarea>
            <textarea rows={4} value={data.sec4_content_ru} onChange={(e) => setData({ ...data, sec4_content_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tarkib (RU)"></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
