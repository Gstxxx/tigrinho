import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  generateGameHash,
  generateCrashPoint,
  generateSeedFromHash,
} from "@/lib/crash";
import { CrashBet } from "@prisma/client";

// GET: Obter o jogo atual ou criar um novo se não existir
export async function GET() {
  try {
    // Buscar o jogo mais recente (pendente, em andamento ou recentemente finalizado)
    const latestGame = await prisma.crashGame.findFirst({
      where: {
        OR: [
          { status: "PENDING" },
          { status: "RUNNING" },
          {
            status: "CRASHED",
            createdAt: {
              gte: new Date(Date.now() - 10000), // Jogos finalizados nos últimos 10 segundos
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Se não houver jogo pendente, em andamento ou recentemente finalizado, criar um novo
    if (!latestGame) {
      // Verificar se já existe algum jogo sendo criado (para evitar condições de corrida)
      const existingPendingGame = await prisma.crashGame.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      });

      if (existingPendingGame) {
        return NextResponse.json({
          game: existingPendingGame,
          bets: [],
        });
      }

      const hash = generateGameHash();
      const seed = generateSeedFromHash(hash);
      const crashPoint = generateCrashPoint(hash);

      const newGame = await prisma.crashGame.create({
        data: {
          hash,
          status: "PENDING",
          seed,
          crashPoint,
        },
      });

      return NextResponse.json({
        game: newGame,
        bets: [],
      });
    }

    // Se o jogo mais recente estiver finalizado (CRASHED), criar um novo jogo
    if (latestGame.status === "CRASHED") {
      // Verificar se já existe algum jogo pendente (para evitar condições de corrida)
      const existingPendingGame = await prisma.crashGame.findFirst({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      });

      if (existingPendingGame) {
        return NextResponse.json({
          game: existingPendingGame,
          bets: [],
        });
      }

      const hash = generateGameHash();
      const seed = generateSeedFromHash(hash);
      const crashPoint = generateCrashPoint(hash);

      const newGame = await prisma.crashGame.create({
        data: {
          hash,
          status: "PENDING",
          seed,
          crashPoint,
        },
      });

      return NextResponse.json({
        game: newGame,
        bets: [],
      });
    }

    // Buscar as apostas do jogo atual
    const bets = await prisma.crashBet.findMany({
      where: {
        gameId: latestGame.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Formatar as apostas para incluir o nome do usuário
    const formattedBets = bets.map(
      (bet: CrashBet & { user: { id: string; name: string } }) => ({
        id: bet.id,
        amount: bet.amount,
        status: bet.status,
        cashoutMultiplier: bet.cashoutMultiplier,
        autoWithdrawAt: bet.autoWithdrawAt,
        profit: bet.profit,
        userId: bet.userId,
        userName: bet.user.name,
      })
    );

    return NextResponse.json({
      game: latestGame,
      bets: formattedBets,
    });
  } catch (error) {
    console.error("Erro ao buscar jogo:", error);
    return NextResponse.json({ error: "Erro ao buscar jogo" }, { status: 500 });
  }
}

// POST: Criar um novo jogo
export async function POST(req: NextRequest) {
  try {
    // Verificar se o usuário está autenticado e é admin
    const user = await getAuthenticatedUser(req);
    if (!user || user.id !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se já existe um jogo pendente ou em andamento
    const activeGame = await prisma.crashGame.findFirst({
      where: {
        OR: [{ status: "PENDING" }, { status: "RUNNING" }],
      },
    });

    if (activeGame) {
      return NextResponse.json(
        { error: "Já existe um jogo ativo" },
        { status: 400 }
      );
    }

    // Criar um novo jogo
    const hash = generateGameHash();
    const seed = generateSeedFromHash(hash);
    const crashPoint = generateCrashPoint(hash);

    const newGame = await prisma.crashGame.create({
      data: {
        hash,
        status: "PENDING",
        seed,
        crashPoint,
      },
    });

    return NextResponse.json({ game: newGame });
  } catch (error) {
    console.error("Erro ao criar jogo:", error);
    return NextResponse.json({ error: "Erro ao criar jogo" }, { status: 500 });
  }
}

// PATCH: Atualizar o status do jogo (iniciar ou finalizar)
export async function PATCH(req: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Obter os dados da requisição
    const { gameId, status } = await req.json();

    if (!gameId || !status) {
      return NextResponse.json(
        { error: "ID do jogo e status são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se o status é válido
    if (!["PENDING", "RUNNING", "CRASHED"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
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

    // Verificar transições de estado válidas
    if (
      (game.status === "PENDING" && status !== "RUNNING") ||
      (game.status === "RUNNING" && status !== "CRASHED") ||
      game.status === "CRASHED"
    ) {
      return NextResponse.json(
        { error: "Transição de estado inválida" },
        { status: 400 }
      );
    }

    // Atualizar o jogo
    let updatedGame;

    if (status === "CRASHED") {
      // Quando o jogo crashar, gerar o ponto de crash e a seed
      const crashPoint = generateCrashPoint(game.hash);
      const seed = generateSeedFromHash(game.hash);

      updatedGame = await prisma.$transaction(async (tx) => {
        // Atualizar o jogo com o ponto de crash e a seed
        const updated = await tx.crashGame.update({
          where: { id: gameId },
          data: {
            status,
            crashPoint,
            seed,
          },
        });

        // Processar as apostas perdidas
        await tx.crashBet.updateMany({
          where: {
            gameId,
            status: "ACTIVE",
          },
          data: {
            status: "LOST",
            profit: 0,
          },
        });

        return updated;
      });
    } else {
      // Apenas atualizar o status
      updatedGame = await prisma.crashGame.update({
        where: { id: gameId },
        data: { status },
      });
    }

    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar jogo" },
      { status: 500 }
    );
  }
}
