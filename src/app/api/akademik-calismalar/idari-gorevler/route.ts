import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const data = await prisma.administrativeDuty.findMany({
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
    const item = await prisma.administrativeDuty.create({
      data: {
        titleTr: body.titleTr?.trim(),
        titleEn: body.titleEn?.trim(),
        role: body.role?.trim(),
        institution: body.institution?.trim(),
        title: body.titleTr?.trim() || body.title?.trim() || '',
        date: body.date?.trim() || '',
        userId: user!.id
      }
    });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
