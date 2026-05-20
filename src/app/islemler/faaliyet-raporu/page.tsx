"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Home, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

const SECTIONS_CONFIG = [
  { value: "tezlerim",                    key: "menu.tezlerim",                    api: "/api/akademik-calismalar/tezlerim" },
  { value: "yonetilen-tezler",            key: "menu.yonetilen_tezler",             api: "/api/akademik-calismalar/yonetilen-tezler" },
  { value: "ogrenim-durumu",              key: "menu.ogrenim_durumu",               api: "/api/akademik-calismalar/ogrenim-durumu" },
  { value: "akademik-gorevler",           key: "menu.akademik_gorevler",            api: "/api/akademik-calismalar/akademik-gorevler" },
  { value: "bilimsel-gorevler",           key: "menu.bilimsel_gorevler",            api: "/api/akademik-calismalar/bilimsel-gorevler" },
  { value: "idari-gorevler",              key: "menu.idari_gorevler",               api: "/api/akademik-calismalar/idari-gorevler" },
  { value: "yayinlar",                    key: "menu.yayinlar",                    api: "/api/akademik-calismalar/yayinlar" },
  { value: "atiflar",                     key: "menu.atiflar",                     api: "/api/akademik-calismalar/atiflar" },
  { value: "kitaplar",                    key: "menu.kitaplar",                    api: "/api/akademik-calismalar/kitaplar" },
  { value: "yabanci-dil",                 key: "menu.yabanci_dil",                 api: "/api/akademik-calismalar/yabanci-dil" },
  { value: "yurtdisi",                    key: "menu.yurtdisi_akademik_deneyim",   api: "/api/akademik-calismalar/yurtdisi-akademik-deneyim" },
  { value: "belge-sertifika",             key: "menu.belge_sertifika",             api: "/api/akademik-calismalar/belge-sertifika" },
  { value: "projeler",                    key: "menu.projeler",                    api: "/api/projeler-ve-patentler/projeler" },
  { value: "patentler",                   key: "menu.patentler",                   api: "/api/projeler-ve-patentler/patentler" },
  { value: "tasarimlar",                  key: "menu.tasarimlar",                  api: "/api/projeler-ve-patentler/tasarimlar" },
  { value: "bilimsel-toplantilar",        key: "menu.bilimsel_toplantilar",        api: "/api/etkinlikler/bilimsel-toplantilar" },
  { value: "uyelikler",                   key: "menu.bilimsel_kuruluslara_uyelikler", api: "/api/etkinlikler/bilimsel-kuruluslara-uyelikler" },
  { value: "sanatsal",                    key: "menu.sanatsal_etkinlikler",        api: "/api/etkinlikler/sanatsal-etkinlikler" },
  { value: "doktora-sonrasi",             key: "menu.doktora_sonrasi_arastirma",   api: "/api/arastirmalar/doktora-sonrasi" },
  { value: "misafir",                     key: "menu.misafir_arastirma",           api: "/api/arastirmalar/misafir" },
  { value: "yoksis",                      key: "menu.arastirma_yoksis",            api: "/api/arastirmalar/yoksis" },
  { value: "hakemlikler",                 key: "navbar.hakemlikler",               api: "/api/hakemlikler" },
  { value: "oduller",                     key: "navbar.oduller",                   api: "/api/oduller" },
];

