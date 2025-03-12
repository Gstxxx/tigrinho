import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { TransactionType } from "@prisma/client";

// POST: Criar uma nova aposta
export async function POST(req: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter os dados da requisição
    const { gameId, amount, autoWithdrawAt } = await req.json();

    // Validar os dados
    if (!gameId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Buscar o usuário e o jogo
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem saldo suficiente
    if (userData.balance < amount) {
      return NextResponse.json(
        { error: "Saldo insuficiente" },
        { status: 400 }
      );
    }

    // Buscar o jogo
    const game = await prisma.crashGame.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Jogo não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o jogo está aceitando apostas
    if (game.status !== "PENDING") {
      return NextResponse.json(
        { error: "O jogo não está aceitando apostas" },
        { status: 400 }
      );
    }

    // Verificar se o usuário já tem uma aposta neste jogo
    const existingBet = await prisma.crashBet.findFirst({
      where: {
        gameId,
        userId: user.id,
      },
    });

    if (existingBet) {
      return NextResponse.json(
        { error: "Você já tem uma aposta neste jogo" },
        { status: 400 }
      );
    }

    // Criar a aposta e atualizar o saldo do usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar a aposta
      const bet = await tx.crashBet.create({
        data: {
          amount,
          status: "ACTIVE",
          autoWithdrawAt,
          userId: user.id,
          gameId,
        },
      });

      // Atualizar o saldo do usuário
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Registrar a transação
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: -amount,
          type: "BET_PLACEMENT" as TransactionType,
        },
      });

      return { bet, user: updatedUser };
    });

    return NextResponse.json({
      message: "Aposta realizada com sucesso",
      bet: result.bet,
      balance: result.user.balance,
    });
  } catch (error) {
    console.error("Erro ao criar aposta:", error);
    return NextResponse.json(
      { error: "Erro ao criar aposta" },
      { status: 500 }
    );
  }
}

// PATCH: Realizar cashout de uma aposta
export async function PATCH(req: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter os dados da requisição
    const { betId, multiplier } = await req.json();

    // Validar os dados
    if (!betId || !multiplier || multiplier <= 1) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Buscar a aposta
    const bet = await prisma.crashBet.findUnique({
      where: { id: betId },
      include: {
        game: true,
      },
    });

    if (!bet) {
      return NextResponse.json(
        { error: "Aposta não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se a aposta pertence ao usuário
    if (bet.userId !== user.id) {
      return NextResponse.json(
        { error: "Esta aposta não pertence a você" },
        { status: 403 }
      );
    }

    // Verificar se a aposta está ativa
    if (bet.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Esta aposta não está ativa" },
        { status: 400 }
      );
    }

    // Verificar se o jogo está em andamento
    if (bet.game.status !== "RUNNING") {
      return NextResponse.json(
        { error: "O jogo não está em andamento" },
        { status: 400 }
      );
    }

    // Verificar se o multiplicador é válido
    // Durante o jogo em andamento, não verificamos o crashPoint
    // pois ele só é definido quando o jogo termina
    console.log("Validando multiplicador:", {
      multiplier,
      crashPoint: bet.game.crashPoint,
      gameStatus: bet.game.status,
    });

    // Calcular o lucro
    const profit = bet.amount * multiplier - bet.amount;

    // Atualizar a aposta e o saldo do usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar a aposta
      const updatedBet = await tx.crashBet.update({
        where: { id: betId },
        data: {
          status: "CASHED_OUT",
          cashoutMultiplier: multiplier,
          profit,
        },
      });

      // Atualizar o saldo do usuário (devolver o valor apostado + lucro)
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          balance: {
            increment: bet.amount * multiplier,
          },
        },
      });

      // Registrar a transação
      await tx.transaction.create({
        data: {
          userId: user.id,
          amount: bet.amount * multiplier,
          type: "BET_SETTLEMENT" as TransactionType,
        },
      });

      return { bet: updatedBet, user: updatedUser };
    });

    return NextResponse.json({
      message: "Cashout realizado com sucesso",
      bet: result.bet,
      balance: result.user.balance,
    });
  } catch (error) {
    console.error("Erro ao realizar cashout:", error);
    return NextResponse.json(
      { error: "Erro ao realizar cashout" },
      { status: 500 }
    );
  }
}
