"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function StepsContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    title_uz: "Buyurtma berish qanday ishlaydi?",
    title_ru: "Как сделать заказ?",
    desc_uz: "4 ta oddiy qadam orqali biznesingiz uchun kerakli mahsulotlarni oling.",
    desc_ru: "Получите необходимые продукты для вашего бизнеса за 4 простых шага.",
    steps: [
      { num: "01", title_uz: "Katalogdan tanlang", title_ru: "Выберите из каталога", desc_uz: "Kerakli qadoqlarni toping va hajmini tanlang.", desc_ru: "Найдите нужную упаковку и выберите объем." },
      { num: "02", title_uz: "Savatni to'ldiring", title_ru: "Заполните корзину", desc_uz: "Ulgurji hajmga yetib, avtomatik chegirmaga ega bo'ling.", desc_ru: "Достигните оптового объема и получите автоматическую скидку." },
      { num: "03", title_uz: "Buyurtma bering", title_ru: "Оформите заказ", desc_uz: "Ma'lumotlarni kiritib tasdiqlang.", desc_ru: "Введите данные и подтвердите." },
      { num: "04", title_uz: "Qabul qilib oling", title_ru: "Получите заказ", desc_uz: "Tezkor yetkazib berish xizmatini kuting.", desc_ru: "Дождитесь службы быстрой доставки." }
    ]
  });

  useEffect(() => {
    fetch(`/api/admin/content?id=steps&t=${Date.now()}`)
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
        body: JSON.stringify({ id: 'steps', data })
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

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...data.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setData({ ...data, steps: newSteps });
  };

  const addStep = () => {
    if (data.steps.length >= 6) {
      toast.error("Qadamlar soni 6 tadan oshmasligi kerak");
      return;
    }
    setData({
      ...data,
      steps: [{ num: `0${data.steps.length + 1}`, title_uz: "", title_ru: "", desc_uz: "", desc_ru: "" }, ...data.steps]
    });
    setTimeout(() => {
      const input = document.getElementById('step-input-0') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  };

  const removeStep = (index: number) => {
    const newSteps = [...data.steps];
    newSteps.splice(index, 1);
    setData({ ...data, steps: newSteps });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Buyurtma qadamlari</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">"Buyurtma qanday ishlaydi?" qismini tahrirlash</p>
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

        {/* Steps */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">Qadamlar ro'yxati</h3>
            <button onClick={addStep} disabled={data.steps.length >= 6} className="text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm flex items-center gap-1">
              <Plus size={16} /> Qo'shish
            </button>
          </div>
          
          <div className="space-y-4">
            {data.steps.map((step, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeStep(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-error transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Raqam (Masalan: 01, 02)</label>
                    <input id={`step-input-${idx}`} type="text" value={step.num} onChange={(e) => handleStepChange(idx, 'num', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavha (O'zbekcha)</label>
                    <input type="text" value={step.title_uz} onChange={(e) => handleStepChange(idx, 'title_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Sarlavha (Ruscha)</label>
                    <input type="text" value={step.title_ru} onChange={(e) => handleStepChange(idx, 'title_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ta'rif (O'zbekcha)</label>
                    <textarea rows={2} value={step.desc_uz} onChange={(e) => handleStepChange(idx, 'desc_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ta'rif (Ruscha)</label>
                    <textarea rows={2} value={step.desc_ru} onChange={(e) => handleStepChange(idx, 'desc_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
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
