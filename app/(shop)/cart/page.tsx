"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function CartPage() {
  const { language, t } = useLanguage();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    useCartStore.getState().fetchCartLimits();
  }, []);

  if (!mounted) {
    return <div className="container mx-auto px-6 py-12 min-h-[60vh]">Loading...</div>;
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/katalog" className="text-slate-400 hover:text-primary-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t('nav.cart')}</h1>
        </div>
        {items.length > 0 && (
          <button 
            onClick={clearCart}
            className="text-error hover:bg-error/10 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
          >
            <Trash2 size={16} /> {language === 'uz' ? 'Savatni tozalash' : 'Очистить корзину'}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <ShoppingBag size={48} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{language === 'uz' ? "Savatingiz bo'sh" : "Ваша корзина пуста"}</h2>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                {language === 'uz' ? "Hozircha savatga hech qanday mahsulot qo'shmadingiz. Katalogga o'tib kerakli mahsulotlarni tanlashingiz mumkin." : "Пока вы не добавили товары в корзину. Вы можете перейти в каталог и выбрать необходимые товары."}
              </p>
              <Link 
                href="/katalog"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-primary-600/20 transition-all"
              >
                {language === 'uz' ? "Katalogga o'tish" : "Перейти в каталог"}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row gap-6 items-center"
                  >
                    <Link href={`/mahsulot/${item.id}`} className="w-24 h-24 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558000143-a61254bf5228?q=80&w=800&auto=format&fit=crop' }}
                      />
                    </Link>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <Link href={`/mahsulot/${item.id}`}>
                        <h3 className="font-bold text-slate-900 mb-1 hover:text-primary-600 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="text-primary-600 font-bold">
                        {item.price.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg h-10">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - (item.step || 1))}
                          disabled={item.quantity <= (item.minOrderQuantity || 1)}
                          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="w-12 text-center font-bold text-slate-900 select-none text-sm">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + (item.step || 1))}
                          className="w-10 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="w-28 text-right font-black text-slate-900">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{language === 'uz' ? 'Buyurtma xulosasi' : 'Итоговый заказ'}</h3>
            
            <div className="flex flex-col gap-4 mb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>{language === 'uz' ? 'Mahsulotlar' : 'Товары'} ({items.length})</span>
                <span className="font-semibold text-slate-900">{totalPrice.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{language === 'uz' ? 'Yetkazib berish' : 'Доставка'}</span>
                <span className="font-semibold text-slate-900">0 {language === 'uz' ? "so'm" : 'сум'}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 mb-8 flex justify-between items-center">
              <span className="font-bold text-slate-900">{language === 'uz' ? 'Jami:' : 'Итого:'}</span>
              <span className="text-2xl font-black text-primary-600">{totalPrice.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</span>
            </div>

            {items.length > 0 ? (
              <Link 
                href="/checkout"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-600/20 font-bold py-4 rounded-xl transition-colors block text-center"
              >
                {language === 'uz' ? 'Rasmiylashtirish' : 'Оформить заказ'}
              </Link>
            ) : (
              <button 
                disabled
                className="w-full bg-slate-100 text-slate-400 cursor-not-allowed font-bold py-4 rounded-xl"
              >
                {language === 'uz' ? 'Rasmiylashtirish' : 'Оформить заказ'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
