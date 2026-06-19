"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DeliveryContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
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
  });

  useEffect(() => {
    fetch('/api/admin/content?id=delivery')
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
        body: JSON.stringify({ id: 'delivery', data })
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Yetkazib berish sahifasi</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">/delivery sahifasidagi matnlar va yetkazib berish limitini tahrirlash</p>
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
        {/* Header content */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Bosh qism</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavha (O'zbekcha)</label>
              <input type="text" value={data.title_uz} onChange={(e) => setData({ ...data, title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavha (Ruscha)</label>
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

        {/* Free delivery limit */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Bepul yetkazib berish sharti</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bepul yetkazish uchun minimal buyurtma summasi (so'mda)</label>
            <input type="number" value={data.free_delivery_limit} onChange={(e) => setData({ ...data, free_delivery_limit: parseInt(e.target.value) || 0 })} className="w-full md:w-1/2 border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none font-bold" />
          </div>
        </div>

        {/* Options */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Yetkazib berish afzalliklari</h3>
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-700">1. Tezkor yetkazib berish</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={data.opt1_title_uz} onChange={(e) => setData({ ...data, opt1_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (UZ)" />
              <input type="text" value={data.opt1_title_ru} onChange={(e) => setData({ ...data, opt1_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (RU)" />
              <textarea rows={2} value={data.opt1_desc_uz} onChange={(e) => setData({ ...data, opt1_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (UZ)"></textarea>
              <textarea rows={2} value={data.opt1_desc_ru} onChange={(e) => setData({ ...data, opt1_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (RU)"></textarea>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h4 className="font-bold text-sm text-slate-700">2. Katta hajmdagi buyurtmalar</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={data.opt2_title_uz} onChange={(e) => setData({ ...data, opt2_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (UZ)" />
              <input type="text" value={data.opt2_title_ru} onChange={(e) => setData({ ...data, opt2_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (RU)" />
              <textarea rows={2} value={data.opt2_desc_uz} onChange={(e) => setData({ ...data, opt2_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (UZ)"></textarea>
              <textarea rows={2} value={data.opt2_desc_ru} onChange={(e) => setData({ ...data, opt2_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (RU)"></textarea>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h4 className="font-bold text-sm text-slate-700">3. Hududlar bo'yicha</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={data.opt3_title_uz} onChange={(e) => setData({ ...data, opt3_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (UZ)" />
              <input type="text" value={data.opt3_title_ru} onChange={(e) => setData({ ...data, opt3_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (RU)" />
              <textarea rows={2} value={data.opt3_desc_uz} onChange={(e) => setData({ ...data, opt3_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (UZ)"></textarea>
              <textarea rows={2} value={data.opt3_desc_ru} onChange={(e) => setData({ ...data, opt3_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (RU)"></textarea>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <h4 className="font-bold text-sm text-slate-700">4. To'lov turlari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={data.opt4_title_uz} onChange={(e) => setData({ ...data, opt4_title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (UZ)" />
              <input type="text" value={data.opt4_title_ru} onChange={(e) => setData({ ...data, opt4_title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm" placeholder="Sarlavha (RU)" />
              <textarea rows={2} value={data.opt4_desc_uz} onChange={(e) => setData({ ...data, opt4_desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (UZ)"></textarea>
              <textarea rows={2} value={data.opt4_desc_ru} onChange={(e) => setData({ ...data, opt4_desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2 text-sm resize-none" placeholder="Tavsif (RU)"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
