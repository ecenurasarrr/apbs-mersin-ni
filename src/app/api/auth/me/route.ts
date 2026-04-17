import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null);
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, fullName: true, tcNo: true, email: true, title: true },
  });
  return NextResponse.json(user);
}
