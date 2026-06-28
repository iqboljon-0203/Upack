"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Truck, ShieldCheck, Clock, CheckCircle, Package, History, Star, StarHalf, Leaf, Box, ChevronDown, ChevronUp, Gift, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900"
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="text-primary-500 shrink-0" size={20} /> : <ChevronDown className="text-slate-400 shrink-0" size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 text-slate-500 leading-relaxed"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const { language } = useLanguage();
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<any>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/content?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => setDynamicContent(data))
      .catch(console.error);
      
      supabase.from('categories')
        .select('*')
        .is('parent_id', null)
        .then(({ data }) => {
          if (data && data.length > 0) setDbCategories(data);
        });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reviewsScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = reviewsScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          reviewsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const firstChild = reviewsScrollRef.current.children[0] as HTMLElement;
          if (firstChild) {
            const cardWidth = firstChild.offsetWidth + 24; // 24px is gap-6
            reviewsScrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Content fallbacks
  const heroData = dynamicContent?.hero || {
    badge_uz: "O'zbekistonda 1-raqamli B2B qadoqlash platformasi",
    badge_ru: "Платформа упаковки B2B №1 в Узбекистане",
    title1_uz: "Sanoat va Qadoqlash Uchun",
    title1_ru: "Для промышленности и упаковки",
    title2_uz: "Professional Yechimlar",
    title2_ru: "Профессиональные решения",
    desc_uz: "Ishonchli yetkazib berish, yuqori sifatli materiallar va ulgurji xaridorlar uchun maxsus shartlar.",
    desc_ru: "Надежная доставка, высококачественные материалы и специальные условия для оптовых покупателей.",
    stats: [
      { value: "1000+", label_uz: "Doimiy mijozlar", label_ru: "Постоянных клиентов" },
      { value: "500+", label_uz: "Xil mahsulotlar", label_ru: "Видов продукции" },
      { value: "24/7", label_uz: "Qo'llab-quvvatlash", label_ru: "Поддержка" },
      { value: "100%", label_uz: "Sifat kafolati", label_ru: "Гарантия качества" }
    ]
  };

  const featuresData = dynamicContent?.features || {
    title_uz: "Nima uchun bizni tanlashadi?",
    title_ru: "Почему выбирают нас?",
    desc_uz: "Biz biznesingiz barqarorligi uchun eng yaxshi sharoitlarni taklif qilamiz.",
    desc_ru: "Мы предлагаем лучшие условия для стабильности вашего бизнеса.",
    cards: [
      { icon: "Box", title_uz: "Doimiy Zaxira", title_ru: "Постоянный запас", desc_uz: "Katta hajmdagi buyurtmalar uchun doimiy ombor zaxirasi mavjud.", desc_ru: "Постоянный складской запас для крупных заказов." },
      { icon: "Truck", title_uz: "Tezkor Yetkazish", title_ru: "Быстрая доставка", desc_uz: "Toshkent bo'ylab bepul va tezkor yetkazib berish xizmati.", desc_ru: "Бесплатная и быстрая доставка по всему Ташкенту." },
      { icon: "ShieldCheck", title_uz: "Sifat Kafolati", title_ru: "Гарантия качества", desc_uz: "Barcha mahsulotlarimiz xalqaro standartlarga va sertifikatlarga ega.", desc_ru: "Вся наша продукция имеет международные стандарты и сертификаты." },
      { icon: "Leaf", title_uz: "Eco-Friendly", title_ru: "Экологичность", desc_uz: "Tabiatga zararsiz, qayta ishlanadigan ekologik toza materiallar.", desc_ru: "Экологически чистые перерабатываемые материалы, безопасные для природы." }
    ]
  };

  const brandsData = dynamicContent?.brands || {
    title_uz: "Bizga ishonch bildirgan brendlar",
    title_ru: "Бренды, которые нам доверяют",
    brands: [
      { name: "BRAND LOGO 1", image: "" },
      { name: "BRAND LOGO 2", image: "" },
      { name: "BRAND LOGO 3", image: "" },
      { name: "BRAND LOGO 4", image: "" },
      { name: "BRAND LOGO 5", image: "" },
      { name: "BRAND LOGO 6", image: "" }
    ]
  };

  const stepsData = dynamicContent?.steps || {
    title_uz: "Buyurtma berish qanday ishlaydi?",
    title_ru: "Как сделать заказ?",
    desc_uz: "4 ta oddiy qadam orqali biznesingiz uchun kerakli mahsulotlarni oling.",
    desc_ru: "Получите необходимые продукты для вашего бизнеса за 4 простых шага.",
    steps: [
      { num: "01", title_uz: "Katalogdan tanlang", title_ru: "Выберите из каталога", desc_uz: "Kerakli qadoqlarni toping va hajmini tanlang.", desc_ru: "Найдите нужную упаковку и выберите объем." },
      { num: "02", title_uz: "Savatni to'ldiring", title_ru: "Заполните корзину", desc_uz: "Ulgurji hajmga yetib, avtomatik chegirmaga ega bo'ling.", desc_ru: "Достигните оптового объема и получите автоматическую скидку." },
      { num: "03", title_uz: "Buyurtma bering", title_ru: "Оформите заказ", desc_uz: "Ma'lumotlarni kiritib tasdiqlang.", desc_ru: "Введите данные и подтвердите." },
      { num: "04", title_uz: "Qabul qilib oling", title_ru: "Получите заказ", desc_uz: "Tezkor yetkazib berish xizmatini kuting.", desc_ru: "Дождитесь службы быстрой доставки." }
    ]
  };

  const faqData = dynamicContent?.faq || {
    title_uz: "Ko'p Beriladigan Savollar",
    title_ru: "Часто задаваемые вопросы",
    desc_uz: "Mijozlarimiz eng ko'p qiziqadigan savollarga javoblar.",
    desc_ru: "Ответы на самые популярные вопросы наших клиентов.",
    items: [
      { q_uz: "Minimal buyurtma summasi qancha?", q_ru: "Какова минимальная сумма заказа?", a_uz: "Toshkent shahri bo'ylab bepul yetkazib berish uchun minimal buyurtma summasi 500,000 so'm.", a_ru: "Минимальная сумма заказа для бесплатной доставки по Ташкенту составляет 500 000 сум." },
      { q_uz: "Ulgurji narxlar qanday ishlaydi?", q_ru: "Как работают оптовые цены?", a_uz: "Katalogda har bir mahsulot uchun belgilangan minimal ulgurji miqdor bor (masalan, 1000 dona). Agar siz shu miqdordan ko'p olsangiz, narx avtomatik ravishda tushadi.", a_ru: "Для каждого товара в каталоге указано минимальное оптовое количество. Если вы заказываете больше, цена автоматически снижается." },
      { q_uz: "Viloyatlarga yetkazib berish bormi?", q_ru: "Есть ли доставка в регионы?", a_uz: "Ha, viloyatlarga kelishilgan holda logistika kompaniyalari orqali chiqarib yuboramiz. Buning uchun menejerimiz bilan bog'laning.", a_ru: "Да, мы отправляем товары в регионы через логистические компании. Свяжитесь с менеджером для деталей." },
      { q_uz: "Bizning logotipimizni qadoqlarga tushirib bera olasizmi?", q_ru: "Можете ли вы напечатать наш логотип на упаковке?", a_uz: "Albatta. Biz mijozlarimiz uchun individual brendlash xizmatini taklif qilamiz. Minimal tiraj va narxlar bo'yicha ma'lumot olish uchun bizga yozing.", a_ru: "Конечно. Мы предлагаем услуги брендирования. Напишите нам, чтобы узнать минимальный тираж и цены." }
    ]
  };

  const ctaData = dynamicContent?.cta || {
    title1_uz: "Sifatga baho berish uchun",
    title1_ru: "Оцените качество,",
    title2_uz: "namuna so'rang!",
    title2_ru: "запросите образец!",
    desc_uz: "Katta xaridni rejalashtiryapsizmi? Bepul namunalar (Sample Kit) buyurtma qiling va o'z ko'zingiz bilan ko'ring.",
    desc_ru: "Планируете крупную закупку? Закажите бесплатные образцы (Sample Kit) и убедитесь сами.",
    btn1_uz: "Namuna Buyurtma Qilish",
    btn1_ru: "Заказать образец",
    btn2_uz: "Menejer bilan bog'lanish",
    btn2_ru: "Связаться с менеджером"
  };

  const reviewsData = dynamicContent?.reviews || {
    title_uz: "Mijozlarimiz Fikrlari",
    title_ru: "Отзывы наших клиентов",
    desc_uz: "Biz bilan ishlayotgan hamkorlarimiz qanday fikrda.",
    desc_ru: "Что говорят о нас наши партнеры.",
    reviews: [
      { text_uz: "UPack bilan hamkorlik qilish juda qulay. Yetkazib berish doim o'z vaqtida, mahsulot sifati esa yuqori darajada.", text_ru: "Сотрудничать с UPack очень удобно. Доставка всегда вовремя, а качество продукции на высшем уровне.", author_uz: "Aziz Rahimov", author_ru: "Азиз Рахимов", role_uz: "Cafe Noir rahbari", role_ru: "Руководитель Cafe Noir", rating: 5 },
      { text_uz: "B2B xaridlar uchun juda qulay narxlar va keng assortiment. Qadoqlash vositalarini doim shu yerdan buyurtma qilamiz.", text_ru: "Очень выгодные цены и широкий ассортимент для B2B закупок. Упаковочные материалы всегда заказываем здесь.", author_uz: "Nodir Aliyev", author_ru: "Нодир Алиев", role_uz: "Burger House menejeri", role_ru: "Менеджер Burger House", rating: 4.5 },
      { text_uz: "Gigiyenik vositalar va tozalash kimyoviy moddalari borasida ishonchli ta'minotchi. Xizmat ko'rsatish a'lo.", text_ru: "Надежный поставщик гигиенических средств и чистящей химии. Отличное обслуживание.", author_uz: "Malika Umarova", author_ru: "Малика Умарова", role_uz: "Sweet Bake asoschisi", role_ru: "Основатель Sweet Bake", rating: 5 },
      { text_uz: "Ajoyib xizmat! Yirik buyurtmalarga tezkor javob va sifatli mahsulotlar tufayli biznesimiz yana ham rivojlandi.", text_ru: "Отличный сервис! Быстрый ответ на крупные заказы и качественная продукция помогли нашему бизнесу развиваться.", author_uz: "Sardor Karimov", author_ru: "Сардор Каримов", role_uz: "Evos Ta'minot bo'limi", role_ru: "Отдел снабжения Evos", rating: 5 },
      { text_uz: "Yangi idishlar dizayni mijozlarimizga juda yoqdi. Muntazam sifat nazorati sezilib turibdi.", text_ru: "Новый дизайн посуды очень понравился нашим клиентам. Чувствуется регулярный контроль качества.", author_uz: "Feruza To'rayeva", author_ru: "Феруза Тураева", role_uz: "Cake Shop", role_ru: "Cake Shop", rating: 4.5 }
    ]
  };

  const reorderData = dynamicContent?.reorder || {
    title_uz: "Tezkor qayta buyurtma",
    title_ru: "Быстрый повторный заказ",
    desc_uz: "B2B mijozlarimiz uchun oldingi buyurtmalarni bir marta bosish orqali takrorlash imkoniyati.",
    desc_ru: "Возможность для B2B клиентов повторить предыдущие заказы в один клик.",
    btn_uz: "Buyurtmani takrorlash",
    btn_ru: "Повторить заказ"
  };

  const categoriesExtraData = dynamicContent?.categories_extra_header || dynamicContent?.categories_extra || {
    title_uz: 'Kategoriyalar',
    title_ru: 'Категории',
    desc_uz: "Asosiy mahsulot yo'nalishlarimiz",
    desc_ru: 'Наши основные направления продукции',
    btn_uz: "Barchasini ko'rish",
    btn_ru: 'Посмотреть все',
  };

  const categoryMetadata = dynamicContent?.category_metadata || {};

  let displayCategories = dbCategories
    .filter(cat => categoryMetadata[cat.id]?.is_featured)
    .slice(0, 6)
    .map(cat => ({
      id: cat.id,
      title_uz: cat.name_uz || cat.name,
      title_ru: cat.name_ru || cat.name_uz || cat.name,
      desc_uz: categoryMetadata[cat.id]?.desc_uz || "",
      desc_ru: categoryMetadata[cat.id]?.desc_ru || "",
      img: cat.icon || "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=800&auto=format&fit=crop"
    }));

  if (displayCategories.length === 0) {
    displayCategories = dynamicContent?.categories_extra?.categories || [
      { id: 'bir-martalik', title_uz: 'Bir martalik idishlar', title_ru: 'Одноразовая посуда', desc_uz: "Kafelar, restoranlar va yetkazib berish xizmatlari uchun", desc_ru: "Для кафе, ресторанов и служб доставки", img: "/category-1.png" },
      { id: 'qadoqlash', title_uz: 'Qadoqlash vositalari', title_ru: 'Упаковочные материалы', desc_uz: "Karton, plyonka, skotch va qutilar", desc_ru: "Картон, пленка, скотч и коробки", img: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?q=80&w=800&auto=format&fit=crop" },
      { id: 'ximiya', title_uz: 'Maishiy va professional ximiya', title_ru: 'Бытовая и профессиональная химия', desc_uz: "Yuqori sifatli tozalash vositalari", desc_ru: "Высококачественные чистящие средства", img: "https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=800&auto=format&fit=crop" },
      { id: 'tozalash', title_uz: 'Tozalash anjomlari', title_ru: 'Уборочный инвентарь', desc_uz: "Tozalik uchun kerakli asbob-uskunalar", desc_ru: "Необходимые инструменты для уборки", img: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?q=80&w=800&auto=format&fit=crop" },
      { id: 'gigiyena', title_uz: 'Gigiyenik mahsulotlar', title_ru: 'Гигиенические товары', desc_uz: "Shaxsiy himoya va gigiyena", desc_ru: "Личная защита и гигиена", img: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=800&auto=format&fit=crop" },
      { id: 'xojalik', title_uz: "Boshqa xo'jalik mollari", title_ru: "Другие хозяйственные товары", desc_uz: "Uyingiz va biznesingiz uchun barcha kerakli mollar", desc_ru: "Все необходимые товары для дома и бизнеса", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" }
    ];
  }

  const handleQuickReorder = async () => {
    try {
      const { data: item, error } = await supabase
        .from('products')
        .select('*')
        .limit(1)
        .single();
      
      if (error || !item) {
        toast.error(language === 'uz' ? "Mahsulot topilmadi" : "Товар не найден");
        return;
      }

      const stepOpt = item.options?.find((o: any) => o.name === "Step");
      const step = stepOpt ? parseInt(stepOpt.values[0]) : 1;

      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        minOrderQuantity: item.minOrder || 1,
        step: step,
        quantity: (item.minOrder || 1) * 5
      });
      toast.success(language === 'uz' ? "Oldingi buyurtmangiz savatga qayta qo'shildi!" : "Ваш предыдущий заказ снова добавлен в корзину!");
      router.push("/cart");
    } catch (err) {
      console.error("Quick reorder error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "B2BBusiness",
            "name": "UPack",
            "url": "https://upackb2b.uz",
            "logo": "https://upackb2b.uz/logo.svg",
            "image": "https://upackb2b.uz/hero-bg.png",
            "description": "O'zbekistonda B2B qadoqlash platformasi. Sifatli qadoqlash materiallari va bir martalik idishlar ulgurji savdosi.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Toshkent",
              "addressCountry": "UZ"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Mijozlarni qo'llab-quvvatlash",
              "areaServed": "UZ",
              "availableLanguage": ["Uzbek", "Russian"]
            }
          })
        }}
      />
      
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center min-h-[calc(100vh-80px)]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay z-0"></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 shadow-xl">
              <Sparkles size={16} className="text-primary-400" />
              <span>{language === 'uz' ? heroData.badge_uz : heroData.badge_ru}</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-[6.5vw] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-2 text-center leading-[1.2] md:leading-[1.1] whitespace-nowrap">
              <span className="block">{language === 'uz' ? heroData.title1_uz : heroData.title1_ru}</span>
              <span className="block relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">{language === 'uz' ? heroData.title2_uz : heroData.title2_ru}</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-sm sm:text-lg md:text-xl lg:text-2xl text-slate-300 mt-4 sm:mt-6 mb-8 max-w-2xl mx-auto font-light leading-relaxed text-center whitespace-normal px-4">
              {language === 'uz' ? heroData.desc_uz : heroData.desc_ru}
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-16 w-full max-w-2xl mx-auto">
              <Link href="/katalog" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full shadow-premium shadow-primary-500/30 transition-all flex items-center justify-center gap-2 text-lg whitespace-nowrap"
                >
                  <Package size={20} /> {language === 'uz' ? "Katalogni ko'rish" : "Перейти в каталог"}
                </motion.button>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSampleModalOpen(true)}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 text-lg whitespace-nowrap"
              >
                <Gift size={20} /> {language === 'uz' ? "Namuna so'rash" : "Запросить образец"}
              </motion.button>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 pt-8">
              {heroData.stats.map((stat: any, idx: number) => (
                <div key={idx} className="text-center">
                  <h4 className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</h4>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">{language === 'uz' ? stat.label_uz : stat.label_ru}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">{language === 'uz' ? featuresData.title_uz : featuresData.title_ru}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">{language === 'uz' ? featuresData.desc_uz : featuresData.desc_ru}</p>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {featuresData.cards.map((feature: any, idx: number) => {
              const iconsMap: Record<string, any> = {
                Box, Truck, ShieldCheck, Leaf, Star, Clock, CheckCircle, Package
              };
              const IconComponent = iconsMap[feature.icon] || Box;

              return (
                <motion.div key={idx} variants={fadeUp} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center group">
                  <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 text-primary-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <IconComponent size={36} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{language === 'uz' ? feature.title_uz : feature.title_ru}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{language === 'uz' ? feature.desc_uz : feature.desc_ru}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="container mx-auto px-6 mb-8 text-center">
          <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">{language === 'uz' ? brandsData.title_uz : brandsData.title_ru}</h3>
        </div>
        <div className="relative w-full flex overflow-x-hidden">
          <motion.div 
            className="flex whitespace-nowrap gap-16 items-center px-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 20, repeat: Infinity }}
          >
            {[...brandsData.brands, ...brandsData.brands].map((brand: any, i: number) => (
              <div key={i} className="text-2xl font-black text-slate-300 shrink-0 select-none hover:scale-105 transition-all cursor-pointer">
                {brand.image ? (
                  <img src={brand.image} alt={brand.name} className="h-12 object-contain" />
                ) : (
                  brand.name
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">{language === 'uz' ? categoriesExtraData.title_uz || 'Kategoriyalar' : categoriesExtraData.title_ru || 'Категории'}</h2>
            <div className="flex items-end justify-between">
              <p className="text-slate-500 text-sm">{language === 'uz' ? categoriesExtraData.desc_uz || "Asosiy mahsulot yo'nalishlarimiz" : categoriesExtraData.desc_ru || 'Наши основные направления продукции'}</p>
              <Link href="/katalog" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1">{language === 'uz' ? categoriesExtraData.btn_uz || "Barchasini ko'rish" : categoriesExtraData.btn_ru || 'Посмотреть все'} <ArrowRight size={14}/></Link>
            </div>
          </div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]"
          >
            {displayCategories.slice(0, 6).map((cat: any, idx: number) => (
              <motion.div key={idx} variants={fadeUp} className={`group relative overflow-hidden rounded-xl bg-slate-900 cursor-pointer ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <img src={cat.img} alt={language === 'uz' ? cat.title_uz : cat.title_ru} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                  <div>
                    {idx === 0 && <span className="inline-block bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded mb-3">{language === 'uz' ? 'Top Sotuv' : 'Хит продаж'}</span>}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                      {language === 'uz' ? cat.title_uz : cat.title_ru}
                    </h3>
                    {cat.desc_uz && cat.desc_ru && (
                      <p className="text-slate-300 text-sm hidden sm:block">
                        {language === 'uz' ? cat.desc_uz : cat.desc_ru}
                      </p>
                    )}
                  </div>
                  {idx !== 0 && (
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 shrink-0">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
                <Link href={`/katalog?category=${cat.id}`} className="absolute inset-0 z-10"><span className="sr-only">{language === 'uz' ? cat.title_uz : cat.title_ru} {language === 'uz' ? "ko'rish" : "посмотреть"}</span></Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Reorder Banner */}
      <section className="py-12 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shrink-0">
              <History size={32} />
            </div>
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-1">
                {language === 'uz' ? reorderData.title_uz : reorderData.title_ru}
              </h3>
              <p className="text-primary-100">
                {language === 'uz' ? reorderData.desc_uz : reorderData.desc_ru}
              </p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickReorder}
            className="bg-white text-primary-600 font-bold py-4 px-8 rounded-full shadow-lg whitespace-nowrap shrink-0 hover:bg-slate-50 transition-colors"
          >
            {language === 'uz' ? reorderData.btn_uz : reorderData.btn_ru}
          </motion.button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">{language === 'uz' ? stepsData.title_uz : stepsData.title_ru}</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">{language === 'uz' ? stepsData.desc_uz : stepsData.desc_ru}</p>
          </div>
          
          {(() => {
            const sortedSteps = [...stepsData.steps].sort((a: any, b: any) => parseInt(a.num) - parseInt(b.num));
            const stepCount = sortedSteps.length;
            const gridClass = {
              1: 'grid-cols-1 max-w-sm',
              2: 'grid-cols-1 md:grid-cols-2 max-w-2xl',
              3: 'grid-cols-1 md:grid-cols-3 max-w-4xl',
              4: 'grid-cols-1 md:grid-cols-4 max-w-5xl',
              5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5 max-w-7xl',
              6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6 max-w-7xl',
            }[stepCount as 1|2|3|4|5|6] || 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6 max-w-7xl';
            const lineClass = {
              1: 'hidden',
              2: 'hidden md:block left-[25%] w-[50%]',
              3: 'hidden md:block left-[16.66%] w-[66.66%]',
              4: 'hidden md:block left-[12.5%] w-[75%]',
              5: 'hidden lg:block left-[10%] w-[80%]',
              6: 'hidden lg:block left-[8.33%] w-[83.33%]',
            }[stepCount as 1|2|3|4|5|6] || 'hidden';

            return (
              <div className={`grid gap-8 relative mx-auto ${gridClass}`}>
                <div className={`absolute top-8 h-[2px] bg-gradient-to-r from-primary-100 via-primary-400 to-primary-100 z-0 opacity-50 ${lineClass}`}></div>
                {sortedSteps.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="relative z-10 flex flex-row md:flex-col items-start md:items-center text-left md:text-center group gap-6 md:gap-0"
                  >
                    {idx !== sortedSteps.length - 1 && (
                      <div className="md:hidden absolute top-8 left-[calc(2rem-1px)] w-[2px] h-[calc(100%+2rem)] bg-gradient-to-b from-primary-100 to-primary-400 z-[-1] opacity-50"></div>
                    )}
                    <div className="w-16 h-16 shrink-0 bg-white ring-8 ring-white text-primary-600 font-black text-xl rounded-full flex items-center justify-center md:mb-6 shadow-xl shadow-primary-500/10 border-2 border-primary-100 relative">
                      {item.num}
                      <div className="absolute inset-0 rounded-full border border-primary-500/30 scale-[1.25] opacity-0 group-hover:opacity-100 animate-pulse"></div>
                    </div>
                    <div className="pt-2 md:pt-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{language === 'uz' ? item.title_uz : item.title_ru}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{language === 'uz' ? item.desc_uz : item.desc_ru}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              {language === 'uz' ? faqData.title_uz : faqData.title_ru}
            </h2>
            <p className="text-lg text-slate-500">
              {language === 'uz' ? faqData.desc_uz : faqData.desc_ru}
            </p>
          </div>
          
          <div className="space-y-4">
            {faqData.items.map((item: any, idx: number) => (
              <FAQItem 
                key={idx} 
                question={language === 'uz' ? item.q_uz : item.q_ru} 
                answer={language === 'uz' ? item.a_uz : item.a_ru} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 mb-8 border border-primary-500/30">
              <Gift size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              {language === 'uz' ? ctaData.title1_uz : ctaData.title1_ru} <br className="hidden md:block"/> {language === 'uz' ? ctaData.title2_uz : ctaData.title2_ru}
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {language === 'uz' ? ctaData.desc_uz : ctaData.desc_ru}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSampleModalOpen(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full shadow-premium shadow-primary-500/30 flex items-center justify-center gap-2 transition-all text-lg whitespace-nowrap"
              >
                <Package size={20} /> {language === 'uz' ? ctaData.btn1_uz : ctaData.btn1_ru}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://t.me/upack_admin', '_blank')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-full border border-slate-700 flex items-center justify-center gap-2 transition-all text-lg whitespace-nowrap"
              >
                <MessageSquare size={20} /> {language === 'uz' ? ctaData.btn2_uz : ctaData.btn2_ru}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
              {language === 'uz' ? reviewsData.title_uz : reviewsData.title_ru}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              {language === 'uz' ? reviewsData.desc_uz : reviewsData.desc_ru}
            </p>
          </div>
          
          <motion.div 
            ref={reviewsScrollRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            {reviewsData.reviews.map((review: any, idx: number) => (
              <motion.div key={idx} variants={fadeUp} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 shrink-0 w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] snap-start flex flex-col">
                <div className="flex text-warning mb-4">
                  {[...Array(Math.floor(review.rating))].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
                  {review.rating % 1 !== 0 && <StarHalf fill="currentColor" size={20} />}
                </div>
                <p className="text-slate-700 italic mb-8 leading-relaxed">
                  "{language === 'uz' ? review.text_uz : review.text_ru}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 font-bold rounded-full flex items-center justify-center text-lg shrink-0">
                    {language === 'uz' ? (review.author_uz ? review.author_uz[0] : 'U') : (review.author_ru ? review.author_ru[0] : 'U')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      {language === 'uz' ? review.author_uz : review.author_ru}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {language === 'uz' ? review.role_uz : review.role_ru}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Sample Request Modal */}
      <AnimatePresence>
        {isSampleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsSampleModalOpen(false)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setIsSampleModalOpen(false)} 
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Package size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{language === 'uz' ? 'Namuna buyurtma qilish' : 'Заказ образцов'}</h3>
              <p className="text-slate-500 mb-6">{language === 'uz' ? "Aloqa ma'lumotlaringizni qoldiring, menejerimiz sizga bepul namunalar to'plamini yuboradi." : "Оставьте свои контактные данные, и наш менеджер отправит вам бесплатный набор образцов."}</p>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const nameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
                const phoneInput = form.querySelector('input[type="tel"]') as HTMLInputElement;
                
                const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                const originalText = submitBtn.innerText;
                submitBtn.innerText = language === 'uz' ? 'Yuborilmoqda...' : 'Отправка...';
                submitBtn.disabled = true;

                try {
                  const res = await fetch('/api/sample', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: nameInput.value, phone: phoneInput.value })
                  });
                  const json = await res.json();
                  if (json.success) {
                    setIsSampleModalOpen(false);
                    toast.success(language === 'uz' ? "Arizangiz qabul qilindi! Menejerimiz tez orada bog'lanadi." : "Ваша заявка принята! Менеджер свяжется с вами в ближайшее время.");
                  } else {
                    toast.error(json.message || "Xatolik yuz berdi");
                  }
                } catch (err) {
                  toast.error("Xatolik yuz berdi");
                } finally {
                  submitBtn.innerText = originalText;
                  submitBtn.disabled = false;
                }
              }} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{language === 'uz' ? 'Ismingiz' : 'Ваше имя'}</label>
                  <input required type="text" placeholder={language === 'uz' ? "Masalan: Azizbek" : "Например: Азизбек"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{language === 'uz' ? 'Telefon raqam' : 'Номер телефона'}</label>
                  <input required type="tel" placeholder="+998 90 123 45 67" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" />
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl hover:bg-primary-700 transition-colors mt-2 shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {language === 'uz' ? 'Ariza qoldirish' : 'Отправить заявку'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
