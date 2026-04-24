import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// Geriye dönük uyumluluk için — yeni kodda getSessionUser kullan
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

// Session'daki kullanıcıyı döner, yoksa null
export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.userId } });
}

// Session kullanıcısını döner, yoksa 401 response
export async function requireSessionUser(): Promise<{ user: Awaited<ReturnType<typeof prisma.user.findUnique>>; error?: never } | { error: NextResponse; user?: never }> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 }) };
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return { error: NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 401 }) };
  }
  return { user };
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
