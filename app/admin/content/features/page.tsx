"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function FeaturesContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    title_uz: "Nima uchun bizni tanlashadi?",
    title_ru: "Почему выбирают нас?",
    desc_uz: "Biz biznesingiz barqarorligi uchun eng yaxshi sharoitlarni taklif qilamiz.",
    desc_ru: "Мы предлагаем лучшие условия для стабильности вашего бизнеса.",
    cards: [
      { icon: "Box", title_uz: "Doimiy Zaxira", title_ru: "Постоянный запас", desc_uz: "Katta hajmdagi buyurtmalar uchun doimiy ombor zaxirasi mavjud.", desc_ru: "Постоянный складской запас для крупных заказов." },
      { icon: "Truck", title_uz: "Tezkor Yetkazish", title_ru: "Быстрая доставка", desc_uz: "Toshkent bo'ylab bepul va tezkor yetkazib berish xizmati.", desc_ru: "Бесплатная и быстрая доставка по всему Ташкенту." },
      { icon: "ShieldCheck", title_uz: "Sifat Kafolati", title_ru: "Гарантия качества", desc_uz: "Barcha mahsulotlarimiz xalqaro standartlarga va sertifikatlarga ega.", desc_ru: "Вся наша продукция имеет международные стандарты и сертификаты." },
      { icon: "Leaf", title_uz: "Eco-Friendly", title_ru: "Экологичность", desc_uz: "Tabiatga zararsiz, qayta ishlanadigan ekologik toza materiallar.", desc_ru: "Экологически чистые перерабатываемые материалы, безопасные для природы." }
    ]
  });

  useEffect(() => {
    fetch('/api/admin/content?id=features')
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          setData(prev => ({
            ...prev,
            ...res.data,
            cards: Array.isArray(res.data.cards) ? res.data.cards : prev.cards
          }));
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
        body: JSON.stringify({ id: 'features', data })
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

  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...data.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setData({ ...data, cards: newCards });
  };

  const addCard = () => {
    setData({
      ...data,
      cards: [...data.cards, { icon: "Star", title_uz: "", title_ru: "", desc_uz: "", desc_ru: "" }]
    });
  };

  const removeCard = (index: number) => {
    const newCards = [...data.cards];
    newCards.splice(index, 1);
    setData({ ...data, cards: newCards });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Afzalliklar</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">"Nima uchun bizni tanlashadi?" qismini tahrirlash</p>
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
          <h3 className="font-bold text-lg mb-4 text-slate-800">Sarlavha va Qisqacha matn</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sarlavha (O'zbekcha)</label>
                <input type="text" value={data.title_uz} onChange={(e) => setData({ ...data, title_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sarlavha (Ruscha)</label>
                <input type="text" value={data.title_ru} onChange={(e) => setData({ ...data, title_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Matn (O'zbekcha)</label>
                <textarea rows={2} value={data.desc_uz} onChange={(e) => setData({ ...data, desc_uz: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Matn (Ruscha)</label>
                <textarea rows={2} value={data.desc_ru} onChange={(e) => setData({ ...data, desc_ru: e.target.value })} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">Afzalliklar kartochkalari</h3>
            <button onClick={addCard} className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1">
              <Plus size={16} /> Qo'shish
            </button>
          </div>
          
          <div className="space-y-4">
            {data.cards.map((card, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeCard(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-error transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavha (O'zbekcha)</label>
                    <input type="text" value={card.title_uz} onChange={(e) => handleCardChange(idx, 'title_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavha (Ruscha)</label>
                    <input type="text" value={card.title_ru} onChange={(e) => handleCardChange(idx, 'title_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ta'rif (O'zbekcha)</label>
                    <textarea rows={2} value={card.desc_uz} onChange={(e) => handleCardChange(idx, 'desc_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ta'rif (Ruscha)</label>
                    <textarea rows={2} value={card.desc_ru} onChange={(e) => handleCardChange(idx, 'desc_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ikonka nomi (Lucide React dan)</label>
                    <input type="text" value={card.icon} onChange={(e) => handleCardChange(idx, 'icon', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50" placeholder="Masalan: Box, Truck, ShieldCheck" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
