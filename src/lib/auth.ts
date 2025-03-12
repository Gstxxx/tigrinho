import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { prisma } from './prisma';

// Função para criar uma chave secreta a partir da string do .env
async function getSecretKey() {
  const secret = process.env.NEXTAUTH_SECRET || 'tigrinho-bet-secret-key-2025';
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function generateToken(userId: string): Promise<string> {
  const secretKey = await getSecretKey();
  
  // Criar o token JWT usando jose
  const token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
  
  console.log('Token gerado com jose:', token.substring(0, 20) + '...');
  return token;
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const secretKey = await getSecretKey();
    
    // Verificar o token JWT usando jose
    const { payload } = await jose.jwtVerify(token, secretKey);
    console.log('Token verificado com jose:', payload);
    
    if (payload.userId && typeof payload.userId === 'string') {
      return { userId: payload.userId };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
      createdAt: true,
      updatedAt: true,
    },
  });
} 