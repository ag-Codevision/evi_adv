import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('site_contents')
      .select('page, section, field_key, content_value, content_type, metadata');

    if (error) {
      console.error('Erro ao consultar site_contents no Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const contents: Record<string, { value: string; metadata?: any; contentType?: string }> = {};
    (data || []).forEach((item) => {
      const key = `${item.page}.${item.section}.${item.field_key}`;
      contents[key] = {
        value: item.content_value,
        metadata: item.metadata || {},
        contentType: item.content_type || 'text',
      };
    });

    return NextResponse.json(
      { contents },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Falha inesperada na rota GET /api/site-contents:', err);
    return NextResponse.json({ error: err.message || 'Erro inesperado' }, { status: 500 });
  }
}
