import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_TC = '18974099456';

export async function getDefaultUser() {
  return prisma.user.upsert({
    where: { tcNo: DEFAULT_TC },
    update: {},
    create: {
      tcNo: DEFAULT_TC,
      fullName: 'Lis. Öğr. Ece Nur Aşar',
      email: 'ecenurasar123@gmail.com',
    },
  });
}

export function getIdFromUrl(url: string): number | null {
  const parts = new URL(url).pathname.split('/').filter(Boolean);
  const id = parseInt(parts[parts.length - 1], 10);
  return isNaN(id) ? null : id;
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
