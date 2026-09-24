import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

async function check() {
  const env = loadEnv();
  const res = await fetch('https://api.cron-job.org/jobs/8504168', {
    headers: { 'Authorization': `Bearer ${env.CRONJOB_API_KEY}` }
  });
  const data = await res.json();
  console.log('--- DETALHES DO CRON JOB ---');
  console.log('ID:', data.jobDetails?.jobId);
  console.log('Título:', data.jobDetails?.title);
  console.log('Status Ativo:', data.jobDetails?.enabled);
  console.log('Fuso Horário:', data.jobDetails?.schedule?.timezone);
  console.log('Minutos Agendados:', data.jobDetails?.schedule?.minutes);
  console.log('Timeout (segundos):', data.jobDetails?.requestTimeout);
}

check();
