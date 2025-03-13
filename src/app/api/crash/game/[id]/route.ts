import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { generateCrashPoint, generateSeedFromHash } from "@/lib/crash";

// PUT: Atualizar o status do jogo por ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    // Extrair o ID do jogo dos parâmetros
    const paramsData = await params;
    const id = paramsData.id;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID do jogo é obrigatório" },
        { status: 400 }
      );
    }

    // Obter os dados da requisição
    const { status } = await request.json();

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
      where: { id },
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
      COMPLETED: [],
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
      const crashPoint = generateCrashPoint(game.hash);
      const seed = generateSeedFromHash(game.hash);

      console.log(`Jogo ${game.id} crashou em ${crashPoint}x`);

      updatedGame = await prisma.$transaction(async (tx) => {
        const updated = await tx.crashGame.update({
          where: { id },
          data: {
            status,
            crashPoint,
            seed,
          },
        });

        await tx.crashBet.updateMany({
          where: {
            gameId: id,
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
      console.log(`Atualizando jogo ${game.id} para o status ${status}`);
      updatedGame = await prisma.crashGame.update({
        where: { id },
        data: { status },
      });
    }

    console.log(`Jogo ${id} atualizado para ${status}`);
    return NextResponse.json({ game: updatedGame });
  } catch (error) {
    console.error("Erro ao atualizar jogo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar jogo" },
      { status: 500 }
    );
  }
}
