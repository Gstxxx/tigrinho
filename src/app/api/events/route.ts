import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, EventStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sportId = searchParams.get('sportId');
    const status = searchParams.get('status');

    const where: Prisma.EventWhereInput = {};

    if (sportId) {
      where.sportId = sportId;
    }

    if (status) {
      where.status = status as EventStatus;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        sport: {
          select: {
            id: true,
            name: true,
          },
        },
        markets: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                selections: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar eventos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, startTime, sportId } = body;

    // Validação básica
    if (!name || !startTime || !sportId) {
      return NextResponse.json(
        { error: 'Nome, data de início e esporte são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o esporte existe
    const sport = await prisma.sport.findUnique({
      where: { id: sportId },
    });

    if (!sport) {
      return NextResponse.json(
        { error: 'Esporte não encontrado' },
        { status: 404 }
      );
    }

    const event = await prisma.event.create({
      data: {
        name,
        startTime: new Date(startTime),
        sportId,
      },
      include: {
        sport: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Evento criado com sucesso', event },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
} 