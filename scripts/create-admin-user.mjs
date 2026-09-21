import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
    }
  }
});

const supabaseUrl = env['SUPABASE_URL'] || env['NEXT_PUBLIC_SUPABASE_URL'];
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausente.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin(email, password) {
  console.log(`Criando usuário administrador: ${email}...`);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin', name: 'Administrador EVI' }
  });

  if (error) {
    console.error('Erro ao criar admin:', error.message);
    return false;
  }

  console.log(' Usuário administrador criado com sucesso!');
  console.log('ID:', data.user.id);
  console.log('E-mail:', data.user.email);
  return true;
}

const targetEmail = process.argv[2] || 'admin@eviadvogados.com.br';
const targetPass = process.argv[3] || 'EviAdv@2026';

createAdmin(targetEmail, targetPass).then(ok => process.exit(ok ? 0 : 1));
