"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form State
  const [nameUz, setNameUz] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [parentId, setParentId] = useState("");
  const [icon, setIcon] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (category: any = null) => {
    setEditingCategory(category);
    if (category) {
      setNameUz(category.name_uz || category.name || "");
      setNameRu(category.name_ru || "");
      setParentId(category.parent_id || "");
      setIcon(category.icon || "");
      setImageFile(null);
    } else {
      setNameUz("");
      setNameRu("");
      setParentId("");
      setIcon("");
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async () => {
    if (!nameUz) {
      toast.error("Kategoriya nomini kiriting");
      return;
    }

    setIsSaving(true);
    try {
      let finalIconUrl = icon;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        
        const uploadJson = await uploadRes.json();
        if (!uploadJson.success) {
          throw new Error("Rasm yuklashda xatolik yuz berdi");
        }
        finalIconUrl = uploadJson.url;
      }

      const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      };

      const payload = {
        id: editingCategory ? editingCategory.id : generateSlug(nameUz),
        name_uz: nameUz,
        name_ru: nameRu,
        parent_id: parentId || null,
        icon: finalIconUrl
      };

      const endpoint = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = payload;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success(editingCategory ? "Kategoriya yangilandi" : "Kategoriya qo'shildi");
      fetchData();
      closeModal();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Rostdan ham ushbu kategoriyani o'chirmoqchimisiz? Agar bu kategoriyada mahsulotlar bo'lsa, xatolik yuz berishi mumkin.")) return;
    
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      
      toast.success("Kategoriya o'chirildi");
      fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  const filteredCategories = categories.filter(c => 
    (c.name_uz || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.name_ru || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Kategoriyalar</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Barcha asosiy va ichki kategoriyalar</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-extrabold text-white bg-primary-600 hover:bg-primary-700 px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-primary-500/10 cursor-pointer"
        >
          <Plus size={16} /> Yangi kategoriya
        </motion.button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 md:p-6">
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Kategoriya qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-xs font-semibold"
          />
        </div>

        {isLoading ? (
          <div className="p-12 text-center flex justify-center items-center gap-2.5 text-xs font-semibold text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
            Yuklanmoqda...
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
                  <th className="p-4 pl-6 rounded-tl-xl w-16">ID</th>
                  <th className="p-4">Nom (UZ)</th>
                  <th className="p-4">Nom (RU)</th>
                  <th className="p-4">Turi</th>
                  <th className="p-4 pr-6 text-right rounded-tr-xl">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors group">
                    <td className="p-4 pl-6 text-xs text-slate-400 font-bold">{cat.id}</td>
                    <td className="p-4 font-bold text-slate-800 text-sm">{cat.name_uz || cat.name}</td>
                    <td className="p-4 font-medium text-slate-600 text-sm">{cat.name_ru || "-"}</td>
                    <td className="p-4">
                      {cat.parent_id ? (
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          Ichki kategoriya ({categories.find(p => p.id === cat.parent_id)?.name_uz || cat.parent_id})
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 bg-primary-50 text-primary-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          Asosiy
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openModal(cat)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Kategoriyalar topilmadi
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-xl flex flex-col p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nomi (O'zbekcha) *</label>
                <input 
                  type="text" 
                  value={nameUz}
                  onChange={e => setNameUz(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Rasm (Asosiy sahifa uchun)</label>
                <div className="flex items-center gap-4">
                  {(icon || imageFile) && (
                    <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50">
                      <img src={imageFile ? URL.createObjectURL(imageFile) : icon} className="w-full h-full object-cover" alt="Category Image" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => e.target.files && setImageFile(e.target.files[0])}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl py-2.5 px-4 outline-none text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nomi (Ruscha)</label>
                <input 
                  type="text" 
                  value={nameRu}
                  onChange={e => setNameRu(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Asosiy Kategoriya (Ixtiyoriy)</label>
                <select 
                  value={parentId}
                  onChange={e => setParentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all"
                >
                  <option value="">Hech qaysi (O'zi Asosiy)</option>
                  {categories.filter(c => !c.parent_id && c.id !== editingCategory?.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name_uz || c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={closeModal} className="px-5 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                Bekor qilish
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
