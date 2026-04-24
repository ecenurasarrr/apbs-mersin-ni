const fs = require('fs');
const path = require('path');

// getDefaultUser() -> requireSessionUser() ile değiştir
function updateRouteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('getDefaultUser')) return false;

  // import güncelle
  content = content.replace(
    "import { getDefaultUser } from '@/lib/api-helpers';",
    "import { requireSessionUser } from '@/lib/api-helpers';"
  );

  // POST handler içindeki getDefaultUser kullanımını değiştir
  content = content.replace(
    /const user = await getDefaultUser\(\);/g,
    `const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;`
  );

  fs.writeFileSync(filePath, content);
  return true;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file === 'route.ts') {
      const updated = updateRouteFile(fullPath);
      if (updated) console.log('✓', fullPath);
    }
  }
}

walkDir('src/app/api');
console.log('\nDone!');
