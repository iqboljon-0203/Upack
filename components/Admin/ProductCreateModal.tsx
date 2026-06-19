import { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
  categories?: any[];
}

export default function ProductCreateModal({ isOpen, onClose, onSuccess, initialData, categories = [] }: ProductCreateModalProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setCategoryId(initialData.category_id || (categories.length > 0 ? categories[0].id : ""));
        setPrice(initialData.price?.toString() || "");
        setDescription(initialData.description || "");
        setStock(initialData.stock?.toString() || "0");
        setImagePreview(initialData.image_url || null);
        setImageFile(null);
      } else {
        setName("");
        setCategoryId(categories.length > 0 ? categories[0].id : "");
        setPrice("");
        setDescription("");
        setStock("0");
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, initialData, categories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!name || !price || !categoryId) {
      toast.error("Iltimos barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setIsSaving(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      let finalImageUrl = imagePreview;

      // 1. Upload image if new file selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('products')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);
          
        finalImageUrl = publicUrl;
      }

      // 2. Save or Update Product
      const productData = {
        name,
        category_id: categoryId,
        price: parseFloat(price),
        description,
        stock: parseInt(stock),
        image_url: finalImageUrl
      };

      let error;
      if (initialData) {
        const res = await supabase.from('products').update(productData).eq('id', initialData.id);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([productData]);
        error = res.error;
      }

      if (error) throw error;

      toast.success(initialData ? "Mahsulot yangilandi!" : "Mahsulot qo'shildi!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{initialData ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Mahsulot nomi *</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all" 
                placeholder="Masalan: Bir martalik stakan 250ml" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kategoriya *</label>
              <select 
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all"
              >
                <option value="" disabled>Tanlang</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Narxi (so'm) *</label>
              <input 
                type="number" 
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all" 
                placeholder="1000" 
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">To'liq ma'lumot (Tavsif)</label>
              <textarea 
                rows={4} 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all resize-none" 
                placeholder="Mahsulot haqida ma'lumot kiriting..."
              ></textarea>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Asosiy rasm yuklash</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-400 hover:bg-primary-50/50 transition-colors cursor-pointer group relative overflow-hidden"
              >
                {imagePreview ? (
                  <div className="absolute inset-0 w-full h-full p-2">
                    <div className="relative w-full h-full rounded-lg overflow-hidden border border-slate-200 bg-white">
                      <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={20} />
                    </div>
                    <div className="font-bold text-slate-700 mb-1">Rasm yuklash uchun bu yerga bosing</div>
                    <div className="text-xs text-slate-400">Yoki faylni sudrab olib keling (PNG, JPG, WEBP)</div>
                  </>
                )}
              </div>
              {imagePreview && (
                <button 
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="mt-2 text-sm text-error font-bold hover:underline"
                >
                  Rasmni o'chirish
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-slate-50 rounded-b-3xl">
          <button onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">
            Bekor qilish
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto justify-center px-6 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm shadow-primary-600/20 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><Save size={18} /> Saqlash</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
