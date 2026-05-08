import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const data = await prisma.citation.findMany({
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
    const item = await prisma.citation.create({
      data: {
        sourceType: body.sourceType?.trim(),
        sourceId: body.sourceId ? parseInt(body.sourceId) : null,
        sourceTitle: body.sourceTitle?.trim(),
        sourceYear: body.sourceYear?.trim(),
        citationYear: body.citationYear?.trim() || new Date().getFullYear().toString(),
        ssci: parseInt(body.ssci) || 0,
        alanEndeksleri: parseInt(body.alanEndeksleri) || 0,
        ulakbim: parseInt(body.ulakbim) || 0,
        digerUluslararasi: parseInt(body.digerUluslararasi) || 0,
        uluslararasiKitap: parseInt(body.uluslararasiKitap) || 0,
        ulusalKitap: parseInt(body.ulusalKitap) || 0,
        guzelSanatlarUluslararasi: parseInt(body.guzelSanatlarUluslararasi) || 0,
        guzelSanatlarUlusal: parseInt(body.guzelSanatlarUlusal) || 0,
        title: body.sourceTitle?.trim() || '',
        date: body.citationYear?.trim() || new Date().getFullYear().toString(),
        userId: user!.id
      }
    });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
