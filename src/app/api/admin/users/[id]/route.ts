import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser, getIdFromUrl } from '@/lib/api-helpers';

export async function DELETE(req: Request) {
  try {
    const { user, error } = await requireSessionUser();
    if (error) return error;
    if (user!.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    if (id === user!.id) return NextResponse.json({ error: 'Kendinizi silemezsiniz.' }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function PUT(req: Request) {
  try {
    const { user, error } = await requireSessionUser();
    if (error) return error;
    if (user!.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const body = await req.json();
    const updated = await prisma.user.update({
      where: { id },
      data: {
        fullName: body.fullName?.trim() || undefined,
        title: body.title?.trim() || undefined,
        role: body.role === 'admin' ? 'admin' : 'user',
      },
    });
    return NextResponse.json({ id: updated.id, tcNo: updated.tcNo, fullName: updated.fullName, role: updated.role });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
