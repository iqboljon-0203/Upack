"use client";

import { useState, useEffect } from "react";
import { Eye, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      } else {
        toast.error("Buyurtmalarni yuklashda xatolik");
      }
    } catch (err) {
      console.error(err);
      toast.error("Buyurtmalarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success("Status o'zgartirildi");
        fetchOrders();
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.shipping_address?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Buyurtmalar</h1>
          <p className="text-slate-500 mt-1">Barcha mijozlar xaridlari</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Manzil yoki ID bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm"
            />
          </div>
          
          <div className="relative min-w-[150px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter size={18} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-sm appearance-none"
            >
              <option value="all">Barcha holatlar</option>
              <option value="pending">Yangi (pending)</option>
              <option value="processing">Jarayonda</option>
              <option value="assembled">Yig'ildi</option>
              <option value="shipped">Chiqarildi</option>
              <option value="completed">Bajarildi</option>
              <option value="cancelled">Bekor qilindi</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-100 rounded-tl-lg">ID / Sana</th>
                <th className="p-4 border-b border-slate-100">Mijoz (Manzil)</th>
                <th className="p-4 border-b border-slate-100">Summa</th>
                <th className="p-4 border-b border-slate-100">Holati</th>
                <th className="p-4 border-b border-slate-100 text-right rounded-tr-lg">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2 text-slate-400">
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-primary-600 rounded-full animate-spin"></div>
                      Yuklanmoqda...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-900">#{order.id.slice(0,8)}</div>
                      <div className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString('ru-RU')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{order.shipping_address || 'Kiritilmagan'}</div>
                      <div className="text-xs text-slate-500">Mijoz ID: {order.user_id?.slice(0,6)}...</div>
                    </td>
                    <td className="p-4 font-black text-slate-900">{order.total_price?.toLocaleString('ru-RU')} so'm</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-md outline-none border border-transparent hover:border-slate-300 transition-colors cursor-pointer ${
                          order.status === 'pending' || order.status === 'new' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'assembled' ? 'bg-indigo-100 text-indigo-700' :
                          order.status === 'shipped' ? 'bg-cyan-100 text-cyan-700' :
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <option value="pending">Yangi</option>
                        <option value="processing">Jarayonda</option>
                        <option value="assembled">Yig'ildi</option>
                        <option value="shipped">Chiqarildi</option>
                        <option value="completed">Bajarildi</option>
                        <option value="cancelled">Bekor qilindi</option>
                      </select>
                    </td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Buyurtmalar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
