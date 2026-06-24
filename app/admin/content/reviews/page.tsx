"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ReviewsContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    title_uz: "Mijozlarimiz Fikrlari",
    title_ru: "Отзывы наших клиентов",
    desc_uz: "Biz bilan ishlayotgan hamkorlarimiz qanday fikrda.",
    desc_ru: "Что говорят о нас наши партнеры.",
    reviews: [
      { text_uz: "UPack bilan hamkorlik qilish juda qulay. Yetkazib berish doim o'z vaqtida, mahsulot sifati esa yuqori darajada.", text_ru: "Сотрудничать с UPack очень удобно. Доставка всегда вовремя, а качество продукции на высшем уровне.", author_uz: "Aziz Rahimov", author_ru: "Азиз Рахимов", role_uz: "Cafe Noir rahbari", role_ru: "Руководитель Cafe Noir", rating: 5 },
      { text_uz: "B2B xaridlar uchun juda qulay narxlar va keng assortiment. Qadoqlash vositalarini doim shu yerdan buyurtma qilamiz.", text_ru: "Очень выгодные цены и широкий ассортимент для B2B закупок. Упаковочные материалы всегда заказываем здесь.", author_uz: "Nodir Aliyev", author_ru: "Нодир Алиев", role_uz: "Burger House menejeri", role_ru: "Менеджер Burger House", rating: 4.5 },
      { text_uz: "Gigiyenik vositalar va tozalash kimyoviy moddalari borasida ishonchli ta'minotchi. Xizmat ko'rsatish a'lo.", text_ru: "Надежный поставщик гигиенических средств и чистящей химии. Отличное обслуживание.", author_uz: "Malika Umarova", author_ru: "Малика Умарова", role_uz: "Sweet Bake asoschisi", role_ru: "Основатель Sweet Bake", rating: 5 },
      { text_uz: "Ajoyib xizmat! Yirik buyurtmalarga tezkor javob va sifatli mahsulotlar tufayli biznesimiz yana ham rivojlandi.", text_ru: "Отличный сервис! Быстрый ответ на крупные заказы и качественная продукция помогли нашему бизнесу развиваться.", author_uz: "Sardor Karimov", author_ru: "Сардор Каримов", role_uz: "Evos Ta'minot bo'limi", role_ru: "Отдел снабжения Evos", rating: 5 },
      { text_uz: "Yangi idishlar dizayni mijozlarimizga juda yoqdi. Muntazam sifat nazorati sezilib turibdi.", text_ru: "Новый дизайн посуды очень понравился нашим клиентам. Чувствуется регулярный контроль качества.", author_uz: "Dilshod Usmonov", author_ru: "Дилшод Усмонов", role_uz: "Oqtepa Lavash menejeri", role_ru: "Менеджер Oqtepa Lavash", rating: 4.5 }
    ]
  });

  useEffect(() => {
    fetch(`/api/admin/content?id=reviews&t=${Date.now()}`)
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
        body: JSON.stringify({ id: 'reviews', data })
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

  const handleReviewChange = (index: number, field: string, value: string | number) => {
    const newReviews = [...data.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setData({ ...data, reviews: newReviews });
  };

  const addReview = () => {
    setData({
      ...data,
      reviews: [...data.reviews, { text_uz: "", text_ru: "", author_uz: "", author_ru: "", role_uz: "", role_ru: "", rating: 5 }]
    });
  };

  const removeReview = (index: number) => {
    const newReviews = [...data.reviews];
    newReviews.splice(index, 1);
    setData({ ...data, reviews: newReviews });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Mijozlarimiz Fikrlari</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Sharhlar va fikrlarni tahrirlash</p>
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

        {/* Reviews */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">Sharhlar ro'yxati</h3>
            <button onClick={addReview} className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1">
              <Plus size={16} /> Qo'shish
            </button>
          </div>
          
          <div className="space-y-4">
            {data.reviews.map((review, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative">
                <button onClick={() => removeReview(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-error transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Baho (1 dan 5 gacha)</label>
                    <input type="number" min="1" max="5" step="0.5" value={review.rating} onChange={(e) => handleReviewChange(idx, 'rating', parseFloat(e.target.value))} className="w-full md:w-1/3 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fikr (O'zbekcha)</label>
                    <textarea rows={3} value={review.text_uz} onChange={(e) => handleReviewChange(idx, 'text_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Fikr (Ruscha)</label>
                    <textarea rows={3} value={review.text_ru} onChange={(e) => handleReviewChange(idx, 'text_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ism familiya (O'zbekcha)</label>
                    <input type="text" value={review.author_uz} onChange={(e) => handleReviewChange(idx, 'author_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none font-medium text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ism familiya (Ruscha)</label>
                    <input type="text" value={review.author_ru} onChange={(e) => handleReviewChange(idx, 'author_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none font-medium text-slate-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kasbi yoki lavozimi (O'zbekcha)</label>
                    <input type="text" value={review.role_uz} onChange={(e) => handleReviewChange(idx, 'role_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kasbi yoki lavozimi (Ruscha)</label>
                    <input type="text" value={review.role_ru} onChange={(e) => handleReviewChange(idx, 'role_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-slate-600" />
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
