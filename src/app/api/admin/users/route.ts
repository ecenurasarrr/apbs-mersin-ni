import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const { user, error } = await requireSessionUser();
    if (error) return error;
    if (user!.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

    const users = await prisma.user.findMany({
      select: { id: true, tcNo: true, fullName: true, email: true, title: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const { user, error } = await requireSessionUser();
    if (error) return error;
    if (user!.role !== 'admin') return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

    const body = await req.json();
    const { tcNo, fullName, email, title, password, role } = body;

    if (!tcNo?.trim() || !fullName?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'TC No, Ad Soyad, E-posta ve şifre zorunludur.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password.trim(), 12);
    const newUser = await prisma.user.create({
      data: {
        tcNo: tcNo.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        title: title?.trim() || null,
        password: hashed,
        role: role === 'admin' ? 'admin' : 'user',
      },
    });

    return NextResponse.json({ id: newUser.id, tcNo: newUser.tcNo, fullName: newUser.fullName }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes('Unique constraint')) return NextResponse.json({ error: 'Bu TC No veya e-posta zaten kayıtlı.' }, { status: 400 });
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
