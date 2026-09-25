import fs from 'fs';
import path from 'path';

// Carrega variáveis do arquivo .env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const apiKey = env.CRONJOB_API_KEY || process.env.CRONJOB_API_KEY;
  const cronSecret = env.CRON_SECRET || 'c593749da9104553bbd4a708c03062c8d0710350ca4fac707f4e0ad9e653d4dc';
  const targetUrl = `https://www.evi.adv.br/api/cron/auto-blog?key=${cronSecret}`;

  if (!apiKey) {
    console.error('❌ ERRO: CRONJOB_API_KEY não encontrada no arquivo .env!');
    console.log('👉 Adicione sua chave em .env como: CRONJOB_API_KEY=sua_chave_aqui');
    process.exit(1);
  }

  console.log('🔍 Conectando à API do Cron-Job.org...');

  try {
    // 1. Listar jobs existentes para checar se já existe um job do EVI Advogados
    const listRes = await fetch('https://api.cron-job.org/jobs', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!listRes.ok) {
      const errText = await listRes.text();
      console.error(`❌ Erro ao autenticar no Cron-Job.org (${listRes.status}):`, errText);
      process.exit(1);
    }

    const listData = await listRes.json();
    const existingJob = listData.jobs?.find(j => j.url?.includes('/api/cron/auto-blog') || j.title?.includes('EVI Advogados'));

    const jobPayload = {
      job: {
        url: targetUrl,
        enabled: true,
        title: 'EVI Advogados - Robô Editorial de IA',
        saveResponses: true,
        requestMethod: 0, // GET
        schedule: {
          timezone: 'America/Sao_Paulo',
          hours: [-1], // todas as horas
          mdays: [-1], // todos os dias do mês
          minutes: [0, 30], // a cada 30 minutos (00 e 30 de Brasília)
          months: [-1],
          wdays: [-1] // todos os dias da semana
        },
        requestTimeout: 60
      }
    };

    if (existingJob) {
      console.log(`ℹ️ Job existente encontrado (ID: ${existingJob.jobId}). Atualizando configurações...`);
      const updateRes = await fetch(`https://api.cron-job.org/jobs/${existingJob.jobId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobPayload)
      });

      if (!updateRes.ok) {
        console.error('❌ Erro ao atualizar o job:', await updateRes.text());
        process.exit(1);
      }
      console.log('✅ Job atualizado com sucesso no Cron-Job.org!');
      console.log(`🎯 URL de disparo: ${targetUrl}`);
      console.log('⏰ Frequência: A cada 30 minutos (Horário de Brasília)');
    } else {
      console.log('✨ Criando novo cron job no Cron-Job.org...');
      const createRes = await fetch('https://api.cron-job.org/jobs', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobPayload)
      });

      if (!createRes.ok) {
        console.error('❌ Erro ao criar o job:', await createRes.text());
        process.exit(1);
      }
      const createData = await createRes.json();
      console.log(`✅ Novo job criado com sucesso (Job ID: ${createData.jobId})!`);
      console.log(`🎯 URL de disparo: ${targetUrl}`);
      console.log('⏰ Frequência: A cada 30 minutos (Horário de Brasília)');
    }
  } catch (err) {
    console.error('❌ Falha na comunicação com a API do Cron-Job.org:', err);
    process.exit(1);
  }
}

main();
