"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Loader2, Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function BrandsContentAdmin() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [data, setData] = useState({
    title_uz: "Bizga ishonch bildirgan brendlar",
    title_ru: "Бренды, которые нам доверяют",
    brands: [
      { name: "BRAND LOGO 1", image: "" },
      { name: "BRAND LOGO 2", image: "" },
      { name: "BRAND LOGO 3", image: "" }
    ]
  });

  useEffect(() => {
    fetch(`/api/admin/content?id=brands&t=${Date.now()}`)
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
        body: JSON.stringify({ id: 'brands', data })
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

  const handleBrandChange = (index: number, field: string, value: string) => {
    const newBrands = [...data.brands];
    newBrands[index] = { ...newBrands[index], [field]: value };
    setData({ ...data, brands: newBrands });
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    setUploadingIdx(index);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Xatolik yuz berdi');
      }

      handleBrandChange(index, 'image', data.url);
      toast.success("Rasm muvaffaqiyatli yuklandi!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Rasm yuklashda xatolik yuz berdi");
    } finally {
      setUploadingIdx(null);
    }
  };

  const addBrand = () => {
    setData({
      ...data,
      brands: [{ name: "Yangi brend", image: "" }, ...data.brands]
    });
    setTimeout(() => {
      const el = document.getElementById('brand-input-0') as HTMLInputElement | null;
      el?.focus();
      el?.select();
    }, 100);
  };

  const removeBrand = (index: number) => {
    const newBrands = [...data.brands];
    newBrands.splice(index, 1);
    setData({ ...data, brands: newBrands });
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Brendlar</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">"Bizga ishonch bildirgan brendlar" qismini tahrirlash</p>
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
        {/* Main Title */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Sarlavha</h3>
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
        </div>

        {/* Brands List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800">Brendlar (Logolar)</h3>
            <button onClick={addBrand} className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1">
              <Plus size={16} /> Qo'shish
            </button>
          </div>
          
          <div className="space-y-4">
            {data.brands.map((brand, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-xl relative flex flex-col md:flex-row gap-4 items-center">
                <button onClick={() => removeBrand(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-error transition-colors">
                  <Trash2 size={18} />
                </button>
                
                {/* Logo Preview / Upload Area */}
                <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group shrink-0">
                  {brand.image ? (
                    <>
                      <img src={brand.image} alt={brand.name} className="w-full h-full object-contain p-2" />
                      <button 
                        onClick={() => handleBrandChange(idx, 'image', '')}
                        className="absolute inset-0 bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        O'chirish
                      </button>
                    </>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center gap-1 p-2 text-center">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-medium leading-none">Rasm yo'q</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Brend nomi (Matn shaklida)</label>
                    <input id={`brand-input-${idx}`} type="text" value={brand.name} onChange={(e) => handleBrandChange(idx, 'name', e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo rasmi (Rasm yuklang yoki URL kiriting)</label>
                    <div className="flex gap-2">
                      <input type="text" value={brand.image} onChange={(e) => handleBrandChange(idx, 'image', e.target.value)} className="flex-1 border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Rasm linki yoki yuklang" />
                      
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
          <p className="text-xs text-slate-500 mt-4 italic">Eslatma: Agar rasm kiritilmasa yoki yuklanmasa, sahifada brend nomi matn shaklida ko'rsatiladi.</p>
        </div>
      </div>
    </div>
  );
}
