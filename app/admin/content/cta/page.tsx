"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CTAContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    title1_uz: "Sifatga baho berish uchun",
    title1_ru: "Оцените качество,",
    title2_uz: "namuna so'rang!",
    title2_ru: "запросите образец!",
    desc_uz: "Katta xaridni rejalashtiryapsizmi? Bepul namunalar (Sample Kit) buyurtma qiling va o'z ko'zingiz bilan ko'ring.",
    desc_ru: "Планируете крупную закупку? Закажите бесплатные образцы (Sample Kit) и убедитесь сами.",
    btn1_uz: "Namuna Buyurtma Qilish",
    btn1_ru: "Заказать образец",
    btn2_uz: "Menejer bilan bog'lanish",
    btn2_ru: "Связаться с менеджером"
  });

  useEffect(() => {
    fetch(`/api/admin/content?id=cta&t=${Date.now()}`)
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
        body: JSON.stringify({ id: 'cta', data })
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Namuna so'rash (CTA)</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Asosiy sahifadagi eng quyi qismni tahrirlash</p>
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
        {/* Main Titles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Sarlavha qismlari</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1-Sarlavha (O'zbekcha)</label>
                <input type="text" value={data.title1_uz} onChange={(e) => setData({ ...data, title1_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1-Sarlavha (Ruscha)</label>
                <input type="text" value={data.title1_ru} onChange={(e) => setData({ ...data, title1_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2-Sarlavha (O'zbekcha) - tagida chiqadi</label>
                <input type="text" value={data.title2_uz} onChange={(e) => setData({ ...data, title2_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2-Sarlavha (Ruscha)</label>
                <input type="text" value={data.title2_ru} onChange={(e) => setData({ ...data, title2_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Matn (O'zbekcha)</label>
                <textarea rows={3} value={data.desc_uz} onChange={(e) => setData({ ...data, desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Matn (Ruscha)</label>
                <textarea rows={3} value={data.desc_ru} onChange={(e) => setData({ ...data, desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Tugmalar matni</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1-Tugma (Yashil) - O'zbekcha</label>
                <input type="text" value={data.btn1_uz} onChange={(e) => setData({ ...data, btn1_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">1-Tugma - Ruscha</label>
                <input type="text" value={data.btn1_ru} onChange={(e) => setData({ ...data, btn1_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2-Tugma (Qora) - O'zbekcha</label>
                <input type="text" value={data.btn2_uz} onChange={(e) => setData({ ...data, btn2_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">2-Tugma - Ruscha</label>
                <input type="text" value={data.btn2_ru} onChange={(e) => setData({ ...data, btn2_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
