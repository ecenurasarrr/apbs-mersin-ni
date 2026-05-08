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
    const item = await prisma.citation.update({
      where: { id },
      data: {
        ssci: parseInt(body.ssci) || 0,
        alanEndeksleri: parseInt(body.alanEndeksleri) || 0,
        ulakbim: parseInt(body.ulakbim) || 0,
        digerUluslararasi: parseInt(body.digerUluslararasi) || 0,
        uluslararasiKitap: parseInt(body.uluslararasiKitap) || 0,
        ulusalKitap: parseInt(body.ulusalKitap) || 0,
        guzelSanatlarUluslararasi: parseInt(body.guzelSanatlarUluslararasi) || 0,
        guzelSanatlarUlusal: parseInt(body.guzelSanatlarUlusal) || 0,
        citationYear: body.citationYear?.trim(),
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
    await prisma.citation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
