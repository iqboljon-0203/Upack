"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Bell, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
 
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
        <Link href="/admin" className="flex items-center gap-3">
          <div 
            className="w-9 h-9 bg-primary-600 rounded-xl shrink-0 shadow-md shadow-primary-500/20"
            style={{
              WebkitMaskImage: 'url(/logo.svg)',
              WebkitMaskSize: '60%',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: 'url(/logo.svg)',
              maskSize: '60%',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
            aria-label="UPack Logo"
          />
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-primary-950 to-primary-700 bg-clip-text text-transparent">UPack Panel</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <X size={20} />
        </button>
      </div>
      
      <div className="flex flex-col gap-1 flex-1 py-6 px-4 overflow-y-auto min-h-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-3">Boshqaruv</p>
        {[
          { href: "/admin", icon: LayoutDashboard, label: "Dashboard", active: pathname === "/admin" || pathname === "/" },
          { href: "/admin/orders", icon: ShoppingBag, label: "Buyurtmalar", active: pathname.startsWith("/admin/orders") || pathname.startsWith("/orders") },
          { href: "/admin/products", icon: Package, label: "Mahsulotlar", active: pathname.startsWith("/admin/products") || pathname.startsWith("/products") },
          { href: "/admin/categories", icon: Package, label: "Kategoriyalar", active: pathname === "/admin/categories" }
        ].map((item, idx) => (
          <Link key={idx} href={item.href} onClick={() => setIsSidebarOpen(false)}>
            <motion.div 
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-250 font-bold text-sm ${
                item.active 
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/15' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </motion.div>
          </Link>
        ))}
 
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2 px-3 font-sans">Sayt Kontenti</p>
        
        <div className="pl-3 flex flex-col gap-0.5 border-l border-slate-200/60 ml-5 mt-1">
          {[
            { href: "/admin/content/hero", label: "Bosh qism (Hero)" },
            { href: "/admin/content/features", label: "Afzalliklar" },
            { href: "/admin/content/steps", label: "Qadamlar" },
            { href: "/admin/content/brands", label: "Brendlar" },
            { href: "/admin/content/reorder", label: "Qayta buyurtma" },
            { href: "/admin/content/faq", label: "FAQ (Savollar)" },
            { href: "/admin/content/cta", label: "Namuna (CTA)" },
            { href: "/admin/content/reviews", label: "Mijozlar fikrlari" },
            { href: "/admin/content/about", label: "Biz haqimizda" },
            { href: "/admin/content/delivery", label: "Yetkazib berish" },
            { href: "/admin/content/privacy", label: "Maxfiylik" },
            { href: "/admin/content/footer", label: "Sayt tagligi (Footer)" }
          ].map((item, idx) => {
            const active = pathname === item.href;
            return (
              <Link key={idx} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                <div 
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${
                    active 
                      ? 'text-primary-700 bg-primary-100/50 font-bold shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
 
      <div className="p-4 border-t border-slate-100 flex flex-col gap-1 bg-white shrink-0">
        <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)}>
          <motion.div 
            whileHover={{ x: 4 }} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors font-bold text-sm ${
              pathname === "/admin/settings" ? "bg-slate-100 text-slate-900" : ""
            }`}
          >
            <Settings size={18} />
            Sozlamalar
          </motion.div>
        </Link>
        <motion.div 
          whileHover={{ x: 4 }} 
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            window.location.href = '/admin/login';
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-bold text-sm cursor-pointer mt-1"
        >
          <LogOut size={18} />
          Chiqish
        </motion.div>
      </div>
    </div>
  );
 
  return (
    <div className="flex min-h-screen bg-slate-50/70 font-sans relative">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200/60 text-slate-900 flex-col shrink-0 sticky top-0 h-screen overflow-hidden">
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
              className="md:hidden fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-white text-slate-900 flex flex-col z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
 
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between sticky top-0 z-35">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-50 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2 capitalize">
              {pathname === "/admin" ? "Bosh sahifa" : pathname.split("/").pop()}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </motion.button>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">Admin User</p>
                <p className="text-[10px] font-semibold text-slate-400">Menejer</p>
              </div>
              <div className="w-8 h-8 bg-primary-100 text-primary-700 font-extrabold rounded-full flex items-center justify-center shrink-0 text-xs shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>
 
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
 
    </div>
  );
}
