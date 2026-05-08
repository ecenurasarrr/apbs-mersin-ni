import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const data = await prisma.supervisedThesis.findMany({ 
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
    const item = await prisma.supervisedThesis.create({ 
      data: { 
        department: body.department?.trim(),
        studentName: body.studentName?.trim(),
        title: body.title?.trim() || '',
        titleEn: body.titleEn?.trim(),
        thesisType: body.thesisType?.trim(),
        status: body.status || '0',
        file: body.file?.trim(),
        date: body.date?.trim() || '',
        userId: user!.id 
      } 
    });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
