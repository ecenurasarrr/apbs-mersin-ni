import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const data = await prisma.supervisedThesis.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const item = await prisma.supervisedThesis.create({ data: { title: body.title?.trim(), student: body.student?.trim(), date: body.date?.trim(), userId: user!.id } });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
