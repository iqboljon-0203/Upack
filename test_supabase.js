const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if(key) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '').replace('\r', '');
  return acc;
}, {});
const { createClient } = require('C:/Users/iqbol/OneDrive/Desktop/Upack/node_modules/@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const data = {
    badge_uz: "O'zbekistonda 1-raqamli B2B qadoqlash platformasi",
    badge_ru: "Платформа упаковки B2B №1 в Узбекистане",
    title1_uz: "Sanoat va Qadoqlash Uchun",
    title1_ru: "Для промышленности и упаковки",
    title2_uz: "Professional Yechim",
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
supabase.from('site_content').upsert({ id: 'hero', data, updated_at: new Date().toISOString() }).then(console.log);
