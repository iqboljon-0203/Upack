"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck, Minus, Plus, Heart, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { items, addItem, updateQuantity } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  
  // These rely on product, so initialize them after fetching
  const [localQuantity, setLocalQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();
        
        if (error) throw error;
        setProduct(data);
        if (data) {
          setLocalQuantity(data.minOrder || 1);

          // Fetch related products (same category)
          const { data: relatedData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', data.category_id)
            .neq('id', data.id)
            .limit(4);
          
          if (relatedData) {
            setRelatedProducts(relatedData);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={48} className="animate-spin mb-4 text-primary-500" />
        <p>{language === 'uz' ? 'Mahsulot yuklanmoqda...' : 'Загрузка товара...'}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">{language === 'uz' ? 'Mahsulot topilmadi' : 'Товар не найден'}</h1>
        <Link href="/katalog" className="text-primary-600 font-bold hover:underline">
          {language === 'uz' ? 'Katalogga qaytish' : 'Вернуться в каталог'}
        </Link>
      </div>
    );
  }

  const cartItem = items.find(item => item.id === product.id);

  const gallery = [product.image];

  const handleAddToCart = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + localQuantity);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        minOrderQuantity: product.minOrder,
        quantity: localQuantity
      });
    }
    toast.success(language === 'uz' ? `${product.name} savatga qo'shildi!` : `${product.name} добавлено в корзину!`);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium mb-8">
        <Link href="/" className="hover:text-primary-600 transition-colors">{language === 'uz' ? 'Bosh sahifa' : 'Главная'}</Link>
        <span className="text-slate-300">/</span>
        <Link href="/katalog" className="hover:text-primary-600 transition-colors">{language === 'uz' ? 'Katalog' : 'Каталог'}</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 line-clamp-1">{product.name}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Left: Image Gallery */}
        <div className="md:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center relative">
          <div className="w-full aspect-square flex items-center justify-center mb-6">
            <img 
              src={gallery[activeImage]} 
              alt={product.name} 
              className="max-w-full max-h-full rounded-2xl shadow-lg object-contain transition-all duration-300"
              onError={(e) => { e.currentTarget.src = '/logo.svg' }}
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 w-full justify-center">
              {gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-primary-600' : 'border-transparent hover:border-slate-300'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <button 
            onClick={() => toggleFavorite(product)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-error shadow-md transition-all hover:scale-110"
          >
            <Heart size={24} fill={isFavorite(product.id) ? "currentColor" : "none"} className={isFavorite(product.id) ? "text-error" : ""} />
          </button>
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-8 lg:p-12 flex flex-col">
          <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold w-max mb-4 uppercase tracking-wider">
            {product.category}
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="text-3xl font-black text-primary-600 mb-6">
            {product.price.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'} <span className="text-sm font-medium text-slate-400">/ {product.unit}</span>
          </div>

          <div className="prose prose-slate mb-8 max-w-none">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{language === 'uz' ? 'Mahsulot haqida:' : 'О товаре:'}</h3>
            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
              {product.full_desc}
            </p>
          </div>

          <div className="mt-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl h-14 w-full sm:w-auto shrink-0 px-2">
                <button 
                  onClick={() => setLocalQuantity(Math.max(product.minOrder, localQuantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <div className="w-16 text-center font-bold text-slate-900 select-none">
                  {localQuantity}
                </div>
                <button 
                  onClick={() => setLocalQuantity(localQuantity + 1)}
                  className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/30 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingCart size={20} />
                {language === 'uz' ? "Savatga qo'shish" : 'В корзину'}
              </button>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-slate-500 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-primary-600" />
                {language === 'uz' ? 'Yetkazib berish xizmati' : 'Служба доставки'}
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary-600" />
                {language === 'uz' ? 'Sifat kafolati' : 'Гарантия качества'}
              </div>
            </div>
            
            <div className="text-sm text-slate-400">
              {language === 'uz' ? 'Min. buyurtma hajmi:' : 'Мин. заказ:'} <span className="font-bold text-slate-700">{product.minOrder} {product.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{language === 'uz' ? 'Mijozlar fikrlari' : 'Отзывы клиентов'}</h2>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center justify-center md:border-r border-slate-100 md:pr-8">
            <div className="text-5xl font-black text-slate-900 mb-2">4.8</div>
            <div className="flex text-warning mb-2 text-xl">⭐⭐⭐⭐⭐</div>
            <div className="text-slate-500 text-sm">124 {language === 'uz' ? 'ta baho' : 'оценки'}</div>
          </div>
          <div className="md:w-2/3 flex flex-col gap-6">
            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-slate-900">Azizbek</div>
                <div className="text-warning text-xs">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-slate-600 text-sm">{language === 'uz' ? "Juda sifatli mahsulot ekan. O'z vaqtida yetkazib berishdi. Yana buyurtma beraman." : 'Очень качественный товар. Доставили вовремя. Буду заказывать еще.'}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-slate-900">Dilshod</div>
                <div className="text-warning text-xs">⭐⭐⭐⭐⭐</div>
              </div>
              <p className="text-slate-600 text-sm">{language === 'uz' ? "Narx va sifat mutanosibligi a'lo darajada. Katta hajmda olish uchun juda qulay do'kon ekan." : 'Отличное соотношение цены и качества. Очень удобный магазин для оптовых закупок.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{language === 'uz' ? "O'xshash mahsulotlar" : 'Похожие товары'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/mahsulot/${p.id}`} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group flex flex-col h-full">
                <div className="w-full h-32 sm:h-40 bg-slate-50 rounded-xl mb-4 overflow-hidden">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1558000143-a61254bf5228?q=80&w=800&auto=format&fit=crop' }}
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{p.name}</h3>
                <div className="mt-auto font-black text-primary-600">{p.price.toLocaleString('ru-RU')} {language === 'uz' ? "so'm" : 'сум'}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
