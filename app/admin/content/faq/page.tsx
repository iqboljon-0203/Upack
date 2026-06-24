"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function FAQContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    title_uz: "Ko'p Beriladigan Savollar",
    title_ru: "Часто задаваемые вопросы",
    desc_uz: "Mijozlarimiz eng ko'p qiziqadigan savollarga javoblar.",
    desc_ru: "Ответы на самые популярные вопросы наших клиентов.",
    items: [
      { q_uz: "Minimal buyurtma summasi qancha?", q_ru: "Какова минимальная сумма заказа?", a_uz: "Toshkent shahri bo'ylab bepul yetkazib berish uchun minimal buyurtma summasi 500,000 so'm.", a_ru: "Минимальная сумма заказа для бесплатной доставки по Ташкенту составляет 500 000 сум." },
      { q_uz: "Ulgurji narxlar qanday ishlaydi?", q_ru: "Как работают оптовые цены?", a_uz: "Katalogda har bir mahsulot uchun belgilangan minimal ulgurji miqdor bor (masalan, 1000 dona). Agar siz shu miqdordan ko'p olsangiz, narx avtomatik ravishda tushadi.", a_ru: "Для каждого товара в каталоге указано минимальное оптовое количество. Если вы заказываете больше, цена автоматически снижается." },
      { q_uz: "Viloyatlarga yetkazib berish bormi?", q_ru: "Есть ли доставка в регионы?", a_uz: "Ha, viloyatlarga kelishilgan holda logistika kompaniyalari orqali chiqarib yuboramiz. Buning uchun menejerimiz bilan bog'laning.", a_ru: "Да, мы отправляем товары в регионы через логистические компании. Свяжитесь с менеджером для деталей." },
      { q_uz: "Bizning logotipimizni qadoqlarga tushirib bera olasizmi?", q_ru: "Можете ли вы напечатать наш логотип на упаковке?", a_uz: "Albatta. Biz mijozlarimiz uchun individual brendlash xizmatini taklif qilamiz. Minimal tiraj va narxlar bo'yicha ma'lumot olish uchun bizga yozing.", a_ru: "Конечно. Мы предлагаем услуги брендирования. Напишите нам, чтобы узнать минимальный тираж и цены." }
    ]
  });

  useEffect(() => {
    fetch(`/api/admin/content?id=faq&t=${Date.now()}`)
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
        body: JSON.stringify({ id: 'faq', data })
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

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData({ ...data, items: newItems });
  };

  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { q_uz: "", q_ru: "", a_uz: "", a_ru: "" }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...data.items];
    newItems.splice(index, 1);
    setData({ ...data, items: newItems });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Ko'p beriladigan savollar</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">FAQ qismini tahrirlash</p>
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

        {/* Questions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">Savollar va Javoblar ro'yxati</h3>
            <button onClick={addItem} className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1">
              <Plus size={16} /> Qo'shish
            </button>
          </div>
          
          <div className="space-y-4">
            {data.items.map((item, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeItem(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-error transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Savol (O'zbekcha)</label>
                    <input type="text" value={item.q_uz} onChange={(e) => handleItemChange(idx, 'q_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none font-medium text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Savol (Ruscha)</label>
                    <input type="text" value={item.q_ru} onChange={(e) => handleItemChange(idx, 'q_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none font-medium text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Javob (O'zbekcha)</label>
                    <textarea rows={3} value={item.a_uz} onChange={(e) => handleItemChange(idx, 'a_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Javob (Ruscha)</label>
                    <textarea rows={3} value={item.a_ru} onChange={(e) => handleItemChange(idx, 'a_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
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
