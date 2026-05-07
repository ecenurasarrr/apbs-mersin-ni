import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getIdFromUrl } from '@/lib/api-helpers';

export async function PUT(req: Request) {
  try {
    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    const body = await req.json();
    const item = await prisma.thesis.update({
      where: { id },
      data: {
        advisorCount:     body.advisorCount     ?? undefined,
        advisorName:      body.advisorName?.trim()      ?? undefined,
        advisorMidName:   body.advisorMidName?.trim()   ?? undefined,
        advisorSurname:   body.advisorSurname?.trim()   ?? undefined,
        coAdvisorName:    body.coAdvisorName?.trim()    ?? undefined,
        coAdvisorMidName: body.coAdvisorMidName?.trim() ?? undefined,
        coAdvisorSurname: body.coAdvisorSurname?.trim() ?? undefined,
        university:       body.university?.trim()       ?? undefined,
        universityOther:  body.universityOther?.trim()  ?? undefined,
        institute:        body.institute?.trim()        ?? undefined,
        instituteOther:   body.instituteOther?.trim()   ?? undefined,
        department:       body.department?.trim()       ?? undefined,
        departmentOther:  body.departmentOther?.trim()  ?? undefined,
        title:            body.title?.trim()            ?? undefined,
        titleEn:          body.titleEn?.trim()          ?? undefined,
        abstract:         body.abstract?.trim()         ?? undefined,
        abstractEn:       body.abstractEn?.trim()       ?? undefined,
        pageCount:        body.pageCount?.trim()        ?? undefined,
        status:           body.status                   ?? undefined,
        keywords:         body.keywords                 ?? undefined,
        file:             body.file?.trim()             ?? undefined,
        url:              body.url?.trim()              ?? undefined,
        city:             body.city?.trim()             ?? undefined,
        country:          body.country?.trim()          ?? undefined,
        date:             body.date?.trim()             ?? undefined,
      },
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req.url);
    if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    await prisma.thesis.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}
