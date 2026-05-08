import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const data = await prisma.publication.findMany({
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
    const item = await prisma.publication.create({
      data: {
        department: body.department?.trim(),
        title: body.title?.trim() || '',
        journalName: body.journalName?.trim(),
        volume: body.volume?.trim(),
        year: body.year?.trim(),
        date: body.date?.trim() || body.year?.trim() || '',
        userId: user!.id
      }
    });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
