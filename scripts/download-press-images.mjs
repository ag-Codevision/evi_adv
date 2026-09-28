import fs from 'fs';
import path from 'path';

const pressDataPath = path.resolve('lib/press-data.ts');
const targetDir = path.resolve('public/img/imprensa');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const content = fs.readFileSync(pressDataPath, 'utf8');
const urls = [...new Set(content.match(/https?:\/\/[^\s"',]+/g))].filter(u => u.includes('wp-content'));

console.log(`Encontradas ${urls.length} URLs de wp-content:`);
urls.forEach(u => console.log(' - ' + u));

async function download(url, filename) {
  const dest = path.join(targetDir, filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log(`[JÁ EXISTE] ${filename}`);
    return true;
  }

  // Tenta Wayback Machine
  const waybackUrl = `https://web.archive.org/web/2/${url}`;
  try {
    console.log(`Baixando via Wayback: ${filename}...`);
    const res = await fetch(waybackUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length > 500) {
        fs.writeFileSync(dest, buffer);
        console.log(`✅ [SUCESSO] ${filename} (${buffer.length} bytes)`);
        return true;
      }
    }
  } catch (err) {
    console.error(`Erro ao baixar ${url}:`, err.message);
  }

  // Tenta variação com www ou http
  const altUrl = url.replace('https://evi.adv.br', 'http://www.evi.adv.br');
  try {
    const resAlt = await fetch(`https://web.archive.org/web/2/${altUrl}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (resAlt.ok) {
      const buffer = Buffer.from(await resAlt.arrayBuffer());
      if (buffer.length > 500) {
        fs.writeFileSync(dest, buffer);
        console.log(`✅ [SUCESSO ALT] ${filename} (${buffer.length} bytes)`);
        return true;
      }
    }
  } catch (err) {
    // ignore
  }

  console.log(`❌ [FALHA] Não foi possível recuperar ${filename}`);
  return false;
}

async function run() {
  for (const u of urls) {
    const rawName = path.basename(new URL(u).pathname);
    const sanitizedName = decodeURIComponent(rawName)
      .replace(/[\s&]+/g, '-')
      .replace(/[^a-zA-Z0-9.\-_]/g, '');
    await download(u, sanitizedName);
  }
}

run();
