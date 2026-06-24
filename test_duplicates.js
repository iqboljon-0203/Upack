const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if(key) acc[key.trim()] = val.join('=').trim().replace(/['"]/g, '').replace('\r', '');
  return acc;
}, {});
const { createClient } = require('C:/Users/iqbol/OneDrive/Desktop/Upack/node_modules/@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

supabase.from('site_content').select('*').eq('id', 'hero').then(res => {
  console.log('Number of rows with id hero:', res.data.length);
  if (res.data.length > 1) {
    console.log('DUPLICATES DETECTED!');
  }
  console.log(res.data);
});
