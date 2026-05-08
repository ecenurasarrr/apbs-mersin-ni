import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const data = await prisma.thesis.findMany({ 
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
    const item = await prisma.thesis.create({ 
      data: { 
        advisorCount: body.advisorCount?.trim() || '1',
        advisorName: body.advisorName?.trim(),
        advisorMidName: body.advisorMidName?.trim(),
        advisorSurname: body.advisorSurname?.trim(),
        coAdvisorName: body.coAdvisorName?.trim(),
        coAdvisorMidName: body.coAdvisorMidName?.trim(),
        coAdvisorSurname: body.coAdvisorSurname?.trim(),
        university: body.university?.trim(),
        universityOther: body.universityOther?.trim(),
        institute: body.institute?.trim(),
        instituteOther: body.instituteOther?.trim(),
        department: body.department?.trim(),
        departmentOther: body.departmentOther?.trim(),
        title: body.title?.trim() || '',
        titleEn: body.titleEn?.trim(),
        abstract: body.abstract?.trim(),
        abstractEn: body.abstractEn?.trim(),
        pageCount: body.pageCount?.trim(),
        status: body.status || '0',
        keywords: body.keywords,
        file: body.file?.trim(),
        url: body.url?.trim(),
        city: body.city?.trim(),
        country: body.country?.trim(),
        date: body.date?.trim() || '',
        userId: user!.id 
      } 
    });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
