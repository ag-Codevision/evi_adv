// Teste direto de conectividade: NVIDIA NIM API + Supabase
const nvidiaKey = process.env.NVIDIA_API_KEY;
const nvidiaModel = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

console.log('--- TESTE DE CONFIGURAÇÃO ---');
console.log('NVIDIA Key presente:', !!nvidiaKey, nvidiaKey ? `(${nvidiaKey.substring(0, 10)}...)` : '');
console.log('NVIDIA Model:', nvidiaModel);
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key presente:', !!supabaseKey);

async function testNvidia() {
  console.log('\nTestando chamada para NVIDIA NIM...');
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${nvidiaKey}`,
      },
      body: JSON.stringify({
        model: nvidiaModel,
        messages: [
          { role: 'user', content: 'Diga em uma frase por que a recuperação judicial é estratégica para empresas no agronegócio.' }
        ],
        max_tokens: 60,
      }),
    });

    console.log('Status NVIDIA:', res.status, res.statusText);
    if (!res.ok) {
      const err = await res.text();
      console.error('Erro NVIDIA:', err);
    } else {
      const data = await res.json();
      console.log('Resposta NVIDIA:', data.choices[0]?.message?.content);
    }
  } catch (e) {
    console.error('Exceção ao chamar NVIDIA:', e.message);
  }
}

async function testSupabase() {
  console.log('\nTestando conexão com Supabase (tabela categories)...');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    console.log('Status Supabase:', res.status, res.statusText);
    if (res.ok) {
      const data = await res.json();
      console.log('Categorias no Supabase:', data);
    } else {
      const err = await res.text();
      console.log('Resposta Supabase (se tabela ainda não criada, rode supabase/schema.sql no editor):', err);
    }
  } catch (e) {
    console.error('Exceção ao chamar Supabase:', e.message);
  }
}

async function run() {
  await testNvidia();
  await testSupabase();
}

run();
