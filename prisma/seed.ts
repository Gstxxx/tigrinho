import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Criar usuário de teste
  const hashedPassword = await hashPassword('123456');
  
  const user = await prisma.user.upsert({
    where: { email: 'teste@exemplo.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      email: 'teste@exemplo.com',
      password: hashedPassword,
      balance: 1000,
    },
  });

  console.log('Usuário criado:', user.name);

  // Criar esportes
  const sports = [
    { name: 'Futebol' },
    { name: 'Basquete' },
    { name: 'Tênis' },
    { name: 'Vôlei' },
    { name: 'MMA' },
    { name: 'Boxe' },
  ];

  for (const sport of sports) {
    const createdSport = await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: sport,
    });
    console.log('Esporte criado:', createdSport.name);
  }

  // Buscar o esporte de futebol
  const futebol = await prisma.sport.findUnique({
    where: { name: 'Futebol' },
  });

  if (futebol) {
    // Criar eventos de futebol
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const events = [
      {
        name: 'Brasil vs Argentina',
        startTime: tomorrow,
        sportId: futebol.id,
      },
      {
        name: 'Flamengo vs Palmeiras',
        startTime: dayAfterTomorrow,
        sportId: futebol.id,
      },
      {
        name: 'Manchester City vs Liverpool',
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        sportId: futebol.id,
      },
    ];

    for (const event of events) {
      const createdEvent = await prisma.event.create({
        data: event,
        include: {
          sport: true,
        },
      });
      console.log('Evento criado:', createdEvent.name);

      // Criar mercados para o evento
      const market = await prisma.market.create({
        data: {
          name: 'Resultado Final',
          eventId: createdEvent.id,
        },
      });
      console.log('Mercado criado:', market.name);

      // Criar seleções para o mercado
      const selections = [
        {
          name: 'Vitória Casa',
          odds: 1.8,
          marketId: market.id,
        },
        {
          name: 'Empate',
          odds: 3.5,
          marketId: market.id,
        },
        {
          name: 'Vitória Visitante',
          odds: 4.2,
          marketId: market.id,
        },
      ];

      for (const selection of selections) {
        const createdSelection = await prisma.selection.create({
          data: selection,
        });
        console.log('Seleção criada:', createdSelection.name, 'Odds:', createdSelection.odds);
      }
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 