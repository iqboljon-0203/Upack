"use client";
 
import { useState, useEffect } from "react";
import { Eye, Search, Filter, Calendar, MapPin, ArrowUpRight } from "lucide-react";
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
    <div className="flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Buyurtmalar</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">Mijozlar tomonidan yuborilgan barcha buyurtmalar</p>
        </div>
      </div>
 
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Manzil yoki ID bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-xs font-semibold"
            />
          </div>
          
          <div className="relative min-w-[170px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Filter size={16} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-xs font-bold text-slate-600 appearance-none cursor-pointer"
            >
              <option value="all">Barcha holatlar</option>
              <option value="pending">Yangi</option>
              <option value="processing">Jarayonda</option>
              <option value="assembled">Yig'ildi</option>
              <option value="shipped">Chiqarildi</option>
              <option value="completed">Bajarildi</option>
              <option value="cancelled">Bekor qilingan</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
 
        {isLoading ? (
          <div className="p-12 text-center flex justify-center items-center gap-2.5 text-xs font-semibold text-slate-400">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
            Yuklanmoqda...
          </div>
        ) : filteredOrders.length > 0 ? (
          <>
            {/* Mobile Layout: Cards list */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-sm transition-all"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">#{order.id.slice(0, 8)}</span>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{new Date(order.created_at).toLocaleString()}</div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded outline-none border border-transparent transition-colors cursor-pointer ${
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
                    </div>
                  </div>
 
                  <div className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{order.shipping_address || 'Manzil kiritilmagan'}</span>
                    </div>
                  </div>
 
                  <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 mt-1">
                    <span className="text-sm font-black text-slate-950">{order.total_price?.toLocaleString('ru-RU')} so'm</span>
                    <span className="text-xs font-bold text-primary-600 flex items-center gap-0.5">
                      Batafsil <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Desktop Layout: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-400 text-[10px] uppercase tracking-wider font-bold border-b border-slate-100">
                    <th className="p-4 pl-6 rounded-tl-xl">ID / Sana</th>
                    <th className="p-4">Mijoz (Manzil)</th>
                    <th className="p-4">Summa</th>
                    <th className="p-4">Holati</th>
                    <th className="p-4 pr-6 text-right rounded-tr-xl">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-900 text-sm">#{order.id.slice(0,8)}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(order.created_at).toLocaleString('ru-RU')}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm line-clamp-1 max-w-[260px]">{order.shipping_address || 'Kiritilmagan'}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">Mijoz ID: {order.user_id?.slice(0,6)}...</div>
                      </td>
                      <td className="p-4 font-black text-slate-950 text-sm">{order.total_price?.toLocaleString('ru-RU')} so'm</td>
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg outline-none border border-slate-200/50 hover:border-slate-300 transition-colors cursor-pointer ${
                            order.status === 'pending' || order.status === 'new' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10' :
                            order.status === 'processing' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10' :
                            order.status === 'assembled' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10' :
                            order.status === 'shipped' ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10' :
                            order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                            'bg-slate-50 text-slate-700 ring-1 ring-slate-600/10'
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
                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors inline-flex"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Buyurtmalar topilmadi
          </div>
        )}
      </div>
    </div>
  );
}
