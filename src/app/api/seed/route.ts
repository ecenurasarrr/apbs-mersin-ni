import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Bu endpoint sadece bir kez çalıştırılmalı, sonra silinmeli
export async function GET() {
  try {
    const user = await prisma.user.upsert({
      where: { tcNo: '18974099456' },
      update: { password: null },
      create: {
        tcNo: '18974099456',
        fullName: 'Lis. Öğr. Ece Nur Aşar',
        email: 'ecenurasar123@gmail.com',
        title: 'Lisans Öğrencisi',
        password: null,
      },
    });
    return NextResponse.json({ success: true, message: 'Şifre sıfırlandı. Şimdi istediğin şifreyle giriş yapabilirsin.', user: { id: user.id, tcNo: user.tcNo } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
