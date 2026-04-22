const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
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
