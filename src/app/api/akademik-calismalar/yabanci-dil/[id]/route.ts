import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIdFromUrl } from '@/lib/api-helpers';

export async function PUT(req: Request) {
  try {
    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    const body = await req.json();
    const item = await prisma.foreignLanguage.update({ where: { id }, data: { language: body.language?.trim(), level: body.level?.trim() } });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await prisma.foreignLanguage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
