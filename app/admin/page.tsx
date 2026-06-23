"use client";
 
import { Download, Plus, Eye, DollarSign, ShoppingBag, Users, ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCreateModal from "@/components/Admin/ProductCreateModal";
 
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
 
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
 
export default function AdminDashboard() {
  const router = useRouter();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    newOrdersCount: 0,
    activeClients: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
 
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { supabase } = await import('@/lib/supabase');
        
        // Fetch categories for modal
        const { data: catsData } = await supabase.from('categories').select('*');
        if (catsData) setCategories(catsData);
 
        // Fetch all orders for total sales and new orders count
        const ordersRes = await fetch('/api/admin/orders');
        const ordersJson = await ordersRes.json();
        
        if (ordersJson.success && ordersJson.data) {
          const ordersData = ordersJson.data;
          const totalSales = ordersData.reduce((sum: number, order: any) => sum + (order.total_price || 0), 0);
          const newOrders = ordersData.filter((o: any) => o.status === 'pending' || o.status === 'new').length;
          
          // Get unique users who made an order
          const uniqueUsers = new Set(ordersData.map((o: any) => o.user_id)).size;
 
          setStats({
            totalSales,
            newOrdersCount: newOrders,
            activeClients: uniqueUsers
          });
 
          // Sort by created_at desc for recent orders
          const sortedOrders = [...ordersData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setAllOrders(sortedOrders);
          setRecentOrders(sortedOrders.slice(0, 5));
        }
 
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    }
 
    fetchDashboardData();
  }, []);
 
  const handleExportCSV = () => {
    if (allOrders.length === 0) {
      alert("Eksport qilish uchun buyurtmalar yo'q");
      return;
    }

    const headers = ["ID", "Sana", "Mijoz (Telefon)", "Manzil", "Holat", "Jami Summa", "To'lov Usuli"];
    const rows = allOrders.map(o => [
      o.id,
      new Date(o.created_at).toLocaleString('ru-RU').replace(',', ''),
      `${o.customer_name || 'Noma\'lum'} (${o.customer_phone || ''})`,
      `"${(o.shipping_address || '').replace(/"/g, '""')}"`,
      o.status,
      o.total_price || 0,
      o.payment_method || ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `buyurtmalar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      
      <ProductCreateModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)}
        categories={categories}
        onSuccess={() => {}}
      />
 
      {/* Stats Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
      >
        {[
          { 
            label: "Jami Sotuvlar", 
            value: `${stats.totalSales.toLocaleString('ru-RU')} so'm`, 
            trend: "Umumiy tushum", 
            icon: DollarSign,
            color: "from-emerald-500 to-teal-600",
            bgLight: "bg-emerald-50 text-emerald-600"
          },
          { 
            label: "Yangi Buyurtmalar", 
            value: `${stats.newOrdersCount} ta`, 
            trend: "Kutilyapti", 
            icon: ShoppingBag,
            color: "from-blue-500 to-indigo-600",
            bgLight: "bg-blue-50 text-blue-600"
          },
          { 
            label: "Faol Mijozlar", 
            value: `${stats.activeClients} ta`, 
            trend: "Ro'yxatdan o'tganlar", 
            icon: Users,
            color: "from-purple-500 to-pink-600",
            bgLight: "bg-purple-50 text-purple-600"
          }
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={fadeUp} 
            className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between group"
          >
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">{stat.label}</span>
              <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-2 break-all">{stat.value}</span>
              <span className="text-[11px] font-bold text-slate-500">{stat.trend}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgLight} transition-all duration-300 group-hover:scale-105 shadow-sm`}>
              <stat.icon size={22} className="stroke-[2.5]" />
            </div>
          </motion.div>
        ))}
      </motion.div>
 
      {/* Recent Orders Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">So'nggi buyurtmalar</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1">Yaqinda amalga oshirilgan xaridlar ro'yxati</p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProductModalOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-extrabold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-primary-500/10 cursor-pointer"
            >
              <Plus size={16} /> Yangi mahsulot
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <Download size={16} /> Export
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Layout (Cards) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {recentOrders.length > 0 ? (
            recentOrders.map((order: any) => (
              <div 
                key={order.id} 
                className="p-5 flex flex-col gap-3 hover:bg-slate-50/50 active:bg-slate-50 transition-colors"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900 text-sm">#{order.id.slice(0, 8)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                    order.status === 'pending' || order.status === 'new' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'assembled' ? 'bg-indigo-100 text-indigo-700' :
                    order.status === 'shipped' ? 'bg-cyan-100 text-cyan-700' :
                    order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {order.status === 'pending' || order.status === 'new' ? 'Yangi' :
                     order.status === 'processing' ? 'Jarayonda' :
                     order.status === 'assembled' ? 'Yig\'ildi' :
                     order.status === 'shipped' ? 'Chiqarildi' :
                     order.status === 'completed' ? 'Bajarildi' :
                     order.status === 'cancelled' ? 'Bekor qilingan' : order.status}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{order.shipping_address || 'Manzil kiritilmagan'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400 shrink-0" />
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
 
                <div className="flex justify-between items-center pt-2 border-t border-slate-100/60 mt-1">
                  <span className="text-sm font-black text-slate-900">{order.total_price?.toLocaleString('ru-RU')} so'm</span>
                  <span className="text-xs font-bold text-primary-600 flex items-center gap-0.5">
                    Batafsil <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">
              Hozircha buyurtmalar yo'q
            </div>
          )}
        </div>
 
        {/* Desktop Layout (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Mijoz (Manzil)</th>
                <th className="p-4">Sana</th>
                <th className="p-4">Holat</th>
                <th className="p-4">Summa</th>
                <th className="p-4 pr-6 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map((order: any, idx) => (
                <tr 
                  key={order.id} 
                  className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="p-4 pl-6 font-bold text-slate-900 text-sm">#{order.id.slice(0, 8)}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800 text-sm line-clamp-1 max-w-[240px]">{order.shipping_address || 'Kiritilmagan'}</div>
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                      order.status === 'pending' || order.status === 'new' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10' :
                      order.status === 'processing' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10' :
                      order.status === 'assembled' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10' :
                      order.status === 'shipped' ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10' :
                      order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                      'bg-slate-50 text-slate-700 ring-1 ring-slate-600/10'
                    }`}>
                      {order.status === 'pending' || order.status === 'new' ? 'Yangi' :
                       order.status === 'processing' ? 'Jarayonda' :
                       order.status === 'assembled' ? 'Yig\'ildi' :
                       order.status === 'shipped' ? 'Chiqarildi' :
                       order.status === 'completed' ? 'Bajarildi' :
                       order.status === 'cancelled' ? 'Bekor qilindi' : order.status}
                    </span>
                  </td>
                  <td className="p-4 font-black text-slate-900 text-sm">{order.total_price?.toLocaleString('ru-RU')} so'm</td>
                  <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors inline-flex"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-bold text-slate-400">
                    Hozircha buyurtmalar yo'q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
 
    </div>
  );
}
