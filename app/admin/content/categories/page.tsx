"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CategoriesContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [data, setData] = useState({
    categories: [
      { id: 'bir-martalik', title_uz: 'Bir martalik idishlar', title_ru: 'Одноразовая посуда', desc_uz: "Kafelar, restoranlar va yetkazib berish xizmatlari uchun", desc_ru: "Для кафе, ресторанов и служб доставки", img: "/category-1.png" },
      { id: 'qadoqlash', title_uz: 'Qadoqlash vositalari', title_ru: 'Упаковочные материалы', desc_uz: "Karton, plyonka, skotch va qutilar", desc_ru: "Картон, пленка, скотч и коробки", img: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=800&auto=format&fit=crop" },
      { id: 'ximiya', title_uz: 'Maishiy va professional ximiya', title_ru: 'Бытовая и профессиональная химия', desc_uz: "Yuqori sifatli tozalash vositalari", desc_ru: "Высококачественные чистящие средства", img: "https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=800&auto=format&fit=crop" },
      { id: 'tozalash', title_uz: 'Tozalash anjomlari', title_ru: 'Уборочный инвентарь', desc_uz: "Tozalik uchun kerakli asbob-uskunalar", desc_ru: "Необходимые инструменты для уборки", img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=800&auto=format&fit=crop" },
      { id: 'gigiyena', title_uz: 'Gigiyenik mahsulotlar', title_ru: 'Гигиенические товары', desc_uz: "Shaxsiy himoya va gigiyena", desc_ru: "Личная защита и гигиена", img: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=800&auto=format&fit=crop" },
      { id: 'xojalik', title_uz: "Boshqa xo'jalik mollari", title_ru: "Другие хозяйственные товары", desc_uz: "Uyingiz va biznesingiz uchun barcha kerakli mollar", desc_ru: "Все необходимые товары для дома и бизнеса", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" }
    ]
  });

  useEffect(() => {
    fetch('/api/admin/content?id=categories_extra')
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
        body: JSON.stringify({ id: 'categories_extra', data })
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

  const handleCategoryChange = (index: number, field: string, value: string) => {
    const newCategories = [...data.categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setData({ ...data, categories: newCategories });
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    setUploadingIdx(index);
    try {
      const { supabase } = await import('@/lib/supabase');
      const fileExt = file.name.split('.').pop();
      const fileName = `category_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      handleCategoryChange(index, 'img', publicUrl);
      toast.success("Rasm muvaffaqiyatli yuklandi!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Rasm yuklashda xatolik yuz berdi");
    } finally {
      setUploadingIdx(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Kategoriyalar bannerlari</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Asosiy sahifadagi 6 ta asosiy kategoriya kartochkalarini tahrirlash</p>
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
        {data.categories.map((cat, idx) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            {/* Category Preview / Upload Area */}
            <div className="w-32 h-32 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group shrink-0">
              {cat.img ? (
                <>
                  <img src={cat.img} alt={cat.title_uz} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleCategoryChange(idx, 'img', '')}
                    className="absolute inset-0 bg-black/60 text-white text-xs font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    O'chirish
                  </button>
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-1 p-2 text-center">
                  <ImageIcon size={32} />
                  <span className="text-xs font-medium">Rasm yo'q</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nom (O'zbekcha)</label>
                  <input type="text" value={cat.title_uz} onChange={(e) => handleCategoryChange(idx, 'title_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nom (Ruscha)</label>
                  <input type="text" value={cat.title_ru} onChange={(e) => handleCategoryChange(idx, 'title_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tavsif (O'zbekcha)</label>
                  <input type="text" value={cat.desc_uz} onChange={(e) => handleCategoryChange(idx, 'desc_uz', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-slate-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tavsif (Ruscha)</label>
                  <input type="text" value={cat.desc_ru} onChange={(e) => handleCategoryChange(idx, 'desc_ru', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-slate-600" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Orqa fon rasmi (Rasm yuklang yoki URL kiriting)</label>
                <div className="flex gap-2">
                  <input type="text" value={cat.img} onChange={(e) => handleCategoryChange(idx, 'img', e.target.value)} className="flex-1 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Rasm linki yoki yuklang" />
                  
                  <input 
                    type="file" 
                    ref={el => { fileInputRefs.current[idx] = el; }} 
                    onChange={(e) => handleFileUpload(idx, e)} 
                    className="hidden" 
                    accept="image/*" 
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    disabled={uploadingIdx === idx}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    {uploadingIdx === idx ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
