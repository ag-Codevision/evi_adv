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

const candidates = [
  envVars['DATABASE_URL'],
  `postgresql://postgres.${projectRef}:${encodedPass}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres:${encodedPass}@db.${projectRef}.supabase.co:5432/postgres`,
  `postgresql://postgres.${projectRef}:${encodedPass}@aws-0-sa-east-1.pooler.supabase.com:65432/postgres?connect_timeout=10`
].filter(Boolean);

async function runHardening() {
  const sqlPath = path.resolve(__dirname, '../supabase/security_hardening.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');
  const { Client } = pg;

  let executed = false;

  for (let i = 0; i < candidates.length; i++) {
    const url = candidates[i];
    console.log(`[Tentativa ${i + 1}/${candidates.length}] Conectando ao PostgreSQL...`);

    const client = new Client({
      connectionString: url,
      connectionTimeoutMillis: 8000,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(' Conectado com sucesso ao Supabase!');
      console.log('Aplicando script de blindagem de segurança (security_hardening.sql)...');
      
      await client.query(sql);
      console.log(' Políticas de segurança (RLS) e função is_admin() aplicadas com sucesso!');
      await client.end();
      executed = true;
      break;
    } catch (err) {
      console.warn(` Falha na tentativa ${i + 1}: ${err.message}`);
      try { await client.end(); } catch (_) {}
    }
  }

  if (!executed) {
    console.warn('\n Não foi possível conectar diretamente pela rede local. O arquivo "supabase/security_hardening.sql" está pronto e pode ser executado diretamente no SQL Editor do painel Supabase.');
  }
}

runHardening().catch(console.error);
