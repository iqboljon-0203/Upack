"use client";
 
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import ProductCreateModal from "@/components/Admin/ProductCreateModal";
import { toast } from "sonner";
import Image from "next/image";
 
export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
 
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*')
      ]);
 
      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
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
 
  const handleDelete = async (id: number) => {
    if (!confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.from('products').delete().eq('id', id);
      
      if (error) throw error;
      
      toast.success("Mahsulot o'chirildi");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };
 
  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
 
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
 
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  return (
    <div className="flex flex-col gap-6">
      
      <ProductCreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        initialData={editingProduct}
        categories={categories}
      />
 
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Mahsulotlar</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Ombordagi barcha mahsulotlarni boshqarish</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-extrabold text-white bg-primary-600 hover:bg-primary-700 px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-primary-500/10 cursor-pointer animate-none"
        >
          <Plus size={16} /> Yangi mahsulot
        </motion.button>
      </div>
 
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 md:p-6">
        <div className="relative max-w-md mb-6">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Mahsulot qidirish..."
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
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Mobile Layout: Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 hover:shadow-sm transition-all relative">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50/30 shrink-0">
                    {product.image_url ? (
                      <Image src={product.image_url} alt={product.name} fill className="object-contain p-1.5" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 justify-between py-0.5">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h4>
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded mt-1.5">
                        {(() => {
                          const cat = categories.find(c => c.id === product.category_id);
                          if (!cat) return 'Noma\'lum';
                          const name = cat.name_uz || cat.name || cat.id;
                          return cat.parent_id ? `${categories.find(p => p.id === cat.parent_id)?.name_uz || ''} > ${name}` : name;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-50">
                      <span className="text-xs font-black text-slate-950">{product.price.toLocaleString('ru-RU')} so'm</span>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Desktop Layout: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
                    <th className="p-4 pl-6 rounded-tl-xl">Rasm</th>
                    <th className="p-4">Nomi</th>
                    <th className="p-4">Kategoriya</th>
                    <th className="p-4">Narxi</th>
                    <th className="p-4 pr-6 text-right rounded-tr-xl">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors group">
                      <td className="p-4 pl-6">
                        {product.image_url ? (
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-100 bg-white">
                            <Image src={product.image_url} alt={product.name} fill className="object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-800 text-sm">{product.name}</td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
                          {(() => {
                            const cat = categories.find(c => c.id === product.category_id);
                            if (!cat) return 'Noma\'lum';
                            const name = cat.name_uz || cat.name || cat.id;
                            if (cat.parent_id) {
                              const parent = categories.find(p => p.id === cat.parent_id);
                              const parentName = parent ? (parent.name_uz || parent.name) : '';
                              return parentName ? `${parentName} > ${name}` : name;
                            }
                            return name;
                          })()}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-950 text-sm">{product.price.toLocaleString('ru-RU')} so'm</td>
                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
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
          </>
        ) : (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Mahsulotlar topilmadi
          </div>
        )}
      </div>
    </div>
  );
}
