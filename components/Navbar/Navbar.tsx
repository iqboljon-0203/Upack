"use client";

import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, Bell, Globe, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import MobileMenu from './MobileMenu';
import productsData from "@/telegram_products.json";
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(console.error);
  }, []);

  const { items: cartItems } = useCartStore();
  const cartItemCount = mounted ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  
  const { items: favItems } = useFavoritesStore();
  const favItemCount = mounted ? favItems.length : 0;

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : productsData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-1">
          <div 
            className="w-16 h-16 bg-primary-600 shrink-0"
            style={{
              WebkitMaskImage: 'url(/logo.svg)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: 'url(/logo.svg)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
            aria-label="UPack Logo"
          />
          <span className="text-3xl font-extrabold tracking-tighter text-primary-600 hidden sm:block leading-none">UPack</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={language === 'uz' ? "Qidirish..." : "Поиск..."} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = `/katalog?search=${encodeURIComponent(e.currentTarget.value)}`;
              }
            }}
            className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-300"
          />
          <AnimatePresence>
            {isSearchFocused && searchQuery.trim() !== "" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
              >
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id}
                        href={`/mahsulot/${product.id}`}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                          <span className="text-xs font-bold text-primary-600">{product.price.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : "сум"}</span>
                        </div>
                      </Link>
                    ))}
                    <Link 
                      href={`/katalog?search=${encodeURIComponent(searchQuery)}`}
                      className="block text-center p-3 text-sm font-bold text-primary-600 hover:bg-primary-50 transition-colors border-t border-slate-100"
                    >
                      {language === 'uz' ? "Barcha natijalarni ko'rish" : "Посмотреть все результаты"}
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    {language === 'uz' ? `"${searchQuery}" bo'yicha hech narsa topilmadi` : `Ничего не найдено по запросу "${searchQuery}"`}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-primary-600 transition-colors">{t('nav.home')}</Link>
          <Link href="/katalog" className="hover:text-primary-600 transition-colors">{t('nav.catalog')}</Link>
          <a href="https://t.me/upackuz" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">{language === 'uz' ? 'Kanalimiz' : 'Наш канал'}</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 p-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm"
            >
              <img 
                src={language === 'uz' ? 'https://flagcdn.com/uz.svg' : 'https://flagcdn.com/ru.svg'} 
                alt={language}
                className="w-5 h-5 rounded-full object-cover shadow-sm border border-slate-200"
              />
              <span className="hidden sm:inline">{language === 'uz' ? 'UZ' : 'RU'}</span>
            </button>
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-2 w-32"
                >
                  <button onClick={() => { setLanguage('uz'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors ${language === 'uz' ? 'text-primary-600' : 'text-slate-700'}`}>
                    <img src="https://flagcdn.com/uz.svg" alt="UZ" className="w-5 h-5 rounded-full object-cover shadow-sm border border-slate-200" />
                    O'zbek
                  </button>
                  <button onClick={() => { setLanguage('ru'); setShowLangMenu(false); }} className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors ${language === 'ru' ? 'text-primary-600' : 'text-slate-700'}`}>
                    <img src="https://flagcdn.com/ru.svg" alt="RU" className="w-5 h-5 rounded-full object-cover shadow-sm border border-slate-200" />
                    Русский
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/favorites" className="relative group">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 text-slate-500 group-hover:text-error transition-colors">
              <Heart size={20} />
              {favItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-error text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white transform translate-x-1/4 -translate-y-1/4">
                  {favItemCount}
                </span>
              )}
            </motion.div>
          </Link>
          <Link href="/cart">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-2 py-2">
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">{t('nav.cart')}</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </motion.div>
          </Link>

          {mounted && user ? (
            <Link href="/profile">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className="hidden lg:flex items-center gap-2 ml-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                <User size={16} className="text-primary-600" />
                <span>{user.firstName || 'Profil'}</span>
              </motion.button>
            </Link>
          ) : (
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className="hidden lg:block ml-2 bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-600/20 px-5 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                {t('nav.login')}
              </motion.button>
            </Link>
          )}
          <MobileMenu />
        </div>

      </div>
    </motion.nav>
  );
}
