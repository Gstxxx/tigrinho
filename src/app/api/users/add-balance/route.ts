import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

// POST: Adicionar saldo ao usuário
export async function POST(request: Request) {
  try {
    // Verificar se o usuário está autenticado
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter os dados da requisição
    const { amount } = await request.json();

    // Validar os dados
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
    }

    // Atualizar o saldo do usuário
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Registrar a transação
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: amount,
        type: "DEPOSIT",
      },
    });

    return NextResponse.json({
      message: "Saldo adicionado com sucesso",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        balance: updatedUser.balance,
      },
    });
  } catch (error) {
    console.error("Erro ao adicionar saldo:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar saldo" },
      { status: 500 }
    );
  }
}
