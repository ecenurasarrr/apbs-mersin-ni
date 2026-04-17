import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request
) {
  try {
    // En sağlam yol: URL pathname'den id'yi çekmek.
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    const idFromUrl = parseInt(last, 10);
    const id = idFromUrl;

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'Invalid `id`' }, { status: 400 });
    }

    await prisma.award.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/oduller/[id] failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to delete award', message }, { status: 500 });
  }
}
