/**
 * ビルド用プレースホルダーアイコン・スプラッシュを生成するスクリプト
 * 実行: node scripts/generate-placeholder-icons.js
 *
 * 本番用には task25/task26 で正式な画像に差し替えてください。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

// 1024x1024 のプレースホルダー画像（placeholder.com のシンプルな画像）
const PLACEHOLDER_1024 = 'https://placehold.co/1024x1024/121212/2a73ea/png?text=Putt+Tempo';
const PLACEHOLDER_48 = 'https://placehold.co/48x48/121212/2a73ea/png?text=PT';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  console.log('Downloading placeholder icon (1024x1024)...');
  const icon1024 = await download(PLACEHOLDER_1024);
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), icon1024);
  fs.writeFileSync(path.join(ASSETS_DIR, 'adaptive-icon.png'), icon1024);
  fs.writeFileSync(path.join(ASSETS_DIR, 'splash-icon.png'), icon1024);
  console.log('Created icon.png, adaptive-icon.png, splash-icon.png');

  console.log('Downloading favicon (48x48)...');
  const favicon = await download(PLACEHOLDER_48);
  fs.writeFileSync(path.join(ASSETS_DIR, 'favicon.png'), favicon);
  console.log('Created favicon.png');

  console.log('Done. You can replace these with real assets later (task25, task26).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
