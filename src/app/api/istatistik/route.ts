import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSessionUser } from '@/lib/api-helpers';

export async function GET() {
  try {
    const { user, error: authError } = await requireSessionUser();
    if (authError) return authError;
    const uid = user!.id;

    const [
      tezlerim, yonetilenTezler, yayinlar, kitaplar, atiflar,
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

    // label yerine key kullanıyoruz — frontend t() ile çevirecek
    return NextResponse.json({
      akademik: [
        { key: 'menu.tezlerim', value: tezlerim },
        { key: 'menu.yonetilen_tezler', value: yonetilenTezler },
        { key: 'menu.yayinlar', value: yayinlar },
        { key: 'menu.kitaplar', value: kitaplar },
        { key: 'menu.atiflar', value: atiflar },
        { key: 'menu.akademik_gorevler', value: akademikGorevler },
        { key: 'menu.bilimsel_gorevler', value: bilimselGorevler },
        { key: 'menu.idari_gorevler', value: idariGorevler },
        { key: 'menu.yabanci_dil', value: yabancıDil },
        { key: 'menu.yurtdisi_akademik_deneyim', value: yurtdisi },
        { key: 'menu.belge_sertifika', value: belgeSertifika },
        { key: 'menu.ogrenim_durumu', value: egitim },
      ],
      projeler: [
        { key: 'menu.projeler', value: projeler },
        { key: 'menu.patentler', value: patentler },
        { key: 'menu.tasarimlar', value: tasarimlar },
      ],
      etkinlikler: [
        { key: 'menu.bilimsel_toplantilar', value: bilimselToplantilar },
        { key: 'menu.bilimsel_kuruluslara_uyelikler', value: uyelikler },
        { key: 'menu.sanatsal_etkinlikler', value: sanatsal },
      ],
      arastirmalar: [
        { key: 'menu.doktora_sonrasi_arastirma', value: doktoraSonrasi },
        { key: 'menu.misafir_arastirma', value: misafir },
        { key: 'menu.arastirma_yoksis', value: yoksis },
      ],
      taninma: [
        { key: 'navbar.hakemlikler', value: hakemlikler },
        { key: 'navbar.oduller', value: oduller },
      ],
      toplam: tezlerim + yonetilenTezler + yayinlar + kitaplar + atiflar +
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
