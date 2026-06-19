"use client";

import { useState, useEffect } from "react";
import { User, Package, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface UserProfile {
  firstName: string;
  username: string;
  chatId: string;
}

export default function ProfilePage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (isLoading) {
    return <div className="container mx-auto px-6 py-20 text-center">{language === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...'}</div>;
  }

  if (!user) return null;

  const initials = user.firstName ? user.firstName.substring(0, 2).toUpperCase() : "U";

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl">
                {initials}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 line-clamp-1">{user.firstName}</h3>
                <p className="text-sm text-slate-500">@{user.username || (language === 'uz' ? "foydalanuvchi" : "пользователь")}</p>
              </div>
            </div>
            
            <div className="p-4 flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Package size={20} /> {language === 'uz' ? 'Mening xaridlarim' : 'Мои покупки'}
              </button>
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <User size={20} /> {language === 'uz' ? "Ma'lumotlarim" : 'Мои данные'}
              </button>
              <button 
                onClick={() => setActiveTab("address")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${activeTab === 'address' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <MapPin size={20} /> {language === 'uz' ? 'Manzillarim' : 'Мои адреса'}
              </button>
              
              <div className="h-px w-full bg-slate-100 my-2"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left text-error hover:bg-error/10"
              >
                <LogOut size={20} /> {language === 'uz' ? 'Tizimdan chiqish' : 'Выйти'}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-left">{language === 'uz' ? 'Xaridlar tarixi' : 'История покупок'}</h2>
              
              <OrdersList language={language} />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{language === 'uz' ? "Shaxsiy ma'lumotlar" : 'Личные данные'}</h2>
              
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'F.I.SH' : 'Ф.И.О'}</label>
                  <input type="text" disabled value={user.firstName} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Telegram Username</label>
                  <input type="text" disabled value={`@${user.username || (language === 'uz' ? "Mavjud emas" : "Не указан")}`} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Telegram ID</label>
                  <input type="text" disabled value={user.chatId} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-900" />
                </div>
                <button disabled className="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-primary-600/20 disabled:opacity-50">
                  {language === 'uz' ? 'Saqlash' : 'Сохранить'}
                </button>
              </div>
            </div>
          )}

          {activeTab === "address" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-left">{language === 'uz' ? 'Manzillarim' : 'Мои адреса'}</h2>
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <MapPin size={48} className="text-slate-400 mb-4" />
                <p className="text-lg text-slate-600 font-medium">{language === 'uz' ? "Saqlangan manzillar yo'q" : 'Нет сохраненных адресов'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrdersList({ language }: { language: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
            
          if (data && !error) {
            setOrders(data);
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-slate-400">{language === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...'}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 opacity-50 text-center">
        <Package size={48} className="text-slate-400 mb-4" />
        <p className="text-lg text-slate-600 font-medium">{language === 'uz' ? "Hozircha xaridlar yo'q" : 'Пока нет покупок'}</p>
        <p className="text-sm text-slate-400">{language === 'uz' ? "Siz hali birorta ham buyurtma bermagansiz." : 'Вы еще не сделали ни одного заказа.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {orders.map((order: any) => (
        <div key={order.id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">{new Date(order.created_at).toLocaleDateString()}</p>
              <p className="font-bold text-slate-900">{language === 'uz' ? 'Holati:' : 'Статус:'} <span className="text-primary-600 capitalize">{order.status}</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">{language === 'uz' ? 'Jami summa:' : 'Общая сумма:'}</p>
              <p className="font-black text-slate-900 text-lg">{order.total_price?.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0">
                    <img src={item.products?.image || '/logo.svg'} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="font-medium text-slate-700">{item.products?.name || 'Mahsulot'} x {item.quantity}</span>
                </div>
                <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
