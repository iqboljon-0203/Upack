const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('app/admin');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // The corrupted line looks like: fetch(/api/admin/content?id=features&t=)
  // We need to fix it to: fetch(`/api/admin/content?id=features&t=${Date.now()}`)
  content = content.replace(/fetch\(\/api\/admin\/content\?id=([a-zA-Z0-9_]+)&t=\)/g, 'fetch(`/api/admin/content?id=$1&t=${Date.now()}`)');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed syntax error in', file);
  }
});
