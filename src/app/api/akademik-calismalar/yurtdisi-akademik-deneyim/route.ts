import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    // En son kaydı döndür (tek kayıt sistemi)
    const data = await prisma.internationalExperience.findFirst({
      where: { userId: user!.id },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;

    // Mevcut kayıt varsa güncelle, yoksa oluştur
    const existing = await prisma.internationalExperience.findFirst({
      where: { userId: user!.id }
    });

    if (existing) {
      const updated = await prisma.internationalExperience.update({
        where: { id: existing.id },
        data: { content: body.content, date: new Date().toISOString().slice(0, 10) }
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.internationalExperience.create({
        data: {
          content: body.content,
          date: new Date().toISOString().slice(0, 10),
          userId: user!.id
        }
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
