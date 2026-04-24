"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, LogOut, ChevronDown, FlaskConical, Settings, Award, Target, Calendar, CheckCircle, Trophy, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();
  const [initials, setInitials] = useState("U");
  const [fullName, setFullName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((user) => {
        if (user?.fullName) {
          setFullName(user.fullName);
          setInitials(
            user.fullName.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
          );
          setIsAdmin(user.role === 'admin');
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/giris");
    router.refresh();
  };

  return (
    <header className="w-full flex flex-col z-50">
      {/* Top Header - White */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border-2 border-[#1E6B9B] flex items-center justify-center bg-white shadow-sm overflow-hidden">
                 <div className="text-[#E2833F] font-bold text-xl leading-none">MÜ</div>
              </div>
              <h1 className="text-2xl font-light text-slate-700 tracking-tight hidden sm:block">
                {t('navbar.title')}
              </h1>
            </Link>
          </div>

          {/* Right Top Area */}
          <div className="flex items-center gap-6 text-sm text-[#7392B7] font-medium">
            <button 
              onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} 
              className="hover:text-[#1E6B9B] transition-colors hidden md:block cursor-pointer outline-none"
            >
              {lang === 'tr' ? 'English' : 'Türkçe'}
            </button>
            
            <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
            
            <Link href="/profil" className="hover:text-[#1E6B9B] transition-colors flex items-center gap-2">
              <User size={16} /> <span className="hidden sm:inline-block">{fullName || t('navbar.profile')}</span>
            </Link>
            
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            <button
              onClick={handleLogout}
              className="hover:text-[#1E6B9B] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} /> <span className="hidden sm:inline-block">{t('navbar.logout')}</span>
            </button>

            {isAdmin && (
              <Link href="/admin" className="hover:text-[#1E6B9B] transition-colors flex items-center gap-2">
                <Shield size={16} /> <span className="hidden sm:inline-block">Admin</span>
              </Link>
            )}

            <Avatar className="cursor-pointer h-10 w-10 border-2 border-[#1E6B9B]/20">
              <AvatarFallback className="bg-[#1E6B9B] text-white font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Dark Slate */}
      <div className="bg-[#465362] text-slate-200 shadow-md relative">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-12 w-full overflow-x-auto text-[13px] tracking-wide font-medium no-scrollbar">
            
            {/* Akademik Çalışmalar */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex h-full items-center gap-1.5 px-4 hover:bg-[#5a6776] hover:text-white outline-none transition-colors data-[state=open]:bg-[#5a6776] data-[state=open]:text-white">
                <Award size={14} /> {t('navbar.akademik_calismalar')} <ChevronDown size={14} className="ml-1 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none bg-[#5a6776] text-white border-none w-56 p-0 mt-0 shadow-xl" align="start">
                {[
                  [t("menu.tezlerim"), "tezlerim"],
                  [t("menu.yonetilen_tezler"), "yonetilen-tezler"],
                  [t("menu.ogrenim_durumu"), "ogrenim-durumu"],
                  [t("menu.akademik_gorevler"), "akademik-gorevler"],
                  [t("menu.bilimsel_gorevler"), "bilimsel-gorevler"],
                  [t("menu.idari_gorevler"), "idari-gorevler"],
                  [t("menu.yayinlar"), "yayinlar"],
                  [t("menu.atiflar"), "atiflar"],
                  [t("menu.kitaplar"), "kitaplar"],
                  [t("menu.yabanci_dil"), "yabanci-dil"],
                  [t("menu.yurtdisi_akademik_deneyim"), "yurtdisi-akademik-deneyim"],
                  [t("menu.belge_sertifika"), "belge-sertifika"]
                ].map(([title, path]) => (
                  <Link key={path} href={`/akademik-calismalar/${path}`} className="w-full outline-none block">
                    <DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">
                      {title}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-full w-[1px] bg-white/10"></div>

            {/* Projeler & Patentler */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex h-full items-center gap-1.5 px-4 hover:bg-[#5a6776] hover:text-white outline-none transition-colors data-[state=open]:bg-[#5a6776] data-[state=open]:text-white">
                <FlaskConical size={14} /> {t('navbar.projeler_patentler')} <ChevronDown size={14} className="ml-1 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none bg-[#5a6776] text-white border-none w-48 p-0 mt-0 shadow-xl" align="start">
                {[
                  [t("menu.projeler"), "projeler"],
                  [t("menu.patentler"), "patentler"],
                  [t("menu.tasarimlar"), "tasarimlar"]
                ].map(([title, path]) => (
                  <Link key={path} href={`/projeler-ve-patentler/${path}`} className="w-full outline-none block">
                    <DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">
                      {title}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-full w-[1px] bg-white/10"></div>

            {/* Etkinlikler */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex h-full items-center gap-1.5 px-4 hover:bg-[#5a6776] hover:text-white outline-none transition-colors data-[state=open]:bg-[#5a6776] data-[state=open]:text-white">
                <Calendar size={14} /> {t('navbar.etkinlikler')} <ChevronDown size={14} className="ml-1 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none bg-[#5a6776] text-white border-none w-60 p-0 mt-0 shadow-xl" align="start">
                <Link href="/etkinlikler/bilimsel-toplantilar" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("menu.bilimsel_toplantilar")}</DropdownMenuItem></Link>
                <Link href="/etkinlikler/bilimsel-kuruluslara-uyelikler" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("menu.bilimsel_kuruluslara_uyelikler")}</DropdownMenuItem></Link>
                <Link href="/etkinlikler/sanatsal-etkinlikler" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("menu.sanatsal_etkinlikler")}</DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-full w-[1px] bg-white/10"></div>

            {/* Araştırmalar */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex h-full items-center gap-1.5 px-4 hover:bg-[#5a6776] hover:text-white outline-none transition-colors data-[state=open]:bg-[#5a6776] data-[state=open]:text-white">
                <Target size={14} /> {t('navbar.arastirmalar')} <ChevronDown size={14} className="ml-1 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none bg-[#5a6776] text-white border-none w-56 p-0 mt-0 shadow-xl" align="start">
                <Link href="/arastirmalar/doktora-sonrasi" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("menu.doktora_sonrasi_arastirma")}</DropdownMenuItem></Link>
                <Link href="/arastirmalar/misafir" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("menu.misafir_arastirma")}</DropdownMenuItem></Link>
                <Link href="/arastirmalar/yoksis" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("menu.arastirma_yoksis")}</DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-full w-[1px] bg-white/10"></div>

            {/* Hakemlikler */}
            <Link href="/hakemlikler" className="flex h-full items-center gap-1.5 px-4 hover:bg-[#5a6776] hover:text-white outline-none transition-colors">
              <CheckCircle size={14} /> {t('navbar.hakemlikler')}
            </Link>
            
            <div className="h-full w-[1px] bg-white/10"></div>

            {/* Ödüller */}
            <Link href="/oduller" className="flex h-full items-center gap-1.5 px-4 hover:bg-[#5a6776] hover:text-white outline-none transition-colors">
              <Trophy size={14} /> {t('navbar.oduller')}
            </Link>

            <div className="h-full w-[1px] bg-white/10"></div>

            {/* İşlemler */}
           <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex h-full items-center gap-1.5 px-4 hover:bg-[#5a6776] hover:text-white outline-none transition-colors data-[state=open]:bg-[#5a6776] data-[state=open]:text-white">
                <Settings size={14} /> {t('navbar.islemler')} <ChevronDown size={14} className="ml-1 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none bg-[#5a6776] text-white border-none w-48 p-0 mt-0 shadow-xl" align="start">
                <Link href="/islemler/faaliyet-raporu" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("navbar.faaliyet_raporu")}</DropdownMenuItem></Link>
                <Link href="/islemler/duyurular" className="w-full outline-none block"><DropdownMenuItem className="cursor-pointer rounded-none px-4 py-3 hover:bg-[#6c7989] focus:bg-[#6c7989] focus:text-white transition-colors">{t("navbar.duyurular")}</DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="h-full w-[1px] bg-white/10"></div>

          </nav>
        </div>
      </div>
    </header>
  );
}
