const fs = require('fs');
const path = require('path');

function fixRouteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('requireSessionUser')) return false;

  // user! ile null assertion ekle
  content = content.replace(
    /userId: user\.id/g,
    'userId: user!.id'
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
      const updated = fixRouteFile(fullPath);
      if (updated) console.log('✓', fullPath);
    }
  }
}

walkDir('src/app/api');
console.log('\nDone!');
