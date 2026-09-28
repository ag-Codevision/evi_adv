import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

function loadEnv() {
  const content = fs.readFileSync('.env', 'utf8');
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

async function run() {
  const env = loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data, error } = await supabase
    .from('site_contents')
    .select('*')
    .eq('page', 'imprensa');

  console.log('Registros em site_contents para imprensa:', data?.length || 0);
  if (data && data.length > 0) {
    for (const r of data) {
      console.log('--------------------------------------------------');
      console.log('Key:', r.field_key);
      try {
        const parsed = JSON.parse(r.content_value);
        console.log('Title:', parsed.title);
        console.log('FeaturedImage:', parsed.featuredImage);
        console.log('BodyImages:', parsed.bodyImages);
      } catch (e) {
        console.log('Raw:', r.content_value);
      }
    }
  const { data: detailData } = await supabase
    .from('site_contents')
    .select('*')
    .eq('page', 'imprensa_detail');

  console.log('Overrides em imprensa_detail:', detailData?.length || 0);
  if (detailData && detailData.length > 0) {
    for (const r of detailData) {
      console.log('Detail Key:', r.section, r.field_key, r.content_value);
    }
  }
}

run();
