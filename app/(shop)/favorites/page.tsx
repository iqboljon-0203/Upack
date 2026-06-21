"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import productsData from "@/telegram_products.json";
import { useLanguage } from "@/context/LanguageContext";

export default function FavoritesPage() {
  const { language } = useLanguage();
  const cleanName = (name: string) => name.replace(/&#39;/g, "'").replace(/&apos;/g, "'");
  const { items, toggleFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="container mx-auto px-6 py-12 min-h-[60vh]">{language === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...'}</div>;
  }

  const handleAddToCart = (product: any) => {
    const fullProduct = productsData.find(p => p.id === product.id);
    if (fullProduct) {
      addItem({
        id: fullProduct.id,
        name: fullProduct.name,
        price: fullProduct.price,
        image: fullProduct.image,
        minOrderQuantity: fullProduct.minOrder,
        quantity: fullProduct.minOrder
      });
      toast.success(language === 'uz' ? `${fullProduct.name} savatga qo'shildi!` : `${fullProduct.name} добавлено в корзину!`);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-[70vh]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/katalog" className="text-slate-400 hover:text-primary-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{language === 'uz' ? 'Saralanganlar' : 'Избранное'}</h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Heart size={48} className="text-error" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{language === 'uz' ? "Sevimli mahsulotlar yo'q" : "Нет избранных товаров"}</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            {language === 'uz' ? "Siz hali hech qanday mahsulotni saralanganlarga qo'shmadingiz. Katalogdagi yurakcha tugmasini bosib mahsulotlarni saqlab qo'yishingiz mumkin." : "Вы еще не добавили ни одного товара в избранное. Вы можете сохранить товары, нажав на кнопку с сердечком в каталоге."}
          </p>
          <Link 
            href="/katalog"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-primary-600/20 transition-all"
          >
            {language === 'uz' ? "Katalogga o'tish" : "Перейти в каталог"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group flex flex-col"
              >
                <div className="w-full h-48 bg-slate-50 rounded-xl mb-4 overflow-hidden relative">
                  <Link href={`/mahsulot/${item.id}`}>
                    <img 
                      src={item.image} 
                      alt={cleanName(item.name)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558000143-a61254bf5228?q=80&w=800&auto=format&fit=crop' }}
                    />
                  </Link>
                  <button 
                    onClick={() => toggleFavorite(item)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-error shadow-sm transition-colors"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                
                <Link href={`/mahsulot/${item.id}`}>
                  <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                    {cleanName(item.name)}
                  </h3>
                </Link>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="font-black text-lg text-primary-600">
                    {item.price.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-10 h-10 bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
