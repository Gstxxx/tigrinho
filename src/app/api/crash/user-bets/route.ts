import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";

// GET: Obter o histórico de apostas do usuário em jogos Crash
export async function GET(request: Request) {
  try {
    // Verificar se o usuário está autenticado
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar as últimas 20 apostas do usuário
    const bets = await prisma.crashBet.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      include: {
        game: {
          select: {
            id: true,
            crashPoint: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Formatar as apostas para incluir informações relevantes
    const formattedBets = bets.map((bet) => ({
      id: bet.id,
      amount: bet.amount,
      status: bet.status,
      cashoutMultiplier: bet.cashoutMultiplier,
      autoWithdrawAt: bet.autoWithdrawAt,
      profit: bet.profit,
      createdAt: bet.createdAt,
      game: {
        id: bet.game.id,
        crashPoint: bet.game.crashPoint,
        status: bet.game.status,
        createdAt: bet.game.createdAt,
      },
    }));

    return NextResponse.json({
      bets: formattedBets,
    });
  } catch (error) {
    console.error("Erro ao buscar histórico de apostas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de apostas" },
      { status: 500 }
    );
  }
}
