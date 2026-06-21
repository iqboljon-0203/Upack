"use client";

import { useState, useEffect } from "react";
import { User, Package, MapPin, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

  // Profile editable states
  const [userType, setUserType] = useState<"jismoniy" | "yuridik">("jismoniy");
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/login");
          return;
        }
        setUser(data.user);
        setFullName(data.user.firstName || "");

        // Fetch from Supabase profiles
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: prof, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (prof && !error) {
            setCompanyName(prof.company_name || "");
            setInn(prof.inn || "");
            setPhone(prof.phone || "");
            setUserType(prof.company_name || prof.inn ? "yuridik" : "jismoniy");
          }
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      // Update profiles table
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          company_name: userType === "yuridik" ? companyName : null,
          inn: userType === "yuridik" ? inn : null,
          phone: phone,
        });

      if (error) throw error;

      // Update auth user metadata for firstName
      await supabase.auth.updateUser({
        data: { first_name: fullName }
      });

      // Update local user state
      if (user) {
        setUser({
          ...user,
          firstName: fullName
        });
      }

      toast.success(language === 'uz' ? "Ma'lumotlar muvaffaqiyatli saqlandi!" : "Данные успешно сохранены!");
    } catch (err: any) {
      console.error(err);
      toast.error(language === 'uz' ? "Saqlashda xatolik yuz berdi" : "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{language === 'uz' ? "Shaxsiy ma'lumotlar" : 'Личные данные'}</h2>
              
              <div className="space-y-6 max-w-xl">
                {/* Account Type Toggle */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {language === 'uz' ? "Mijoz turi" : 'Тип клиента'}
                  </label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setUserType('jismoniy')} 
                      className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${userType === 'jismoniy' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-350'}`}
                    >
                      {language === 'uz' ? 'Jismoniy shaxs' : 'Физическое лицо'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUserType('yuridik')} 
                      className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${userType === 'yuridik' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-500 hover:border-slate-350'}`}
                    >
                      {language === 'uz' ? 'Yuridik shaxs' : 'Юридическое лицо'}
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'Ism va familiya' : 'Имя и фамилия'}</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 text-slate-900 bg-white" />
                </div>

                {/* Conditional Fields for Yuridik shaxs */}
                <AnimatePresence mode="wait">
                  {userType === "yuridik" && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'Kompaniya nomi' : 'Название компании'}</label>
                        <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 text-slate-900 bg-white" placeholder={language === 'uz' ? "MCHJ / YTT nomi" : "ООО / ИП"} />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'STIR (INN)' : 'ИНН'}</label>
                        <input type="text" value={inn} onChange={e => setInn(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 text-slate-900 bg-white" placeholder="123456789" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{language === 'uz' ? 'Telefon raqam' : 'Номер телефона'}</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 90 123 45 67" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 text-slate-900 bg-white" />
                </div>

                {/* Telegram Connection details */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Telegram Username</label>
                    <div className="text-sm font-semibold text-slate-600">@{user.username || 'Mavjud emas'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Telegram ID</label>
                    <div className="text-sm font-semibold text-slate-600">{user.chatId}</div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full sm:w-auto mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-primary-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (language === 'uz' ? 'Saqlanmoqda...' : 'Сохранение...') : (language === 'uz' ? 'Saqlash' : 'Сохранить')}
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
              <p className="font-bold text-slate-900">
                {language === 'uz' ? 'Holati:' : 'Статус:'}{' '}
                <span className="text-primary-600 font-extrabold">
                  {language === 'uz' ? (
                    order.status === 'pending' || order.status === 'new' ? 'Yangi' :
                    order.status === 'processing' ? 'Jarayonda' :
                    order.status === 'assembled' ? 'Yig\'ildi' :
                    order.status === 'shipped' ? 'Chiqarildi' :
                    order.status === 'completed' ? 'Bajarildi' :
                    order.status === 'cancelled' ? 'Bekor qilindi' : order.status
                  ) : (
                    order.status === 'pending' || order.status === 'new' ? 'Новый' :
                    order.status === 'processing' ? 'В обработке' :
                    order.status === 'assembled' ? 'Собран' :
                    order.status === 'shipped' ? 'Отправлен' :
                    order.status === 'completed' ? 'Выполнен' :
                    order.status === 'cancelled' ? 'Отменен' : order.status
                  )}
                </span>
              </p>
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
