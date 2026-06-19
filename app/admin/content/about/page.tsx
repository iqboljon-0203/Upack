"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AboutContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
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
  });

  useEffect(() => {
    fetch('/api/admin/content?id=about')
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
        body: JSON.stringify({ id: 'about', data })
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Biz haqimizda sahifasi</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">/about sahifasidagi matnlarni tahrirlash</p>
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
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Sahifa boshi (Hero)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bosh sarlavha (O'zbekcha)</label>
              <input type="text" value={data.title_uz} onChange={(e) => setData({ ...data, title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bosh sarlavha (Ruscha)</label>
              <input type="text" value={data.title_ru} onChange={(e) => setData({ ...data, title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Qisqa ta'rif (O'zbekcha)</label>
              <textarea rows={2} value={data.subtitle_uz} onChange={(e) => setData({ ...data, subtitle_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Qisqa ta'rif (Ruscha)</label>
              <textarea rows={2} value={data.subtitle_ru} onChange={(e) => setData({ ...data, subtitle_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* History & Goal */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Tariximiz va Maqsadimiz</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tariximiz Sarlavha (O'zbekcha)</label>
              <input type="text" value={data.history_title_uz} onChange={(e) => setData({ ...data, history_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tariximiz Sarlavha (Ruscha)</label>
              <input type="text" value={data.history_title_ru} onChange={(e) => setData({ ...data, history_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tariximiz matni (O'zbekcha)</label>
              <textarea rows={3} value={data.history_desc_uz} onChange={(e) => setData({ ...data, history_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tariximiz matni (Ruscha)</label>
              <textarea rows={3} value={data.history_desc_ru} onChange={(e) => setData({ ...data, history_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2"></div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Maqsadimiz Sarlavha (O'zbekcha)</label>
              <input type="text" value={data.goal_title_uz} onChange={(e) => setData({ ...data, goal_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Maqsadimiz Sarlavha (Ruscha)</label>
              <input type="text" value={data.goal_title_ru} onChange={(e) => setData({ ...data, goal_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Maqsadimiz matni (O'zbekcha)</label>
              <textarea rows={3} value={data.goal_desc_uz} onChange={(e) => setData({ ...data, goal_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Maqsadimiz matni (Ruscha)</label>
              <textarea rows={3} value={data.goal_desc_ru} onChange={(e) => setData({ ...data, goal_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Why Us Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Nega aynan UPack? (Afzalliklarimiz)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bo'lim Sarlavhasi</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={data.why_title_uz} onChange={(e) => setData({ ...data, why_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="O'zbekcha" />
                <input type="text" value={data.why_title_ru} onChange={(e) => setData({ ...data, why_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Ruscha" />
              </div>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
              <h4 className="font-bold text-sm text-slate-700 mb-2">1-Afzallik (Sifat)</h4>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavhasi (O'zbekcha / Ruscha)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={data.why_item1_title_uz} onChange={(e) => setData({ ...data, why_item1_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                <input type="text" value={data.why_item1_title_ru} onChange={(e) => setData({ ...data, why_item1_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ta'rifi (O'zbekcha / Ruscha)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={data.why_item1_desc_uz} onChange={(e) => setData({ ...data, why_item1_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                <input type="text" value={data.why_item1_desc_ru} onChange={(e) => setData({ ...data, why_item1_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
              <h4 className="font-bold text-sm text-slate-700 mb-2">2-Afzallik (Mijozlar)</h4>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavhasi (O'zbekcha / Ruscha)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={data.why_item2_title_uz} onChange={(e) => setData({ ...data, why_item2_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                <input type="text" value={data.why_item2_title_ru} onChange={(e) => setData({ ...data, why_item2_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ta'rifi (O'zbekcha / Ruscha)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={data.why_item2_desc_uz} onChange={(e) => setData({ ...data, why_item2_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                <input type="text" value={data.why_item2_desc_ru} onChange={(e) => setData({ ...data, why_item2_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
