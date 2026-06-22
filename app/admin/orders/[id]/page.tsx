"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Calendar, Phone, Mail, MapPin, History, CheckCircle2 } from "lucide-react";
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
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
          <span className="font-medium text-slate-500">Buyurtma yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center h-64 w-full gap-4">
        <div className="text-slate-400">Buyurtma topilmadi</div>
        <button onClick={() => router.push('/admin/orders')} className="text-primary-600 font-bold hover:underline">
          Orqaga qaytish
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 p-6 md:p-8 max-w-7xl mx-auto w-full"
    >
      
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full">
          <button 
            onClick={() => router.push('/admin/orders')} 
            className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Barcha buyurtmalarga qaytish
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Buyurtma #{order.id.slice(0,8)}</h1>
            <select 
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`w-full sm:w-auto px-4 py-2.5 text-sm font-bold rounded-xl outline-none cursor-pointer border-2 border-transparent hover:border-slate-200 transition-colors ${
                order.status === 'pending' || order.status === 'new' ? 'bg-amber-100 text-amber-700' :
                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                order.status === 'assembled' ? 'bg-indigo-100 text-indigo-700' :
                order.status === 'shipped' ? 'bg-cyan-100 text-cyan-700' :
                order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              }`}
            >
              <option value="pending">Yangi (Pending)</option>
              <option value="processing">Jarayonda</option>
              <option value="assembled">Yig'ildi</option>
              <option value="shipped">Chiqarildi</option>
              <option value="completed">Tugatildi / Bajarildi</option>
              <option value="cancelled">Bekor qilindi</option>
            </select>
          </div>
          <p className="text-slate-500 mt-2.5 font-medium text-sm">{new Date(order.created_at).toLocaleString('ru-RU')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order details & Items */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Package size={20} className="text-primary-500" /> Umumiy ma'lumot</h3>
              <div className="space-y-4 text-base">
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Sana:</span> <span className="font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString('ru-RU')}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">Jami summa:</span> <span className="font-black text-xl text-primary-600">{order.total_price?.toLocaleString('ru-RU')} so'm</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500 font-medium">To'lov usuli:</span> <span className="font-bold text-slate-900 capitalize">{order.payment_method === 'naqd' ? 'Naqd pul' : order.payment_method === 'karta' ? 'Karta orqali' : order.payment_method || 'Noma\'lum'}</span></div>
                {order.comment && (
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-slate-500 font-medium block mb-1">Izoh:</span> 
                    <span className="text-slate-700 italic">{order.comment}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><MapPin size={20} className="text-primary-500" /> Mijoz & Manzil</h3>
              <div className="space-y-4 text-base">
                <div className="flex items-center gap-3 text-slate-900 font-bold"><UserIcon /> {order.customer_name || 'Ism kiritilmagan'}</div>
                <div className="flex items-center gap-3 text-slate-600 font-medium"><Phone size={18} className="text-slate-400 shrink-0" /> {order.customer_phone || 'Telefon raqam yo\'q'}</div>
                <div className="flex items-start gap-3 text-slate-600 font-medium leading-relaxed"><MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" /> <span className="whitespace-pre-wrap">{order.shipping_address || "Manzil kiritilmagan"}</span></div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-lg">Buyurtma qilingan mahsulotlar</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white text-slate-400 text-sm font-bold uppercase tracking-wider">
                    <th className="p-4 sm:p-6 border-b border-slate-100">Mahsulot</th>
                    <th className="p-4 sm:p-6 border-b border-slate-100 text-center">Miqdor</th>
                    <th className="p-4 sm:p-6 border-b border-slate-100 text-right">Narxi</th>
                    <th className="p-4 sm:p-6 border-b border-slate-100 text-right">Jami</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.length > 0 ? items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        {item.products?.image ? (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-white shadow-sm">
                            <Image src={item.products.image} alt="img" fill className="object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 relative rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                            <Package size={24} className="text-slate-300" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2">{item.products?.name || "O'chirilgan mahsulot"}</div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-6 text-center font-bold text-slate-700 text-sm sm:text-base">{item.quantity} ta</td>
                      <td className="p-4 sm:p-6 text-right font-medium text-slate-500 text-sm sm:text-base">{item.price?.toLocaleString('ru-RU')}</td>
                      <td className="p-4 sm:p-6 text-right font-black text-slate-900 text-base sm:text-lg">{(item.price * item.quantity).toLocaleString('ru-RU')} so'm</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 font-medium">Mahsulotlar topilmadi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Customer History */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2"><History size={20} className="text-primary-500" /> Mijoz tarixi</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Ushbu mijozning boshqa xaridlari</p>
            </div>
            
            <div className="p-0 overflow-y-auto flex-1">
              {!order.user_id ? (
                 <div className="p-8 text-center text-slate-500 font-medium flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                     <History size={32} />
                   </div>
                   Bu mijoz saytga kirmasdan xarid qilgan (Mehmon). Tarixni ko'rish imkoni yo'q.
                 </div>
              ) : history.length > 0 ? (
                <div className="flex flex-col divide-y divide-slate-100">
                  {history.map((hOrder) => (
                    <div 
                      key={hOrder.id} 
                      onClick={() => router.push(`/admin/orders/${hOrder.id}`)}
                      className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">#{hOrder.id.slice(0,8)}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
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
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3 font-medium">
                        <Calendar size={14} /> {new Date(hOrder.created_at).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="font-black text-slate-900 text-base">{hOrder.total_price?.toLocaleString('ru-RU')} so'm</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-slate-500 font-medium flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <History size={32} />
                  </div>
                  Bu mijozning birinchi xaridi. Boshqa buyurtmalar yo'q.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

// Custom icon
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}
