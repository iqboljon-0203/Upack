"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Bell, Menu, X, HelpCircle, MessageSquare, PhoneCall, Layers, RefreshCw, Grid, Info, Truck, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login" || pathname === "/login" || pathname.endsWith("/login");

  if (isLoginPage) {
    return <>{children}</>;
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <Link href="/admin" className="flex items-center gap-2">
          <div 
            className="w-10 h-10 bg-primary-600 shrink-0"
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
          <span className="text-2xl font-extrabold tracking-tight leading-none">UPack Admin</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex flex-col gap-1 flex-1 py-6 px-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">Boshqaruv paneli</p>
        {[
          { href: "/admin", icon: LayoutDashboard, label: "Dashboard", active: pathname === "/admin" || pathname === "/" },
          { href: "/admin/orders", icon: ShoppingBag, label: "Buyurtmalar", active: pathname.startsWith("/admin/orders") || pathname.startsWith("/orders") },
          { href: "/admin/products", icon: Package, label: "Mahsulotlar", active: pathname.startsWith("/admin/products") || pathname.startsWith("/products") }
        ].map((item, idx) => (
          <Link key={idx} href={item.href} onClick={() => setIsSidebarOpen(false)}>
            <motion.div 
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-bold text-sm ${
                item.active ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </motion.div>
          </Link>
        ))}

        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4 mb-2 px-3">Sayt Kontenti</p>
        {[
          { href: "/admin/content/hero", icon: LayoutDashboard, label: "Bosh qism (Hero)", active: pathname.includes("/content/hero") },
          { href: "/admin/content/features", icon: Package, label: "Afzalliklar", active: pathname.includes("/content/features") },
          { href: "/admin/content/steps", icon: ShoppingBag, label: "Qadamlar", active: pathname.includes("/content/steps") },
          { href: "/admin/content/brands", icon: Settings, label: "Brendlar", active: pathname.includes("/content/brands") },
          { href: "/admin/content/reorder", icon: RefreshCw, label: "Qayta buyurtma", active: pathname.includes("/content/reorder") },
          { href: "/admin/content/categories", icon: Grid, label: "Kategoriyalar", active: pathname.includes("/content/categories") },
          { href: "/admin/content/faq", icon: HelpCircle, label: "FAQ (Savollar)", active: pathname.includes("/content/faq") },
          { href: "/admin/content/cta", icon: PhoneCall, label: "Namuna (CTA)", active: pathname.includes("/content/cta") },
          { href: "/admin/content/reviews", icon: MessageSquare, label: "Mijozlar fikrlari", active: pathname.includes("/content/reviews") },
          { href: "/admin/content/about", icon: Info, label: "Biz haqimizda", active: pathname.includes("/content/about") },
          { href: "/admin/content/delivery", icon: Truck, label: "Yetkazib berish", active: pathname.includes("/content/delivery") },
          { href: "/admin/content/privacy", icon: ShieldCheck, label: "Maxfiylik", active: pathname.includes("/content/privacy") },
          { href: "/admin/content/footer", icon: Layers, label: "Sayt tagligi (Footer)", active: pathname.includes("/content/footer") }
        ].map((item, idx) => (
          <Link key={idx} href={item.href} onClick={() => setIsSidebarOpen(false)}>
            <motion.div 
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-bold text-sm ${
                item.active ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200 flex flex-col gap-1">
        <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)}>
          <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors font-bold text-sm">
            <Settings size={20} />
            Sozlamalar
          </motion.div>
        </Link>
        <motion.div 
          whileHover={{ x: 4 }} 
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 hover:text-error transition-colors font-bold text-sm cursor-pointer mt-1"
        >
          <LogOut size={20} />
          Chiqish
        </motion.div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans relative">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-50 border-r border-slate-200 text-slate-900 flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/50 z-40"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-white text-slate-900 flex flex-col z-50 shadow-2xl overflow-y-auto"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-900">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
            </motion.button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">Admin User</p>
                <p className="text-xs font-medium text-slate-500">Menejer</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 text-primary-600 font-bold rounded-full flex items-center justify-center shrink-0">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>

    </div>
  );
}
