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
    const item = await prisma.certificate.update({
      where: { id },
      data: {
        documentType: body.documentType?.trim(),
        description: body.description?.trim(),
        title: body.documentType?.trim() || body.title?.trim() || '',
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
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
