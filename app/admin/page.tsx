"use client";

import { Download, Edit, Trash2, Plus, Eye } from "lucide-react";
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
          setRecentOrders(sortedOrders.slice(0, 5));
        }

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      
      <ProductCreateModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)}
        categories={categories}
        onSuccess={() => {}}
      />

      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: "Jami Sotuvlar", value: `${stats.totalSales.toLocaleString('ru-RU')} so'm`, trend: "Real time", positive: true },
          { label: "Yangi Buyurtmalar", value: `${stats.newOrdersCount} ta`, trend: "Kutilyapti", positive: true },
          { label: "Faol Mijozlar", value: `${stats.activeClients} ta`, trend: "Buyurtmachilar", positive: true }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={fadeUp} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col hover:border-slate-300 transition-all duration-300">
            <h3 className="text-sm font-bold text-slate-500 mb-2">{stat.label}</h3>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">So'nggi buyurtmalar</h3>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsProductModalOpen(true)}
              className="flex items-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-primary-600/20"
            >
              <Plus size={16} /> Yangi mahsulot
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <Download size={16} /> Export Report
            </motion.button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-100">ID</th>
                <th className="p-4 border-b border-slate-100">Mijoz</th>
                <th className="p-4 border-b border-slate-100">Sana</th>
                <th className="p-4 border-b border-slate-100">Summa</th>
                <th className="p-4 border-b border-slate-100">Holat</th>
                <th className="p-4 border-b border-slate-100 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? recentOrders.map((order: any, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  key={order.id} 
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="p-4 font-bold text-slate-900">#{order.id.slice(0,8)}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{order.shipping_address || 'Kiritilmagan'}</div>
                  </td>
                  <td className="p-4 text-slate-500 font-medium">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
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
                       order.status === 'cancelled' ? 'Bekor qilindi' : order.status}
                    </span>
                  </td>
                  <td className="p-4 font-black text-slate-900">{order.total_price?.toLocaleString('ru-RU')} so'm</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/admin/orders/${order.id}`);
                        }}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
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
