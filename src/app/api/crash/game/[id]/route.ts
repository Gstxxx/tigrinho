import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateCrashPoint, generateSeedFromHash } from "@/lib/crash";

// PUT: Atualizar o status do jogo por ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o usuário está autenticado
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const gameId = params.id;
    if (!gameId) {
      return NextResponse.json(
        { error: "ID do jogo é obrigatório" },
        { status: 400 }
      );
    }

    // Obter os dados da requisição
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status é obrigatório" },
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

    // Se o jogo já estiver no estado desejado, apenas retornar o jogo atual
    if (game.status === status) {
      return NextResponse.json({ game });
    }

    // Verificar transições de estado válidas
    const validTransitions: Record<string, string[]> = {
      PENDING: ["RUNNING"],
      RUNNING: ["CRASHED"],
      CRASHED: ["PENDING"],
      COMPLETED: [], // Adicionado para cobrir todos os possíveis estados
    };

    if (!validTransitions[game.status]?.includes(status)) {
      console.error(
        `Transição de estado inválida: ${game.status} -> ${status}`
      );
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

      console.log(`Jogo ${game.id} crashou em ${crashPoint}x`);

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
    } else if (status === "RUNNING") {
      console.log(`Iniciando jogo ${game.id}`);

      // Apenas atualizar o status
      updatedGame = await prisma.crashGame.update({
        where: { id: gameId },
        data: { status },
      });
    } else {
      // Apenas atualizar o status
      updatedGame = await prisma.crashGame.update({
        where: { id: gameId },
        data: { status },
      });
    }

    console.log(`Jogo ${gameId} atualizado para ${status}`);
    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar jogo" },
      { status: 500 }
    );
  }
}
