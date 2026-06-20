"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Filter, Minus, Plus, Heart, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "all", labelUz: "Barcha mahsulotlar", labelRu: "Все товары" },
  { id: "bir-martalik", labelUz: "Bir martalik idishlar", labelRu: "Одноразовая посуда" },
  { id: "qadoqlash", labelUz: "Qadoqlash vositalari", labelRu: "Упаковочные материалы" },
  { id: "ximiya", labelUz: "Ximiya va tozalash", labelRu: "Бытовая химия и уборка" },
];

export default function KatalogPage() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(12);
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const [productsData, setProductsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        setProductsData(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(language === 'uz' ? "Mahsulotlarni yuklashda xatolik yuz berdi" : "Ошибка при загрузке товаров");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [language]);

  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, searchQuery, sortOrder]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const q = params.get('search');
      if (cat) setActiveCategory(cat);
      if (q) setSearchQuery(q);
    }
  }, []);

  const filteredProducts = productsData.filter((product) => {
    const matchCategory = activeCategory === "all" || product.category_id === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  }).sort((a, b) => {
    if (sortOrder === "price_asc") return a.price - b.price;
    if (sortOrder === "price_desc") return b.price - a.price;
    return 0; // newest
  });

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium mb-6">
        <Link href="/" className="hover:text-primary-600 transition-colors">{t('nav.home')}</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900">{t('nav.catalog')}</span>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">{t('nav.catalog')}</h1>
          <p className="text-slate-500">{language === 'uz' ? 'Biznesingiz uchun eng yaxshi qadoqlash vositalari.' : 'Лучшие упаковочные материалы для вашего бизнеса.'}</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={language === 'uz' ? "Mahsulot qidirish..." : "Поиск товаров..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all"
            />
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all cursor-pointer text-slate-700 min-w-[180px]"
          >
            <option value="newest">{language === 'uz' ? 'Eng yangilari' : 'Сначала новые'}</option>
            <option value="price_asc">{language === 'uz' ? 'Arzonlari oldin' : 'Сначала дешевые'}</option>
            <option value="price_desc">{language === 'uz' ? 'Qimmatlari oldin' : 'Сначала дорогие'}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-6">
              <Filter size={20} />
              {language === 'uz' ? 'Kategoriyalar' : 'Категории'}
            </div>
            <div className="flex flex-col gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {language === 'uz' ? cat.labelUz : cat.labelRu}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 size={48} className="animate-spin mb-4 text-primary-500" />
              <p>{language === 'uz' ? 'Mahsulotlar yuklanmoqda...' : 'Загрузка товаров...'}</p>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p>{language === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {visibleProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
              >
                {(() => {
                  const cartItem = items.find(item => item.id === product.id);
                  return (
                    <>
                      <div className="w-full h-36 sm:h-48 bg-slate-100 shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                        <Link href={`/mahsulot/${product.id}`} className="w-full h-full block">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558000143-a61254bf5228?q=80&w=800&auto=format&fit=crop' }}
                          />
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(product);
                          }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-error shadow-sm transition-colors z-10"
                        >
                          <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} className={isFavorite(product.id) ? "text-error" : ""} />
                        </button>
                      </div>
                      <div className="p-3 sm:p-5 flex flex-col flex-1">
                        <Link href={`/mahsulot/${product.id}`}>
                          <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors text-sm sm:text-base">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500 mb-4 hidden sm:line-clamp-2">
                          {product.full_desc}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <div className="text-xs text-slate-400 mb-1">{language === 'uz' ? 'Narxi' : 'Цена'} ({product.unit})</div>
                            <div className="font-black text-lg text-primary-600">
                              {product.price.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}
                            </div>
                          </div>
                          
                          {cartItem ? (
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-10 overflow-hidden shrink-0">
                              <button 
                                onClick={() => {
                                  if (cartItem.quantity <= 1) {
                                    removeItem(product.id);
                                  } else {
                                    updateQuantity(product.id, cartItem.quantity - 1);
                                  }
                                }}
                                className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <div className="px-2 text-center font-bold text-slate-900 select-none text-sm min-w-[2.5rem]">
                                {cartItem.quantity}
                              </div>
                              <button 
                                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                                className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          ) : (
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  minOrderQuantity: product.minOrder
                                });
                                toast.success(language === 'uz' ? `${product.name} savatga qo'shildi!` : `${product.name} добавлено в корзину!`);
                              }}
                              className="w-10 h-10 bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white rounded-full flex items-center justify-center transition-colors shrink-0"
                              title={language === 'uz' ? "Savatga qo'shish" : "Добавить в корзину"}
                            >
                              <ShoppingCart size={18} />
                            </motion.button>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                          <span>{language === 'uz' ? 'Min. buyurtma:' : 'Мин. заказ:'} {product.minOrder} {product.unit}</span>
                          <span className={product.inStock ? "text-success" : "text-error"}>
                            {product.inStock 
                              ? (language === 'uz' ? "Sotuvda bor" : "В наличии") 
                              : (language === 'uz' ? "Tugagan" : "Нет в наличии")}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ))}
            </div>
          )}
          
          {!loading && visibleCount < filteredProducts.length && (
            <div className="flex justify-center mt-12">
              <button 
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="bg-white border-2 border-slate-200 text-slate-700 hover:border-primary-600 hover:text-primary-600 font-bold py-3 px-8 rounded-xl transition-all"
              >
                {language === 'uz' ? "Yana ko'rsatish" : "Показать еще"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
