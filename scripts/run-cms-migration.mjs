import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega .env manualmente
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      envVars[key] = val;
    }
  }
});

const password = 'Omeg@256489@256489';
const encodedPass = encodeURIComponent(password);
const projectRef = 'mrxvubobgujdzdyunsvp';

// Lista de URLs para testar portas e hosts disponíveis no Supabase
const candidates = [
  // Opção 1: Session Pooler na porta padrão 5432 (não bloqueada por ISPs)
  `postgresql://postgres.${projectRef}:${encodedPass}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
  // Opção 2: Conexão direta padrão do PostgreSQL
  `postgresql://postgres:${encodedPass}@db.${projectRef}.supabase.co:5432/postgres`,
  // Opção 3: Transaction Pooler porta 65432
  `postgresql://postgres.${projectRef}:${encodedPass}@aws-0-sa-east-1.pooler.supabase.com:65432/postgres?connect_timeout=10`
];

async function tryConnectAndRun() {
  const { Client } = pg;

  for (let i = 0; i < candidates.length; i++) {
    const url = candidates[i];
    const hostInfo = url.split('@')[1];
    console.log(`\n[Tentativa ${i + 1}/${candidates.length}] Testando conexão com: ${hostInfo}...`);

    const client = new Client({
      connectionString: url,
      connectionTimeoutMillis: 8000,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(` Conectado com sucesso através da tentativa ${i + 1}!`);

      const sqlPath = path.resolve(__dirname, '../supabase/cms_schema.sql');
      const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

      console.log('Executando script cms_schema.sql...');
      await client.query(sqlScript);

      console.log(' Migração do CMS executada com sucesso total no Supabase!');
      const res = await client.query('SELECT count(*) FROM public.site_contents;');
      console.log(` Linhas cadastradas em public.site_contents: ${res.rows[0].count}`);

      await client.end();
      return true;
    } catch (err) {
      console.log(`❌ Falha nesta tentativa: ${err.message || err.code}`);
      try { await client.end(); } catch {}
    }
  }

  return false;
}

tryConnectAndRun().then(success => {
  process.exit(success ? 0 : 1);
});
