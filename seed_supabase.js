import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// We need the SERVICE_ROLE_KEY to bypass RLS and insert data
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzeG10eHZyeGtkZ3pyZ3dzc3NlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTc3NTU2NCwiZXhwIjoyMDk3MzUxNTY0fQ.aqwiwoFhYGMwVYEYm1HeKSHO65u9f-sqei6r5RLT-Hg';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log('Starting seed process...');

  try {
    // 1. Kategoriyalarni tayyorlaymiz
    const categories = [
      { id: 'qadoqlash', name_uz: 'Qadoqlash', name_ru: 'Упаковка', icon: 'Package' },
      { id: 'ximiya', name_uz: 'Maishiy ximiya', name_ru: 'Бытовая химия', icon: 'Droplets' },
      { id: 'qogoz', name_uz: "Qog'oz mahsulotlari", name_ru: 'Бумажная продукция', icon: 'FileText' },
      { id: 'bir-martalik', name_uz: 'Bir martalik idishlar', name_ru: 'Одноразовая посуда', icon: 'Coffee' },
      { id: 'xoz', name_uz: "Xo'jalik mollari", name_ru: 'Хоз. товары', icon: 'ShoppingBag' }
    ];

    console.log('Inserting categories...');
    const { error: catError } = await supabase
      .from('categories')
      .upsert(categories);

    if (catError) throw catError;
    console.log('Categories inserted successfully.');

    // 2. Mahsulotlarni o'qiymiz
    const productsPath = path.resolve(__dirname, 'telegram_products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    console.log(`Found ${productsData.length} products to insert.`);

    // Map properties to match Supabase table exactly
    const productsToInsert = productsData.map(p => ({
      id: p.id,
      name: p.name,
      full_desc: p.full_desc,
      category_id: p.category,
      price: p.price,
      unit: p.unit || 'dona',
      minOrder: p.minOrder || 1,
      inStock: p.inStock !== false,
      image: p.image
    }));

    console.log('Inserting products...');
    const { error: prodError } = await supabase
      .from('products')
      .upsert(productsToInsert);

    if (prodError) throw prodError;
    console.log('Products inserted successfully.');

    console.log('Seed completed successfully! 🎉');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

seed();
