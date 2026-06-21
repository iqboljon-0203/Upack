"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  // Settings state
  const [globalLimit, setGlobalLimit] = useState(100);
  const [productLimits, setProductLimits] = useState<Record<string, number>>({});
  
  // Form state to add override
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customLimit, setCustomLimit] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products for override dropdown
        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        setProducts(prodData || []);

        // Fetch existing settings
        const settingsRes = await fetch('/api/admin/content?id=cart_limits');
        const settingsData = await settingsRes.json();
        
        if (settingsData && settingsData.data) {
          setGlobalLimit(settingsData.data.globalLimit || 100);
          setProductLimits(settingsData.data.productLimits || {});
        }
      } catch (err) {
        console.error("Error loading settings data:", err);
        toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'cart_limits',
          data: {
            globalLimit,
            productLimits
          }
        })
      });
      
      if (res.ok) {
        toast.success("Sozlamalar muvaffaqiyatli saqlandi!");
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } catch (err) {
      console.error(err);
      toast.error("Tarmoq xatosi");
    } finally {
      setIsSaving(false);
    }
  };

  const addOverride = () => {
    if (!selectedProductId || !customLimit) {
      toast.error("Iltimos, mahsulot va uning limitini tanlang");
      return;
    }
    const limitNum = parseInt(customLimit);
    if (isNaN(limitNum) || limitNum < 1) {
      toast.error("Limit musbat son bo'lishi kerak");
      return;
    }

    setProductLimits(prev => ({
      ...prev,
      [selectedProductId]: limitNum
    }));
    
    // Clear override inputs
    setSelectedProductId("");
    setCustomLimit("");
    toast.success("Cheklov qo'shildi! Saqlash tugmasini bosishni unutmang.");
  };

  const removeOverride = (id: string) => {
    setProductLimits(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    toast.info("Cheklov olib tashlandi. Saqlashni unutmang.");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-slate-400">
        <Loader2 className="animate-spin text-primary-500 mr-2" size={32} />
        Yuklanmoqda...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Sozlamalar</h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">Savat limitlari va umumiy xavfsizlik sozlamalari</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-600/20"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Saqlash
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Global limits card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-3">
            <Settings size={20} className="text-primary-600" />
            Umumiy cheklov
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Savatning standart limiti</label>
            <input 
              type="number" 
              value={globalLimit} 
              onChange={e => setGlobalLimit(Math.max(1, parseInt(e.target.value) || 100))}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all" 
              placeholder="100"
            />
            <p className="text-xs text-slate-400 mt-2">Agar maxsus cheklov o'rnatilmagan bo'lsa, har bir mahsulot uchun shu limit amal qiladi.</p>
          </div>
        </div>

        {/* Custom overrides card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm md:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-3">
            <ShieldCheck size={20} className="text-primary-600" />
            Mahsulotlar uchun maxsus cheklovlar
          </div>

          {/* Add Override Form */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mahsulotni tanlang</label>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500 transition-all"
              >
                <option value="">Mahsulotni tanlang</option>
                {products
                  .filter(p => productLimits[p.id] === undefined)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))
                }
              </select>
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Limit</label>
              <input
                type="number"
                value={customLimit}
                onChange={e => setCustomLimit(e.target.value)}
                placeholder="50"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500 transition-all"
              />
            </div>
            <button
              onClick={addOverride}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 h-[38px] transition-colors"
            >
              <Plus size={16} /> Qo'shish
            </button>
          </div>

          {/* Overrides Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-3 border-b border-slate-100">Mahsulot</th>
                  <th className="p-3 border-b border-slate-100">Maxsus Limit</th>
                  <th className="p-3 border-b border-slate-100 text-right">O'chirish</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(productLimits).length > 0 ? (
                  Object.keys(productLimits).map((id) => {
                    const product = products.find(p => p.id === id);
                    return (
                      <tr key={id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-700">
                          {product ? product.name : `ID: ${id}`}
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={productLimits[id]}
                            onChange={e => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              setProductLimits(prev => ({ ...prev, [id]: val }));
                            }}
                            className="w-20 border border-slate-200 rounded px-2 py-1 text-sm font-semibold"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => removeOverride(id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-xs text-slate-400 font-medium">
                      Hozircha maxsus limitlar o'rnatilmagan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
