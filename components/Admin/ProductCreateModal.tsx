import { useState, useEffect, useRef } from "react";
import { X, Upload, Save, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
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
  const [inStock, setInStock] = useState(true);
  const [minOrder, setMinOrder] = useState("1");
  const [step, setStep] = useState("1");
  
  const [variants, setVariants] = useState<{ id: string, name: string, price: string }[]>([]);
  
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
        setDescription(initialData.full_desc || "");
        setInStock(initialData.inStock !== false); // default true if undefined
        setMinOrder(initialData.minOrder?.toString() || "1");
        
        const stepOpt = initialData.options?.find((o: any) => o.name === "Step");
        setStep(stepOpt ? stepOpt.values[0] : "1");

        setVariants(initialData.variants || []);
        setImagePreview(initialData.image || null);
        setImageFile(null);
      } else {
        setName("");
        setCategoryId(categories.length > 0 ? categories[0].id : "");
        setPrice("");
        setDescription("");
        setInStock(true);
        setMinOrder("1");
        setStep("1");
        setVariants([]);
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [isOpen, initialData, categories]);

  const buildCategoryTree = () => {
    const parentCategories = categories.filter(c => !c.parent_id);
    const subCategories = categories.filter(c => c.parent_id);

    const tree: Array<{ id: string; name_uz: string; name_ru: string; isSub: boolean }> = [];

    parentCategories.forEach(parent => {
      tree.push({
        id: parent.id,
        name_uz: parent.name_uz || parent.name || '',
        name_ru: parent.name_ru || parent.name || '',
        isSub: false
      });

      const children = subCategories.filter(child => child.parent_id === parent.id);
      children.forEach(child => {
        tree.push({
          id: child.id,
          name_uz: child.name_uz || child.name || '',
          name_ru: child.name_ru || child.name || '',
          isSub: true
        });
      });
    });

    subCategories.forEach(child => {
      if (!tree.some(t => t.id === child.id)) {
        tree.push({
          id: child.id,
          name_uz: child.name_uz || child.name || '',
          name_ru: child.name_ru || child.name || '',
          isSub: true
        });
      }
    });

    return tree;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addVariant = () => {
    setVariants([...variants, { id: Math.random().toString(36).substring(7), name: '', price: '' }]);
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSave = async () => {
    if (!name || !price || !categoryId) {
      toast.error("Iltimos barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setIsSaving(true);
    try {
      let finalImageUrl = imagePreview;

      // 1. Upload image if new file selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadJson = await uploadRes.json();
        
        if (!uploadJson.success) {
          throw new Error(uploadJson.message || "Rasm yuklashda xatolik");
        }
        
        finalImageUrl = uploadJson.url;
      }

      const finalOptions = variants.length > 0 ? [{ name: "O'lcham / Hajm", values: variants.map(v => v.name) }] : [];
      if (parseInt(step) > 1) {
        finalOptions.push({ name: "Step", values: [step.toString()] });
      }

      // 2. Save or Update Product via Admin API to bypass RLS
      const productData = {
        name,
        category_id: categoryId,
        price: parseFloat(price),
        full_desc: description,
        inStock: inStock,
        minOrder: parseInt(minOrder) || 1,
        image: finalImageUrl,
        variants: variants,
        options: finalOptions
      };

      const endpoint = '/api/admin/products';
      const method = initialData ? 'PUT' : 'POST';
      const body = initialData ? { id: initialData.id, ...productData } : productData;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const json = await res.json();

      if (!json.success) throw new Error(json.message);

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
                placeholder="Masalan: Bir martalik stakan" 
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
                {buildCategoryTree().map(c => (
                  <option key={c.id} value={c.id}>
                    {c.isSub ? `— ${c.name_uz} (${c.name_ru})` : `${c.name_uz} (${c.name_ru})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Asosiy narxi (so'm) *</label>
              <input 
                type="number" 
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all" 
                placeholder="1000" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Minimal buyurtma</label>
              <input 
                type="number" 
                value={minOrder}
                onChange={e => setMinOrder(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all" 
                placeholder="1" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Qadam (Masalan: 100 tadan)</label>
              <input 
                type="number" 
                value={step}
                onChange={e => setStep(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all" 
                placeholder="1" 
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="block text-sm font-bold text-slate-700 mb-3">Holati (Omborda)</label>
              <label className="relative inline-flex items-center cursor-pointer w-max">
                <input 
                  type="checkbox" 
                  checked={inStock}
                  onChange={e => setInStock(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                <span className="ml-3 text-sm font-medium text-slate-700">
                  {inStock ? "Mavjud" : "Tugagan"}
                </span>
              </label>
            </div>

            {/* Variatsiyalar */}
            <div className="sm:col-span-2 bg-slate-50/50 border border-slate-200 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">Mahsulot variatsiyalari (Ixtiyoriy)</h3>
                  <p className="text-xs text-slate-500">Bitta mahsulotning har xil hajmi yoki o'lchami bo'lsa kiriting (masalan, 300ml, 500ml)</p>
                </div>
                <button 
                  type="button" 
                  onClick={addVariant}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Qo'shish
                </button>
              </div>

              {variants.length > 0 ? (
                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div key={v.id} className="flex gap-3 items-center">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="Nomi (Masalan: 300ml)" 
                          value={v.name}
                          onChange={e => updateVariant(i, 'name', e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-xl py-2.5 px-3 outline-none text-sm" 
                        />
                      </div>
                      <div className="flex-1">
                        <input 
                          type="number" 
                          placeholder="Narxi (So'm)" 
                          value={v.price}
                          onChange={e => updateVariant(i, 'price', e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-primary-500 rounded-xl py-2.5 px-3 outline-none text-sm" 
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400 font-medium italic text-center py-4 border-2 border-dashed border-slate-200 rounded-xl">
                  Hozircha variatsiya qo'shilmagan
                </div>
              )}
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
                  className="mt-2 text-sm text-error font-bold hover:underline text-red-500"
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