export default function FaaliyetRaporuPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generating, setGenerating] = useState(false);
  const { t } = useLanguage();

  // Create SECTIONS array dynamically using translations
  const SECTIONS = SECTIONS_CONFIG.map((s) => ({ ...s, label: t(s.key) }));
  const [selected, setSelected] = useState<string[]>(SECTIONS.map((s) => s.value));

  const toggleSection = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const profile = await fetch("/api/profil").then((r) => r.json());
      const chosenSections = SECTIONS.filter((s) => selected.includes(s.value));

      const results = await Promise.all(
        chosenSections.map(async (s) => {
          const data = await fetch(s.api).then((r) => r.json());
          return { label: s.label, data: Array.isArray(data) ? data : [] };
        })
      );

      // Tarih filtresi
      const filterByDate = (items: Record<string, string>[]) => {
        if (!startDate && !endDate) return items;
        return items.filter((item) => {
          const d = item.date || item.year || "";
          if (!d) return true;
          const itemDate = d.length === 4 ? `${d}-01-01` : d;
          if (startDate && itemDate < startDate) return false;
          if (endDate && itemDate > endDate) return false;
          return true;
        });
      };

      const html = buildReportHtml(profile, results, filterByDate, startDate, endDate);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) win.focus();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-foreground flex items-center gap-1"><Home size={14} /> {t("common.home")}</Link></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("navbar.islemler")}</span></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("navbar.faaliyet_raporu")}</span></li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("navbar.faaliyet_raporu")}</h1>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-xl">{t("report.criteria")}</CardTitle>
          <CardDescription>{t("report.description")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Tarih aralığı */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("report.start_date")}</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("report.end_date")}</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Bölüm seçimi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t("report.sections")}</label>
              <div className="flex gap-2">
                <button onClick={() => setSelected(SECTIONS.map((s) => s.value))} className="text-xs text-blue-600 hover:underline">{t("report.select_all")}</button>
                <span className="text-xs text-slate-300">|</span>
                <button onClick={() => setSelected([])} className="text-xs text-slate-500 hover:underline">{t("report.clear")}</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-lg p-4 bg-slate-50/50">
              {SECTIONS.map((s) => (
                <label key={s.value} className="flex items-center gap-2 cursor-pointer text-sm hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={selected.includes(s.value)}
                    onChange={() => toggleSection(s.value)}
                    className="w-4 h-4 rounded"
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end border-t gap-2">
            <Button variant="outline" type="button" onClick={() => window.history.back()}>{t("common.back")}</Button>
            <Button onClick={handleGenerate} disabled={generating || selected.length === 0} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              {generating ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              {t("common.report_create")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const REPORT_FIELD_LABELS: Record<string, string> = {
  // Genel
  title: "Başlık", titleEn: "Başlık (EN)", date: "Tarih", year: "Yıl",
  status: "Durum", number: "Numara", file: "Dosya", url: "URL",
  // Tez
  advisorCount: "Danışman Sayısı", advisorName: "Danışman Adı", advisorMidName: "Danışman Orta Adı",
  advisorSurname: "Danışman Soyadı", coAdvisorName: "Eş Danışman Adı", coAdvisorMidName: "Eş Danışman Orta Adı",
  coAdvisorSurname: "Eş Danışman Soyadı", university: "Üniversite", universityOther: "Üniversite (Diğer)",
  institute: "Enstitü", instituteOther: "Enstitü (Diğer)", department: "Bölüm", departmentOther: "Bölüm (Diğer)",
  abstract: "Özet", abstractEn: "Özet (EN)", pageCount: "Sayfa Sayısı", keywords: "Anahtar Kelimeler",
  city: "Şehir", country: "Ülke", sectionId: "Bölüm ID",
  // Yönetilen tez
  student: "Öğrenci", studentName: "Öğrenci Adı", thesisType: "Tez Türü",
  // Öğrenim
  degree: "Derece", faculty: "Fakülte/Enstitü",
  // Görevler
  titleTr: "Türkçe Ünvan", role: "Görev", institution: "Kurum", organizationName: "Organizasyon/Dergi",
  // Yayın
  journalName: "Dergi Adı", volume: "Cilt",
  // Yabancı dil
  language: "Dil Adı", level: "Seviye",
  // Proje
  projectNo: "Proje No", supportingInstitution: "Destekleyen Kurum",
  // Patent
  name: "Ad",
  // Sanatsal
  scope: "Kapsam", activityType: "Tür",
  // Atıf
  sourceType: "Kaynak Türü", sourceTitle: "Kaynak Başlığı", sourceYear: "Kaynak Yılı",
  citationYear: "Atıf Yılı", ssci: "SSCI/SCI", alanEndeksleri: "Alan Endeksleri",
  ulakbim: "ULAKBİM", digerUluslararasi: "Diğer Uluslararası",
  uluslararasiKitap: "Uluslararası Kitap", ulusalKitap: "Ulusal Kitap",
  guzelSanatlarUluslararasi: "G.S. Uluslararası", guzelSanatlarUlusal: "G.S. Ulusal",
  // Belge
  documentType: "Belge Türü/Kurum", description: "Belge Tanımı",
  // Toplantı
  meetingName: "Toplantı Adı",
  // Diğer
  organization: "Kuruluş Adı", content: "İçerik",
};

function buildReportHtml(
  profile: Record<string, string>,
  sections: { label: string; data: Record<string, string>[] }[],
  filterByDate: (items: Record<string, string>[]) => Record<string, string>[],
  startDate: string,
  endDate: string
) {
  const name = profile?.fullName ?? "Akademisyen";
  const dateRange = startDate || endDate
    ? `${startDate ? new Date(startDate).toLocaleDateString("tr-TR") : "Başlangıç"} - ${endDate ? new Date(endDate).toLocaleDateString("tr-TR") : "Bugün"}`
    : "Tüm Dönem";

  const sectionsHtml = sections.map(({ label, data }) => {
    const filtered = filterByDate(data);
    if (filtered.length === 0) return `<h2>${label}</h2><p class="empty">Kayıt bulunamadı.</p>`;
    const keys = Object.keys(filtered[0]).filter((k) => !["id", "userId", "createdAt", "updatedAt"].includes(k));
    const rows = filtered.map((row) =>
      `<tr>${keys.map((k) => `<td>${row[k] ?? "-"}</td>`).join("")}</tr>`
    ).join("");
    const headers = keys.map((k) => `<th>${REPORT_FIELD_LABELS[k] ?? k}</th>`).join("");
    return `<h2>${label} <span class="count">(${filtered.length})</span></h2><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8"/>
  <title>Faaliyet Raporu - ${name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 30px auto; padding: 0 24px; color: #1e293b; font-size: 13px; }
    .header { border-bottom: 3px solid #1E6B9B; padding-bottom: 12px; margin-bottom: 24px; }
    .header h1 { color: #1E6B9B; margin: 0 0 4px; font-size: 20px; }
    .header p { color: #64748b; margin: 0; font-size: 12px; }
    h2 { color: #465362; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 8px; border-left: 3px solid #1E6B9B; padding-left: 8px; }
    .count { color: #94a3b8; font-weight: normal; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th { background: #f1f5f9; text-align: left; padding: 6px 10px; font-size: 11px; text-transform: uppercase; color: #64748b; }
    td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; }
    .empty { color: #94a3b8; font-style: italic; font-size: 12px; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Faaliyet Raporu — ${name}</h1>
    <p>Dönem: ${dateRange} &nbsp;|&nbsp; Oluşturulma: ${new Date().toLocaleDateString("tr-TR")}</p>
  </div>
  ${sectionsHtml}
  <br/>
  <button onclick="window.print()" style="padding:8px 20px;background:#1E6B9B;color:white;border:none;border-radius:4px;cursor:pointer;">PDF olarak kaydet (Yazdır)</button>
</body>
</html>`;
}
