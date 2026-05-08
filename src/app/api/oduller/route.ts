import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const data = await prisma.award.findMany({
      where: { userId: user!.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const { name, year } = body;
    if (!name?.trim() || !year?.trim()) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
    const item = await prisma.award.create({
      data: { name: name.trim(), year: year.trim(), userId: user!.id }
    });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
