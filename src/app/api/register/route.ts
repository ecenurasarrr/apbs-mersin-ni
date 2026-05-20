import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { tcNo, fullName, email, password } = await req.json();

    if (!tcNo?.trim() || !fullName?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Tüm alanları doldurunuz.' }, { status: 400 });
    }
    if (password.trim().length < 6) {
      return NextResponse.json({ error: 'Parola en az 6 karakter olmalıdır.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password.trim(), 12);
    const user = await prisma.user.create({
      data: {
        tcNo: tcNo.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        password: hashed,
        role: 'user',
      },
    });

    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (e: unknown) {
    console.error('REGISTER_HATASI:', e);
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Bu TC No veya e-posta zaten kayıtlı.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
