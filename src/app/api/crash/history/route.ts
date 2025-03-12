import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obter o histórico de jogos Crash
export async function GET() {
  try {
    // Buscar os últimos 20 jogos finalizados
    const history = await prisma.crashGame.findMany({
      where: {
        status: 'CRASHED'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      select: {
        id: true,
        crashPoint: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      history
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de jogos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de jogos' },
      { status: 500 }
    );
  }
} 