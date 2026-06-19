"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CreditCard, Banknote, Truck, MapPin, Phone, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export default function CheckoutPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState("naqd");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [coordinates, setCoordinates] = useState<number[] | null>(null);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0 && mounted) {
      router.push("/cart");
    }
  }, [items, mounted, router]);

  if (!mounted || items.length === 0) {
    return <div className="container mx-auto px-6 py-20">{language === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...'}</div>;
  }

  const totalPrice = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the Supabase user id if authenticated
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const finalAddress = coordinates 
        ? `${address}\n(Xarita: https://yandex.com/maps/?pt=${coordinates[1]},${coordinates[0]}&z=18&l=map)` 
        : address;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          fullName,
          phone,
          address: finalAddress,
          comment,
          paymentMethod,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          totalPrice,
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        toast.success(language === 'uz' ? `Buyurtmangiz qabul qilindi! (${data.orderNumber}) Tez orada operatorlarimiz siz bilan bog'lanishadi.` : `Ваш заказ принят! (${data.orderNumber}) Наши операторы скоро свяжутся с вами.`, {
          duration: 5000,
        });
        router.push("/");
      } else {
        toast.error(data.message || (language === 'uz' ? "Xatolik yuz berdi" : "Произошла ошибка"));
      }
    } catch {
      toast.error(language === 'uz' ? "Server bilan bog'lanishda xatolik yuz berdi" : "Ошибка соединения с сервером");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/cart" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-medium">
        <ArrowLeft size={20} />
        {language === 'uz' ? 'Savatga qaytish' : 'Вернуться в корзину'}
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">{language === 'uz' ? 'Rasmiylashtirish' : 'Оформление заказа'}</h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Shaxsiy ma'lumotlar */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User size={22} className="text-primary-600" />
                {language === 'uz' ? "Shaxsiy ma'lumotlar" : "Личные данные"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{language === 'uz' ? 'Ism va Familiya' : 'Имя и Фамилия'}</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'uz' ? "Eshmatov Toshmat" : "Иван Иванов"} 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{language === 'uz' ? 'Telefon raqam' : 'Номер телефона'}</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67" 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Yetkazib berish */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Truck size={22} className="text-primary-600" />
                {language === 'uz' ? 'Yetkazib berish' : 'Доставка'}
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="mb-6 w-full h-[300px] rounded-xl overflow-hidden border border-slate-200 relative z-0">
                  <YMaps>
                    <Map 
                      defaultState={{ center: [41.2995, 69.2401], zoom: 12 }} 
                      onClick={(e: any) => setCoordinates(e.get('coords'))}
                      width="100%" 
                      height="100%"
                    >
                      {coordinates && <Placemark geometry={coordinates} />}
                    </Map>
                  </YMaps>
                  <div className="absolute top-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-4 py-2 text-sm font-bold rounded-lg shadow-sm text-slate-700 pointer-events-none text-center border border-slate-100">
                    {language === 'uz' ? 'Xaritadan yetkazib berish manzilini belgilang' : 'Укажите адрес доставки на карте'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400"/>
                    {language === 'uz' ? "Aniq manzilni yozing (ko'cha, uy, qavat)" : "Точный адрес (улица, дом, этаж)"}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={language === 'uz' ? "Manzil, ko'cha, uy raqami va mo'ljal..." : "Адрес, улица, номер дома и ориентир..."} 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    {language === 'uz' ? "Qo'shimcha izoh (ixtiyoriy)" : "Дополнительный комментарий (необязательно)"}
                  </label>
                  <textarea 
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={language === 'uz' ? "Operatorga qo'shimcha ma'lumotlar qoldirishingiz mumkin..." : "Можете оставить дополнительную информацию для оператора..."} 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl py-3 px-4 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* To'lov turi */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard size={22} className="text-primary-600" />
                {language === 'uz' ? "To'lov turi" : "Способ оплаты"}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'naqd' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="naqd" checked={paymentMethod === 'naqd'} onChange={() => setPaymentMethod('naqd')} className="hidden" />
                  <Banknote size={32} className={paymentMethod === 'naqd' ? 'text-primary-600' : 'text-slate-400'} />
                  <span className="font-bold">{language === 'uz' ? "Naqd pul" : "Наличными"}</span>
                </label>
                
                <label className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'karta' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="payment" value="karta" checked={paymentMethod === 'karta'} onChange={() => setPaymentMethod('karta')} className="hidden" />
                  <CreditCard size={32} className={paymentMethod === 'karta' ? 'text-primary-600' : 'text-slate-400'} />
                  <span className="font-bold">{language === 'uz' ? "Karta orqali" : "Картой"}</span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30 font-bold py-4 rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {language === 'uz' ? 'Rasmiylashtirilmoqda...' : 'Оформляется...'}
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} /> {language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
                </>
              )}
            </button>

          </form>
        </div>

        {/* Order Summary (Right) */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{language === 'uz' ? 'Buyurtmangiz' : 'Ваш заказ'}</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <div className="text-xs text-slate-500 mt-1">{item.quantity} x {item.price.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600 mb-3">
                <span>{language === 'uz' ? 'Mahsulotlar' : 'Товары'} ({items.length})</span>
                <span className="font-semibold text-slate-900">{totalPrice.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</span>
              </div>
              <div className="flex justify-between text-slate-600 mb-3">
                <span>{language === 'uz' ? 'Yetkazib berish' : 'Доставка'}</span>
                <span className="font-semibold text-slate-900">{language === 'uz' ? 'Bepul*' : 'Бесплатно*'}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 mt-2 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-lg">{language === 'uz' ? "Jami to'lov:" : 'Итого к оплате:'}</span>
              <span className="text-2xl font-black text-primary-600">{totalPrice.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
