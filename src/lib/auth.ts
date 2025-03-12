// Este arquivo contém funções que usam bcryptjs, que não é compatível com o Edge Runtime
// Certifique-se de que as rotas que usam estas funções não sejam executadas no Edge Runtime

import bcrypt from "bcryptjs";
import * as jose from "jose";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

// Função para criar uma chave secreta a partir da string do .env
async function getSecretKey() {
  const secret = process.env.NEXTAUTH_SECRET || "tigrinho-bet-secret-key-2025";
  return new TextEncoder().encode(secret);
}

/**
 * Gera um hash para a senha
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compara uma senha com um hash
 */
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Gera um token JWT para o usuário
 */
export async function generateToken(userId: string): Promise<string> {
  const secretKey = await getSecretKey();

  // Criar o token JWT usando jose
  const token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);

  return token;
}

/**
 * Verifica e decodifica um token JWT
 */
export async function verifyToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const secretKey = await getSecretKey();

    // Verificar o token JWT usando jose
    const { payload } = await jose.jwtVerify(token, secretKey);

    if (payload.userId && typeof payload.userId === "string") {
      return { userId: payload.userId };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Busca um usuário pelo ID
 */
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

/**
 * Obtém o usuário autenticado a partir do token JWT nos cookies
 */
export async function getAuthenticatedUser(req?: NextRequest) {
  let token: string | undefined;

  if (req) {
    // Se for uma API route, obter o token do cookie na requisição
    token = req.cookies.get("token")?.value;
  } else {
    // Se for uma Server Component, não podemos usar cookies() diretamente
    // Esta função só deve ser chamada a partir de API routes
    console.warn(
      "getAuthenticatedUser foi chamada sem um objeto Request. Esta função só deve ser usada em API routes."
    );
    return null;
  }

  if (!token) {
    return null;
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return null;
  }

  const user = await getUserById(decoded.userId);
  return user;
}
