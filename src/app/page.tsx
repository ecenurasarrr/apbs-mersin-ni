"use client";

import Link from "next/link";
import { BookOpen, FlaskConical, Calendar, Target, CheckCircle, Trophy, Settings } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("navbar.akademik_calismalar"),
      icon: <BookOpen className="text-blue-600 mb-4" size={32} />,
      links: [
        { label: t("menu.tezlerim"), path: "/akademik-calismalar/tezlerim" },
        { label: t("menu.yonetilen_tezler"), path: "/akademik-calismalar/yonetilen-tezler" },
        { label: t("menu.ogrenim_durumu"), path: "/akademik-calismalar/ogrenim-durumu" },
        { label: t("menu.akademik_gorevler"), path: "/akademik-calismalar/akademik-gorevler" },
        { label: t("menu.bilimsel_gorevler"), path: "/akademik-calismalar/bilimsel-gorevler" },
        { label: t("menu.idari_gorevler"), path: "/akademik-calismalar/idari-gorevler" },
        { label: t("menu.yayinlar"), path: "/akademik-calismalar/yayinlar" },
        { label: t("menu.atiflar"), path: "/akademik-calismalar/atiflar" },
        { label: t("menu.kitaplar"), path: "/akademik-calismalar/kitaplar" },
        { label: t("menu.yabanci_dil"), path: "/akademik-calismalar/yabanci-dil" },
        { label: t("menu.yurtdisi_akademik_deneyim"), path: "/akademik-calismalar/yurtdisi-akademik-deneyim" },
        { label: t("menu.belge_sertifika"), path: "/akademik-calismalar/belge-sertifika" },
      ]
    },
    {
      title: t("navbar.projeler_patentler"),
      icon: <FlaskConical className="text-emerald-600 mb-4" size={32} />,
      links: [
        { label: t("menu.projeler"), path: "/projeler-ve-patentler/projeler" },
        { label: t("menu.patentler"), path: "/projeler-ve-patentler/patentler" },
        { label: t("menu.tasarimlar"), path: "/projeler-ve-patentler/tasarimlar" },
      ]
    },
    {
      title: t("navbar.etkinlikler"),
      icon: <Calendar className="text-purple-600 mb-4" size={32} />,
      links: [
        { label: t("menu.bilimsel_toplantilar"), path: "/etkinlikler/bilimsel-toplantilar" },
        { label: t("menu.bilimsel_kuruluslara_uyelikler"), path: "/etkinlikler/bilimsel-kuruluslara-uyelikler" },
        { label: t("menu.sanatsal_etkinlikler"), path: "/etkinlikler/sanatsal-etkinlikler" },
      ]
    },
    {
      title: t("navbar.arastirmalar"),
      icon: <Target className="text-red-500 mb-4" size={32} />,
      links: [
        { label: t("menu.doktora_sonrasi_arastirma"), path: "/arastirmalar/doktora-sonrasi" },
        { label: t("menu.misafir_arastirma"), path: "/arastirmalar/misafir" },
        { label: t("menu.arastirma_yoksis"), path: "/arastirmalar/yoksis" },
      ]
    },
    {
      title: t("dashboard.taninma"),
      icon: <Trophy className="text-yellow-500 mb-4" size={32} />,
      links: [
        { label: t("navbar.hakemlikler"), path: "/hakemlikler" },
        { label: t("navbar.oduller"), path: "/oduller" },
      ]
    },
    {
      title: t("navbar.islemler"),
      icon: <Settings className="text-slate-600 mb-4" size={32} />,
      links: [
        { label: t("navbar.faaliyet_raporu"), path: "/islemler/faaliyet-raporu" },
        { label: t("navbar.duyurular"), path: "/islemler/duyurular" },
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center max-w-2xl mx-auto">
         <h1 className="text-4xl font-light text-slate-800 mb-4 tracking-tight">{t('dashboard.welcome')}</h1>
         <p className="text-slate-500">
           {t('dashboard.description')}
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              {section.icon}
              <h2 className="text-xl font-semibold text-slate-800 pb-4 m-0 p-0 leading-none">{section.title}</h2>
            </div>
            <ul className="flex flex-col gap-2 flex-grow">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <Link 
                    href={link.path} 
                    className="group flex items-center text-sm font-medium text-slate-600 hover:text-[#1E6B9B] transition-colors p-2 rounded-md hover:bg-sky-50"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#1E6B9B] mr-3 transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
