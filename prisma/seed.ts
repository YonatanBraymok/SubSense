// prisma/seed.ts
import { PrismaClient, Prisma, BillingCycle } from '@prisma/client';

const prisma = new PrismaClient();

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

async function main() {
  // 1) Upsert a few users (use unique emails)
  const usersData = [
    {
      name: 'Alice',
      email: 'alice@example.com',
      image: 'https://avatars.githubusercontent.com/u/583231?v=4', // octocat style
    },
    {
      name: 'Bob',
      email: 'bob@example.com',
      image: 'https://avatars.githubusercontent.com/u/9919?v=4',
    },
    {
      name: 'Charlie',
      email: 'charlie@example.com',
      image: 'https://avatars.githubusercontent.com/u/69631?v=4',
    },
  ];

  const users = await Promise.all(
    usersData.map(u =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, image: u.image },
        create: u,
        select: { id: true, email: true },
      })
    )
  );

  // Map email -> id for convenience
  const byEmail = new Map(users.map(u => [u.email, u.id]));

  // 2) Create subscriptions tied to users
  const now = new Date();
  const subscriptionsSeed = [
    // Alice
    {
      userEmail: 'alice@example.com',
      items: [
        {
          name: 'Netflix',
          cost: new Prisma.Decimal('15.99'),
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          nextRenewal: addMonths(now, 1),
        },
        {
          name: 'Adobe Creative Cloud',
          cost: new Prisma.Decimal('54.99'),
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          nextRenewal: addMonths(now, 1),
        },
      ],
    },
    // Bob
    {
      userEmail: 'bob@example.com',
      items: [
        {
          name: 'Spotify',
          cost: new Prisma.Decimal('9.99'),
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          nextRenewal: addMonths(now, 1),
        },
        {
          name: 'YouTube Premium',
          cost: new Prisma.Decimal('11.99'),
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          nextRenewal: addMonths(now, 1),
        },
      ],
    },
    // Charlie
    {
      userEmail: 'charlie@example.com',
      items: [
        {
          name: 'Apple iCloud 200GB',
          cost: new Prisma.Decimal('2.99'),
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          nextRenewal: addMonths(now, 1),
        },
        {
          name: 'GitHub Copilot',
          cost: new Prisma.Decimal('10.00'),
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          nextRenewal: addMonths(now, 1),
        },
      ],
    },
  ];

  for (const bucket of subscriptionsSeed) {
    const userId = byEmail.get(bucket.userEmail);
    if (!userId) continue;

    for (const s of bucket.items) {
        await prisma.subscription.upsert({
          where: {
              userId_name: {
                userId,
                name: s.name,
              },
            },
            update: s,
            create: {
                ...s,
                userId,
            },
        });
    }
  }
}

main()
  .then(async () => {
    console.log('Seed complete');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed', e);
    await prisma.$disconnect();
    process.exit(1);
  });