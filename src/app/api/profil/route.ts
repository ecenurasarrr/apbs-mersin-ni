import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDefaultUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const user = await getDefaultUser();
    const full = await prisma.user.findUnique({ where: { id: user.id } });
    return NextResponse.json(full);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const user = await getDefaultUser();
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName:    body.fullName    ?? undefined,
        title:       body.title       ?? undefined,
        birthDate:   body.birthDate   ? new Date(body.birthDate) : undefined,
        homeAddress: body.homeAddress ?? undefined,
        workAddress: body.workAddress ?? undefined,
        gsm:         body.gsm         ?? undefined,
        email:       body.email       ?? undefined,
        otherEmail:  body.otherEmail  ?? undefined,
        url:         body.url         ?? undefined,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
