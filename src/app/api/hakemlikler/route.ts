import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDefaultUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const data = await prisma.peerReview.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const { name, year } = await req.json();
    if (!name?.trim() || !year?.trim()) return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
    const user = await getDefaultUser();
    const item = await prisma.peerReview.create({ data: { name: name.trim(), year: year.trim(), userId: user.id } });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
