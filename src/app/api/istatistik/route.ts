import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const uid = user!.id;

    const [
      tezlerim, yonetilenTezler, yayinlar, bildiriler, kitaplar, atiflar,
      projeler, patentler, tasarimlar,
      hakemlikler, oduller,
      bilimselToplantilar, uyelikler, sanatsal,
      doktoraSonrasi, misafir, yoksis,
      akademikGorevler, bilimselGorevler, idariGorevler,
      yabancıDil, yurtdisi, belgeSertifika, egitim,
    ] = await Promise.all([
      prisma.thesis.count({ where: { userId: uid } }),
      prisma.supervisedThesis.count({ where: { userId: uid } }),
      prisma.publication.count({ where: { userId: uid } }),
      prisma.bildiri.count({ where: { userId: uid } }),
      prisma.book.count({ where: { userId: uid } }),
      prisma.citation.count({ where: { userId: uid } }),
      prisma.project.count({ where: { userId: uid } }),
      prisma.patent.count({ where: { userId: uid } }),
      prisma.design.count({ where: { userId: uid } }),
      prisma.peerReview.count({ where: { userId: uid } }),
      prisma.award.count({ where: { userId: uid } }),
      prisma.scientificMeeting.count({ where: { userId: uid } }),
      prisma.organizationMembership.count({ where: { userId: uid } }),
      prisma.artisticActivity.count({ where: { userId: uid } }),
      prisma.postdoctoralResearch.count({ where: { userId: uid } }),
      prisma.visitingResearch.count({ where: { userId: uid } }),
      prisma.yoksisResearch.count({ where: { userId: uid } }),
      prisma.academicDuty.count({ where: { userId: uid } }),
      prisma.scientificDuty.count({ where: { userId: uid } }),
      prisma.administrativeDuty.count({ where: { userId: uid } }),
      prisma.foreignLanguage.count({ where: { userId: uid } }),
      prisma.internationalExperience.count({ where: { userId: uid } }),
      prisma.certificate.count({ where: { userId: uid } }),
      prisma.education.count({ where: { userId: uid } }),
    ]);

    return NextResponse.json({
      akademik: [
        { label: 'Tezlerim', value: tezlerim },
        { label: 'Yönetilen Tezler', value: yonetilenTezler },
        { label: 'Yayınlar', value: yayinlar },
        { label: 'Bildiriler', value: bildiriler },
        { label: 'Kitaplar', value: kitaplar },
        { label: 'Atıflar', value: atiflar },
        { label: 'Akademik Görevler', value: akademikGorevler },
        { label: 'Bilimsel Görevler', value: bilimselGorevler },
        { label: 'İdari Görevler', value: idariGorevler },
        { label: 'Yabancı Dil', value: yabancıDil },
        { label: 'Yurtdışı Deneyim', value: yurtdisi },
        { label: 'Belge/Sertifika', value: belgeSertifika },
        { label: 'Öğrenim', value: egitim },
      ],
      projeler: [
        { label: 'Projeler', value: projeler },
        { label: 'Patentler', value: patentler },
        { label: 'Tasarımlar', value: tasarimlar },
      ],
      etkinlikler: [
        { label: 'Bilimsel Toplantılar', value: bilimselToplantilar },
        { label: 'Kuruluş Üyelikleri', value: uyelikler },
        { label: 'Sanatsal Etkinlikler', value: sanatsal },
      ],
      arastirmalar: [
        { label: 'Doktora Sonrası', value: doktoraSonrasi },
        { label: 'Misafir Araştırma', value: misafir },
        { label: 'YÖKSİS', value: yoksis },
      ],
      taninma: [
        { label: 'Hakemlikler', value: hakemlikler },
        { label: 'Ödüller', value: oduller },
      ],
      toplam: tezlerim + yonetilenTezler + yayinlar + bildiriler + kitaplar + atiflar +
              projeler + patentler + tasarimlar + hakemlikler + oduller +
              bilimselToplantilar + uyelikler + sanatsal +
              doktoraSonrasi + misafir + yoksis +
              akademikGorevler + bilimselGorevler + idariGorevler +
              yabancıDil + yurtdisi + belgeSertifika + egitim,
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
