import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePasswords, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login - Tentativa de login:', email);

    // Validação básica
    if (!email || !password) {
      console.log('Login - Erro: Email ou senha ausentes');
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('Login - Erro: Usuário não encontrado');
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar a senha
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      console.log('Login - Erro: Senha inválida');
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Gerar token JWT (agora é uma função assíncrona)
    const token = await generateToken(user.id);
    console.log('Login - Token gerado para usuário:', user.id);

    // Criar resposta com cookie
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    });

    // Definir o cookie com o token
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: false, // Alterado para false em ambiente de desenvolvimento
      sameSite: 'lax', // Adicionado para garantir que o cookie seja enviado em navegações
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    console.log('Login - Cookie definido:', {
      name: 'auth-token',
      value: token ? 'Token presente' : 'Token ausente',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json(
      { error: 'Erro ao processar o login' },
      { status: 500 }
    );
  }
} 