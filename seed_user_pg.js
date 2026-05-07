const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg({ pool });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { tcNo: '18974099456' },
    update: {},
    create: {
      tcNo: '18974099456',
      fullName: 'Lis. Öğr. Ece Nur Aşar',
      email: 'ecenurasar123@gmail.com',
    },
  });
  console.log('Kullanıcı hazır:', user.tcNo, '- Şifre henüz yok, ilk girişte belirlenecek.');
  await prisma.$disconnect();
}

main().catch(console.error);