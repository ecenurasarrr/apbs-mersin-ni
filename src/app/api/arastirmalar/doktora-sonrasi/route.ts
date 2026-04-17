import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDefaultUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const data = await prisma.postdoctoralResearch.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getDefaultUser();
    const item = await prisma.postdoctoralResearch.create({ data: { title: body.title?.trim(), institution: body.institution?.trim(), date: body.date?.trim(), userId: user.id } });
    return NextResponse.json(item, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
