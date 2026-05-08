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
    const item = await prisma.publication.update({
      where: { id },
      data: {
        department: body.department?.trim(),
        title: body.title?.trim(),
        journalName: body.journalName?.trim(),
        volume: body.volume?.trim(),
        year: body.year?.trim(),
        date: body.date?.trim() || body.year?.trim() || '',
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
    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
