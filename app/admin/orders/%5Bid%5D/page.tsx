"use client";
 
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Calendar, Phone, MapPin, History } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { motion } from "framer-motion";
 
export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
 
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    if (!orderId) return;
 
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch order details and items
        const res = await fetch(`/api/admin/orders?id=${orderId}&items=true`);
        const json = await res.json();
        
        if (json.success && json.data) {
          setOrder(json.data.order);
          setItems(json.data.items || []);
 
          // 2. Fetch history (other orders by this user)
          if (json.data.order.user_id) {
            const historyRes = await fetch(`/api/admin/orders?historyUserId=${json.data.order.user_id}`);
            const historyJson = await historyRes.json();
            if (historyJson.success && historyJson.data) {
              setHistory(historyJson.data.filter((h: any) => h.id !== orderId));
            }
          }
        } else {
          toast.error("Buyurtma topilmadi");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Xatolik yuz berdi");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDetails();
  }, [orderId]);
 
  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success("Status o'zgartirildi");
        setOrder({ ...order, status: newStatus });
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Xatolik yuz berdi");
    }
  };
 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="flex flex-col items-center gap-3 text-slate-400 text-xs font-semibold">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span>Buyurtma yuklanmoqda...</span>
        </div>
      </div>
    );
  }
 
  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center h-64 w-full gap-4 text-xs font-bold">
        <div className="text-slate-400">Buyurtma topilmadi</div>
        <button onClick={() => router.push('/admin/orders')} className="text-primary-600 hover:underline">
          Orqaga qaytish
        </button>
      </div>
    );
  }
 
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 max-w-7xl mx-auto w-full"
    >
      
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => router.push('/admin/orders')} 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Orqaga qaytish
          </button>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">Buyurtma #{order.id.slice(0,8)}</h1>
            <select 
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg outline-none border border-slate-200/50 hover:border-slate-350 transition-colors cursor-pointer ${
                order.status === 'pending' || order.status === 'new' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10' :
                order.status === 'processing' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10' :
                order.status === 'assembled' ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10' :
                order.status === 'shipped' ? 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/10' :
                order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10' :
                'bg-slate-50 text-slate-700 ring-1 ring-slate-600/10'
              }`}
            >
              <option value="pending">Yangi (Pending)</option>
              <option value="processing">Jarayonda</option>
              <option value="assembled">Yig'ildi</option>
              <option value="shipped">Chiqarildi</option>
              <option value="completed">Bajarildi</option>
              <option value="cancelled">Bekor qilindi</option>
            </select>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-1.5">{new Date(order.created_at).toLocaleString()}</p>
        </div>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Order details & Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2"><Package size={16} className="text-primary-500" /> Umumiy ma'lumot</h3>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex justify-between items-center"><span className="text-slate-400">Sana:</span> <span className="text-slate-800">{new Date(order.created_at).toLocaleDateString()}</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-400">To'lov usuli:</span> <span className="text-slate-800 capitalize">{order.payment_method === 'naqd' ? 'Naqd pul' : order.payment_method === 'karta' ? 'Karta orqali' : order.payment_method || 'Noma\'lum'}</span></div>
                  {order.comment && (
                    <div className="pt-2.5 border-t border-slate-100/60">
                      <span className="text-slate-400 block mb-1">Izoh:</span> 
                      <span className="text-slate-600 font-medium italic block whitespace-pre-wrap">{order.comment}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100/60 mt-4">
                <span className="text-xs font-bold text-slate-400">Jami summa:</span>
                <span className="text-base font-black text-primary-600">{order.total_price?.toLocaleString('ru-RU')} so'm</span>
              </div>
            </div>
 
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2"><MapPin size={16} className="text-primary-500" /> Mijoz & Manzil</h3>
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex items-center gap-2.5 text-slate-800"><UserIcon /> {order.customer_name || 'Ism kiritilmagan'}</div>
                <div className="flex items-center gap-2.5 text-slate-600"><Phone size={14} className="text-slate-400 shrink-0" /> {order.customer_phone || 'Telefon raqam yo\'q'}</div>
                <div className="flex items-start gap-2.5 text-slate-600 leading-relaxed"><MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" /> <span className="whitespace-pre-wrap">{order.shipping_address || "Manzil kiritilmagan"}</span></div>
              </div>
            </div>
          </div>
 
          {/* Items Container */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-sm">Buyurtma qilingan mahsulotlar</h3>
            </div>
            
            {/* Mobile items view */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {items.length > 0 ? items.map((item) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-14 h-14 relative rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50/40">
                    {item.products?.image ? (
                      <Image src={item.products.image} alt="img" fill className="object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                    <span className="font-bold text-slate-900 text-xs truncate block">{item.products?.name || "O'chirilgan mahsulot"}</span>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[11px] font-bold text-slate-500">{item.quantity} ta x {item.price?.toLocaleString()}</span>
                      <span className="text-xs font-black text-slate-950">{(item.price * item.quantity).toLocaleString()} so'm</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-xs font-bold text-slate-400">Mahsulotlar topilmadi</div>
              )}
            </div>
 
            {/* Desktop items view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-5 pl-6">Mahsulot</th>
                    <th className="p-5 text-center">Miqdor</th>
                    <th className="p-5 text-right">Narxi</th>
                    <th className="p-5 pr-6 text-right">Jami</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.length > 0 ? items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-5 pl-6 flex items-center gap-3.5">
                        <div className="w-14 h-14 relative rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-white shadow-sm">
                          {item.products?.image ? (
                            <Image src={item.products.image} alt="img" fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                              <Package size={20} className="text-slate-350" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{item.products?.name || "O'chirilgan mahsulot"}</div>
                        </div>
                      </td>
                      <td className="p-5 text-center font-bold text-slate-600 text-sm">{item.quantity} ta</td>
                      <td className="p-5 text-right font-semibold text-slate-400 text-sm">{item.price?.toLocaleString('ru-RU')}</td>
                      <td className="p-5 pr-6 text-right font-black text-slate-900 text-sm">{(item.price * item.quantity).toLocaleString('ru-RU')} so'm</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="p-8 text-center text-xs font-bold text-slate-400">Mahsulotlar topilmadi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
 
        </div>
 
        {/* Right Column: Customer History */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2"><History size={16} className="text-primary-500" /> Mijoz tarixi</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Ushbu mijozning boshqa xaridlari</p>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1">
              {!order.user_id ? (
                 <div className="p-8 text-center text-xs font-semibold text-slate-400 flex flex-col items-center gap-3">
                   <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                     <History size={24} />
                   </div>
                   Mehmon foydalanuvchi. Tarix yo'q.
                 </div>
              ) : history.length > 0 ? (
                <div className="flex flex-col divide-y divide-slate-100">
                  {history.map((hOrder) => (
                    <div 
                      key={hOrder.id} 
                      onClick={() => router.push(`/admin/orders/${hOrder.id}`)}
                      className="p-5 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-800 text-xs group-hover:text-primary-600 transition-colors">#{hOrder.id.slice(0,8)}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          hOrder.status === 'pending' || hOrder.status === 'new' ? 'bg-amber-100 text-amber-700' :
                          hOrder.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          hOrder.status === 'assembled' ? 'bg-indigo-100 text-indigo-700' :
                          hOrder.status === 'shipped' ? 'bg-cyan-100 text-cyan-700' :
                          hOrder.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {hOrder.status === 'pending' || hOrder.status === 'new' ? 'Yangi' :
                           hOrder.status === 'processing' ? 'Jarayonda' :
                           hOrder.status === 'assembled' ? 'Yig\'ildi' :
                           hOrder.status === 'shipped' ? 'Chiqarildi' :
                           hOrder.status === 'completed' ? 'Tugatildi' :
                           hOrder.status === 'cancelled' ? 'Bekor qilindi' : hOrder.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2.5 font-bold">
                        <Calendar size={12} /> {new Date(hOrder.created_at).toLocaleDateString()}
                      </div>
                      <div className="font-black text-slate-900 text-xs">{hOrder.total_price?.toLocaleString('ru-RU')} so'm</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs font-semibold text-slate-400 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-350">
                    <History size={24} />
                  </div>
                  Bu mijozning birinchi buyurtmasi.
                </div>
              )}
            </div>
          </div>
        </div>
 
      </div>
    </motion.div>
  );
}
 
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}
