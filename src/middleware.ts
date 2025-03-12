import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Rotas de API que requerem autenticação
  const protectedApiPaths = [
    '/api/bets',
    '/api/users/me',
    '/api/transactions',
  ];

  // Rotas de páginas que requerem autenticação
  const protectedPagePaths = [
    '/dashboard',
    '/bets',
    '/events',
  ];

  // Verificar se a rota atual é uma API protegida
  const isProtectedApiPath = protectedApiPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Verificar se a rota atual é uma página protegida
  const isProtectedPagePath = protectedPagePaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Se não for uma rota protegida, continuar normalmente
  if (!isProtectedApiPath && !isProtectedPagePath) {
    return NextResponse.next();
  }

  // Verificar o token de autenticação
  const token = request.cookies.get('auth-token')?.value;
  
  console.log('Middleware - Rota:', request.nextUrl.pathname);
  console.log('Middleware - Token:', token ? 'Presente' : 'Ausente');

  if (!token) {
    // Para rotas de API, retornar erro 401
    if (isProtectedApiPath) {
      console.log('Middleware - Erro 401: Token ausente (API)');
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      );
    }
    
    // Para rotas de páginas, redirecionar para o login
    console.log('Middleware - Redirecionando para login: Token ausente (Página)');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verificar o token (agora é uma função assíncrona)
    const payload = await verifyToken(token);
    console.log('Middleware - Payload:', payload ? `Válido (userId: ${payload.userId})` : 'Inválido');

    if (!payload) {
      // Para rotas de API, retornar erro 401
      if (isProtectedApiPath) {
        console.log('Middleware - Erro 401: Token inválido (API)');
        return NextResponse.json(
          { error: 'Token inválido ou expirado. Faça login novamente.' },
          { status: 401 }
        );
      }
      
      // Para rotas de páginas, redirecionar para o login
      console.log('Middleware - Redirecionando para login: Token inválido (Página)');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Adicionar o userId ao cabeçalho da requisição
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    console.log('Middleware - Autenticação bem-sucedida, userId:', payload.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Middleware - Erro ao verificar token:', error);
    
    // Para rotas de API, retornar erro 401
    if (isProtectedApiPath) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado. Faça login novamente.' },
        { status: 401 }
      );
    }
    
    // Para rotas de páginas, redirecionar para o login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/api/bets/:path*',
    '/api/users/me',
    '/api/transactions/:path*',
    '/dashboard/:path*',
    '/dashboard',
    '/bets/:path*',
    '/bets',
    '/events/:path*',
    '/events',
  ],
}; 