import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Criar usuário de teste
  const hashedPassword = await hashPassword("123456");

  const user = await prisma.user.upsert({
    where: { email: "teste@exemplo.com" },
    update: {},
    create: {
      name: "Usuário Teste",
      email: "teste@exemplo.com",
      password: hashedPassword,
      balance: 1000,
    },
  });

  console.log("Usuário criado:", user.name);

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
