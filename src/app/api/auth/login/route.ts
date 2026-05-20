import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { tcNo, password } = await req.json();

    if (!tcNo?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'TC No ve şifre gereklidir.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { tcNo: tcNo.trim() } });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 401 });
    }

    // İlk girişte şifre yoksa, girilen şifreyi hash'leyerek kaydet
    if (!user.password) {
      const hashed = await bcrypt.hash(password.trim(), 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });
      await createSession(user.id);
      return NextResponse.json({ success: true, firstLogin: true });
    }

    const valid = await bcrypt.compare(password.trim(), user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Şifre hatalı.' }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('LOGIN_HATASI:', e);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
