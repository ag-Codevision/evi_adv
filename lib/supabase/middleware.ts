import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Importante: NÃO remova getClaims ou getUser(), pois isso atualiza a sessão no Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Validação de acesso ao painel administrativo (/admin)
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname.startsWith('/admin/login');

  if (isAdminPath) {
    if (!user && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    if (user) {
      const adminEmails = (process.env.ADMIN_EMAILS || 'admin@eviadvogados.com.br')
        .split(',')
        .map((e) => e.trim().toLowerCase());

      const userEmail = user.email?.toLowerCase() || '';
      const hasAdminRole =
        user.app_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'admin' ||
        adminEmails.includes(userEmail);

      // Usuário autenticado sem permissões de administrador tentando acessar o painel
      if (!hasAdminRole && !isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }

      // Se já é administrador autenticado e acessa a página de login, redireciona para o painel
      if (hasAdminRole && isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
