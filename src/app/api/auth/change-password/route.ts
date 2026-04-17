import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Oturum bulunamadı.' }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword?.trim() || !newPassword?.trim()) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
    }
    if (newPassword.trim().length < 6) {
      return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalıdır.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });

    // Mevcut şifreyi doğrula
    if (user.password) {
      const valid = await bcrypt.compare(currentPassword.trim(), user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Mevcut şifre hatalı.' }, { status: 400 });
      }
    }

    const hashed = await bcrypt.hash(newPassword.trim(), 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
