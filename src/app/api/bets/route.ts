import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const bets = await prisma.bet.findMany({
      where: {
        userId,
      },
      include: {
        selection: {
          include: {
            market: {
              include: {
                event: {
                  include: {
                    sport: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ bets });
  } catch (error) {
    console.error('Erro ao buscar apostas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar apostas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { selectionId, amount } = body;

    // Validação básica
    if (!selectionId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'ID da seleção e valor da aposta são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário tem saldo suficiente
    if (user.balance < amount) {
      return NextResponse.json(
        { error: 'Saldo insuficiente para realizar esta aposta' },
        { status: 400 }
      );
    }

    // Buscar a seleção
    const selection = await prisma.selection.findUnique({
      where: { id: selectionId },
      include: {
        market: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!selection) {
      return NextResponse.json(
        { error: 'Seleção não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se a seleção está aberta para apostas
    if (selection.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Esta seleção não está disponível para apostas' },
        { status: 400 }
      );
    }

    // Verificar se o evento já começou
    if (selection.market.event.startTime <= new Date()) {
      return NextResponse.json(
        { error: 'Este evento já começou, não é possível apostar' },
        { status: 400 }
      );
    }

    // Calcular o potencial ganho
    const potentialWin = amount * selection.odds;

    // Criar a aposta e atualizar o saldo do usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar a aposta
      const bet = await tx.bet.create({
        data: {
          amount,
          potentialWin,
          userId,
          selectionId,
        },
        include: {
          selection: {
            include: {
              market: {
                include: {
                  event: {
                    include: {
                      sport: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Atualizar o saldo do usuário
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Registrar a transação
      await tx.transaction.create({
        data: {
          amount: -amount,
          type: 'BET_PLACEMENT',
          userId,
        },
      });

      return { bet, updatedUser };
    });

    return NextResponse.json(
      {
        message: 'Aposta realizada com sucesso',
        bet: result.bet,
        balance: result.updatedUser.balance,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar aposta:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a aposta' },
      { status: 500 }
    );
  }
}
