import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sports = await prisma.sport.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ sports });
  } catch (error) {
    console.error('Erro ao buscar esportes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar esportes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome do esporte é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o esporte já existe
    const existingSport = await prisma.sport.findUnique({
      where: { name },
    });

    if (existingSport) {
      return NextResponse.json(
        { error: 'Este esporte já existe' },
        { status: 400 }
      );
    }

    const sport = await prisma.sport.create({
      data: { name },
    });

    return NextResponse.json(
      { message: 'Esporte criado com sucesso', sport },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar esporte:', error);
    return NextResponse.json(
      { error: 'Erro ao criar esporte' },
      { status: 500 }
    );
  }
} 