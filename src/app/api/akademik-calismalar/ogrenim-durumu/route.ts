import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const data = await prisma.education.findMany({
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
    const item = await prisma.education.create({
      data: {
        degree: body.degree?.trim(),
        department: body.department?.trim(),
        university: body.university?.trim(),
        faculty: body.faculty?.trim(),
        title: body.title?.trim() || body.degree?.trim() || '',
        date: body.date?.trim() || '',
        userId: user!.id
      }
    });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
