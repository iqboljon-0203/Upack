"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function HeroContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    badge_uz: "O'zbekistonda 1-raqamli B2B qadoqlash platformasi",
    badge_ru: "Платформа упаковки B2B №1 в Узбекистане",
    title1_uz: "Sanoat va Qadoqlash Uchun",
    title1_ru: "Для промышленности и упаковки",
    title2_uz: "Professional Yechimlar",
    title2_ru: "Профессиональные решения",
    desc_uz: "Ishonchli yetkazib berish, yuqori sifatli materiallar va ulgurji xaridorlar uchun maxsus shartlar.",
    desc_ru: "Надежная доставка, высококачественные материалы и специальные условия для оптовых покупателей.",
    stats: [
      { value: "1000+", label_uz: "Doimiy mijozlar", label_ru: "Постоянных клиентов" },
      { value: "500+", label_uz: "Xil mahsulotlar", label_ru: "Видов продукции" },
      { value: "24/7", label_uz: "Qo'llab-quvvatlash", label_ru: "Поддержка" },
      { value: "100%", label_uz: "Sifat kafolati", label_ru: "Гарантия качества" }
    ]
  });

  useEffect(() => {
    fetch(`/api/admin/content?id=hero&t=${Date.now()}`)
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
        body: JSON.stringify({ id: 'hero', data })
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

  const handleStatChange = (index: number, field: string, value: string) => {
    const newStats = [...data.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, stats: newStats });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Bosh qism (Hero)</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Asosiy sahifaning eng tepadagi qismini tahrirlash</p>
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
        {/* Badge */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Tepada chiqib turadigan yozuv (Badge)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">O'zbekcha</label>
              <input 
                type="text" 
                value={data.badge_uz} 
                onChange={(e) => setData({ ...data, badge_uz: e.target.value })} 
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ruscha</label>
              <input 
                type="text" 
                value={data.badge_ru} 
                onChange={(e) => setData({ ...data, badge_ru: e.target.value })} 
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Titles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Sarlavhalar</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sarlavha 1 (O'zbekcha)</label>
                <input type="text" value={data.title1_uz} onChange={(e) => setData({ ...data, title1_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sarlavha 1 (Ruscha)</label>
                <input type="text" value={data.title1_ru} onChange={(e) => setData({ ...data, title1_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sarlavha 2 - Yashil matn (O'zbekcha)</label>
                <input type="text" value={data.title2_uz} onChange={(e) => setData({ ...data, title2_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sarlavha 2 - Yashil matn (Ruscha)</label>
                <input type="text" value={data.title2_ru} onChange={(e) => setData({ ...data, title2_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Qisqacha ta'rif</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">O'zbekcha</label>
              <textarea rows={3} value={data.desc_uz} onChange={(e) => setData({ ...data, desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ruscha</label>
              <textarea rows={3} value={data.desc_ru} onChange={(e) => setData({ ...data, desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Statistika raqamlari (4 ta)</h3>
          <div className="space-y-6">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-100 bg-slate-50 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Raqam/Qiymat</label>
                  <input type="text" value={stat.value} onChange={(e) => handleStatChange(idx, 'value', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yozuvi (O'zbekcha)</label>
                  <input type="text" value={stat.label_uz} onChange={(e) => handleStatChange(idx, 'label_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yozuvi (Ruscha)</label>
                  <input type="text" value={stat.label_ru} onChange={(e) => handleStatChange(idx, 'label_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
