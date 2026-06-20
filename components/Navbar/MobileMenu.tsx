"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Menu, X, ArrowRight, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function MobileMenu() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
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
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // Custom spring-like easing
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  const links = [
    { href: "/", label: language === 'uz' ? "Bosh sahifa" : "Главная" },
    { href: "/katalog", label: language === 'uz' ? "Katalog" : "Каталог" },
    { href: "https://t.me/upackuz", label: language === 'uz' ? "Kanalimiz" : "Наш канал", isExternal: true },
  ];

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[100] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="container mx-auto px-6 h-20 flex items-center justify-between shrink-0">
            <Link href="/" className="flex items-center gap-1" onClick={() => setIsOpen(false)}>
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
              />
              <span className="text-3xl font-extrabold tracking-tighter text-primary-600 leading-none">UPack</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-600 hover:text-error bg-slate-100 hover:bg-error/10 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 container mx-auto px-6 py-8 flex flex-col justify-center gap-6 overflow-y-auto">
            {links.map((link) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className="group flex items-center justify-between text-3xl font-black text-slate-900 hover:text-primary-600 transition-colors"
                >
                  <span>{link.label}</span>
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-primary-50 flex items-center justify-center transition-colors">
                    <ArrowRight size={24} className="text-slate-400 group-hover:text-primary-600 transition-colors transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Footer Auth Buttons */}
          <motion.div 
            variants={itemVariants}
            className="container mx-auto px-6 pb-12 pt-6 shrink-0 flex flex-col sm:flex-row gap-4"
          >
            {mounted && user ? (
              <Link
                href="/profile"
                className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/20 text-lg"
              >
                <LogIn size={20} />
                {language === 'uz' ? 'Profilga o\'tish' : 'Перейти в профиль'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-lg"
                >
                  <LogIn size={20} />
                  {language === 'uz' ? 'Tizimga kirish' : 'Войти'}
                </Link>
                <Link
                  href="/register"
                  className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/20 text-lg"
                >
                  <UserPlus size={20} />
                  {language === 'uz' ? "Ro'yxatdan o'tish" : 'Регистрация'}
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-600 hover:text-primary-600 transition-colors"
        aria-label={language === 'uz' ? "Menyuni ochish" : "Открыть меню"}
      >
        <Menu size={24} />
      </button>

      {mounted && createPortal(menuContent, document.body)}
    </div>
  );
}
