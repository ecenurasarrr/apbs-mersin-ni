import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.award.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();

    let body: any;
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return NextResponse.json(
        { error: 'Invalid JSON body', message, raw },
        { status: 400 }
      );
    }

    const name = body?.name;
    const year = body?.year;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid `name`' }, { status: 400 });
    }
    if (typeof year !== 'string' || year.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid `year`' }, { status: 400 });
    }

    // Id=1 varsayimi bazen unique (tcNo/email) çakismalarina sebep oluyor.
    // Varsayilan kullaniciyi tcNo uzerinden upsert ediyoruz.
    const defaultTcNo = '18974099456';
    const defaultUser = await prisma.user.upsert({
      where: { tcNo: defaultTcNo },
      update: {},
      create: {
        tcNo: defaultTcNo,
        fullName: 'Lis. Öğr. Ece Nur Aşar',
        email: 'ecenurasar123@gmail.com',
      },
    });

    const newAward = await prisma.award.create({
      data: {
        name: name.trim(),
        year: year.trim(),
        userId: defaultUser.id,
      }
    });

    return NextResponse.json(newAward, { status: 201 });
  } catch (error) {
    console.error('POST /api/oduller failed:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to create award', message }, { status: 500 });
  }
}
