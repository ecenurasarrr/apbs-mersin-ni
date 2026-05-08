import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIdFromUrl, requireSessionUser } from '@/lib/api-helpers';

export async function PUT(req: Request) {
  try {
    const { error: authError } = await requireSessionUser();
    if (authError) return authError;
    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    const body = await req.json();
    const item = await prisma.thesis.update({ 
      where: { id }, 
      data: { 
        advisorName: body.advisorName?.trim(),
        advisorSurname: body.advisorSurname?.trim(),
        department: body.department?.trim(),
        title: body.title?.trim(),
        titleEn: body.titleEn?.trim(),
        abstract: body.abstract?.trim(),
        abstractEn: body.abstractEn?.trim(),
        pageCount: body.pageCount?.trim(),
        status: body.status,
        keywords: body.keywords,
        file: body.file?.trim(),
        url: body.url?.trim(),
        city: body.city?.trim(),
        country: body.country?.trim(),
        date: body.date?.trim(),
      } 
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { error: authError } = await requireSessionUser();
    if (authError) return authError;
    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await prisma.thesis.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
