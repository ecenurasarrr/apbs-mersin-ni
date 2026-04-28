"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ChevronRight, FileText, Download, Edit2, Save, X, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";

interface UserProfile {
  id: number; tcNo: string; fullName: string; title: string | null;
  birthDate: string | null; homeAddress: string | null; workAddress: string | null;
  gsm: string | null; phone: string | null; fax: string | null;
  email: string; otherEmail: string | null; url: string | null;
}

interface StatItem { label: string; value: number; }
interface Stats {
  akademik: StatItem[]; projeler: StatItem[]; etkinlikler: StatItem[];
  arastirmalar: StatItem[]; taninma: StatItem[]; toplam: number;
}

interface CVSection {
  key: string;
  api: string;
  keys: string[];
}

const CV_SECTIONS_CONFIG: CVSection[] = [
  { key: "cv.publications", api: "/api/akademik-calismalar/yayinlar", keys: ["title", "date"] },
  { key: "cv.books", api: "/api/akademik-calismalar/kitaplar", keys: ["title", "date"] },
  { key: "cv.citations", api: "/api/akademik-calismalar/atiflar", keys: ["title", "date"] },
  { key: "cv.my_theses", api: "/api/akademik-calismalar/tezlerim", keys: ["title", "date"] },
  { key: "cv.supervised_theses", api: "/api/akademik-calismalar/yonetilen-tezler", keys: ["title", "student", "date"] },
  { key: "cv.projects", api: "/api/projeler-ve-patentler/projeler", keys: ["title", "status", "date"] },
  { key: "cv.patents", api: "/api/projeler-ve-patentler/patentler", keys: ["title", "number", "date"] },
  { key: "cv.peer_reviews", api: "/api/hakemlikler", keys: ["name", "year"] },
  { key: "cv.awards", api: "/api/oduller", keys: ["name", "year"] },
  { key: "cv.scientific_meetings", api: "/api/etkinlikler/bilimsel-toplantilar", keys: ["title", "date"] },
];

function buildCvHtml(title: string, lang: "tr" | "en", data: UserProfile, sections: { label: string; rows: Record<string, string>[] }[], cvLabels: Record<string, string>) {
  const labels = lang === "tr"
    ? { tc: cvLabels.tc, birth: cvLabels.birth, home: cvLabels.home_address, work: cvLabels.work_address, gsm: cvLabels.gsm, email: cvLabels.email, other: cvLabels.other_email, url: cvLabels.url }
    : { tc: cvLabels.tc, birth: cvLabels.birth, home: cvLabels.home_address, work: cvLabels.work_address, gsm: cvLabels.gsm, email: cvLabels.email, other: cvLabels.other_email, url: cvLabels.url };
  const birth = data.birthDate ? new Date(data.birthDate).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-GB") : "-";

  const sectionsHtml = sections.filter(s => s.rows.length > 0).map(s => {
    const keys = Object.keys(s.rows[0]).filter(k => !["id","userId","createdAt","updatedAt"].includes(k));
    const rows = s.rows.map(r => `<tr>${keys.map(k => `<td>${r[k] ?? "-"}</td>`).join("")}</tr>`).join("");
    const headers = keys.map(k => `<th style="background:#f1f5f9;text-align:left;padding:6px 10px;font-size:11px;text-transform:uppercase;color:#64748b">${k}</th>`).join("");
    return `<h2>${s.label} (${s.rows.length})</h2><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  }).join("");

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"/><title>${title} - ${data.fullName}</title>
  <style>body{font-family:Arial,sans-serif;max-width:900px;margin:30px auto;padding:0 24px;color:#1e293b;font-size:13px}h1{color:#1E6B9B;border-bottom:2px solid #1E6B9B;padding-bottom:8px;font-size:20px}h2{color:#465362;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-top:20px;border-left:3px solid #1E6B9B;padding-left:8px}table{width:100%;border-collapse:collapse;margin-top:6px;margin-bottom:8px}td,th{padding:6px 10px;border-bottom:1px solid #f1f5f9;font-size:12px}td:first-child{font-weight:bold;color:#64748b}@media print{button{display:none}}</style>
  </head><body>
  <h1>${data.fullName}</h1>
  <p style="color:#64748b;font-size:12px;margin-top:-8px">${title} — ${lang === "tr" ? "Oluşturulma:" : "Created:"} ${new Date().toLocaleDateString(lang === "tr" ? "tr-TR" : "en-GB")}</p>
  <h2>${cvLabels.personal_info}</h2>
  <table>
  <tr><td>${labels.tc}</td><td>${data.tcNo}</td></tr>
  <tr><td>${labels.birth}</td><td>${birth}</td></tr>
  <tr><td>${labels.home}</td><td>${data.homeAddress ?? "-"}</td></tr>
  <tr><td>${labels.work}</td><td>${data.workAddress ?? "-"}</td></tr>
  <tr><td>${labels.gsm}</td><td>${data.gsm ?? "-"}</td></tr>
  <tr><td>${labels.email}</td><td>${data.email}</td></tr>
  <tr><td>${labels.other}</td><td>${data.otherEmail ?? "-"}</td></tr>
  <tr><td>${labels.url}</td><td>${data.url ?? "-"}</td></tr>
  </table>
  ${sectionsHtml}
  <br/><button onclick="window.print()" style="margin-top:24px;padding:8px 20px;background:#1E6B9B;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;">${lang === "tr" ? "PDF olarak kaydet (Yazdır)" : "Save as PDF (Print)"}</button>
  </body></html>`;
}

async function openCv(title: string, lang: "tr" | "en", data: UserProfile, cvSections: { label: string; api: string; }[], cvLabels: Record<string, string>) {
  const sections = await Promise.all(
    cvSections.map(async (s) => {
      try {
        const res = await fetch(s.api);
        const rows = await res.json();
        return { label: s.label, rows: Array.isArray(rows) ? rows : [] };
      } catch { return { label: s.label, rows: [] }; }
    })
  );
  const blob = new Blob([buildCvHtml(title, lang, data, sections, cvLabels)], { type: "text/html;charset=utf-8" });
  const win = window.open(URL.createObjectURL(blob), "_blank");
  if (win) win.focus();
}

function StatGroup({ title, items, color }: { title: string; items: StatItem[]; color: string }) {
  return (
    <div>
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${color}`}>{title}</h3>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between bg-slate-50 rounded px-2 py-1.5">
            <span className="text-xs text-slate-600 truncate">{item.label}</span>
            <span className={`text-sm font-bold ml-2 ${item.value > 0 ? "text-[#1E6B9B]" : "text-slate-300"}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { t, lang } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);

  // Şifre değiştirme state
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  // Dynamic CV sections with translations
  const cvSections = CV_SECTIONS_CONFIG.map((s) => ({ label: t(s.key), api: s.api }));
  const cvLabels = {
    tc: t("cv.tc"),
    birth: t("cv.birth"),
    home_address: t("cv.home_address"),
    work_address: t("cv.work_address"),
    gsm: t("cv.gsm"),
    email: t("cv.email"),
    other_email: t("cv.other_email"),
    url: t("cv.url"),
    personal_info: t("cv.personal_info"),
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/profil").then((r) => r.json()),
      fetch("/api/istatistik").then((r) => r.json()),
    ]).then(([profileData, statsData]) => {
      setProfile(profileData);
      setForm(profileData);
      setStats(statsData);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profil", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const updated = await res.json();
      setProfile(updated);
      setEditing(false);
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPwError(""); setPwSuccess(false);
    if (!currentPw || !newPw || !newPw2) { setPwError("Tüm alanları doldurunuz."); return; }
    if (newPw !== newPw2) { setPwError("Yeni şifreler eşleşmiyor."); return; }
    if (newPw.length < 6) { setPwError("Yeni şifre en az 6 karakter olmalıdır."); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }) });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error); return; }
      setPwSuccess(true);
      setCurrentPw(""); setNewPw(""); setNewPw2("");
      setTimeout(() => { setShowPwForm(false); setPwSuccess(false); }, 2000);
    } finally { setPwSaving(false); }
  };

  const initials = profile?.fullName?.split(" ").map((w) => w[0]).slice(0, 2).join("") ?? "U";
  const birthDisplay = profile?.birthDate ? new Date(profile.birthDate).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" }) : "-";

  const Field = ({ label, field, type = "text" }: { label: string; field: keyof UserProfile; type?: string }) => (
    <div className="grid grid-cols-12 gap-2 border-b border-slate-50 pb-2">
      <div className="col-span-4 font-bold text-slate-500 uppercase text-[13px] pt-1">{label}:</div>
      <div className="col-span-8">
        {editing ? (
          <Input type={type} value={type === "date" && form[field] ? String(form[field]).slice(0, 10) : String(form[field] ?? "")}
            onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))} className="h-7 text-[13px] bg-white" />
        ) : (
          <span className="text-slate-800 text-[13px]">
            {field === "birthDate" ? birthDisplay : field === "url"
              ? <a href={String(profile?.[field] ?? "")} className="text-[#1E6B9B] hover:underline break-words">{String(profile?.[field] ?? "-")}</a>
              : String(profile?.[field] ?? "-")}
          </span>
        )}
      </div>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-foreground flex items-center gap-1"><Home size={14} /> {t("common.home")}</Link></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("profile.title")}</span></li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol Kolon */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <Card className="shadow-sm border-t-4 border-t-[#5ACFCF]">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-6 bg-[#F7F7F7] rounded-t-xl">
              <Avatar className="w-28 h-28 border-4 border-orange-100 shadow-sm">
                <AvatarFallback className="bg-[#1E6B9B] text-white text-2xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-[#006DCF] mb-1">{profile?.fullName}</h2>
                {profile?.title && <p className="text-sm text-slate-500 mb-2">{profile.title}</p>}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => profile && openCv(t("profile.cv_turkish"), "tr", profile, cvSections, cvLabels)}><Download size={14} /> {t("profile.cv_turkish")}</Button>
                  <Button size="sm" variant="outline" className="h-8 gap-1 border-yellow-500 text-yellow-700 hover:bg-yellow-50" onClick={() => profile && openCv(t("profile.cv_english"), "en", profile, cvSections, cvLabels)}><Download size={14} /> {t("profile.cv_english")}</Button>
                  <Button size="sm" className="h-8 gap-1 bg-red-600 hover:bg-red-700 text-white" onClick={() => profile && openCv(t("profile.cv_performance"), "tr", profile, cvSections, cvLabels)}><Download size={14} /> {t("profile.cv_perf")}</Button>
                  <Button size="sm" variant="secondary" className="h-8 gap-1" onClick={() => profile && openCv(t("profile.cv_yok"), "tr", profile, cvSections, cvLabels)}><Download size={14} /> {t("profile.cv_yok")}</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-end mb-4 gap-2">
                <Button size="sm" variant="outline" onClick={() => { setShowPwForm((v) => !v); setPwError(""); setPwSuccess(false); }} className="gap-1">
                  <KeyRound size={14} /> Şifre Değiştir
                </Button>
                {editing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(false); setForm(profile ?? {}); }} className="gap-1"><X size={14} /> İptal</Button>
                    <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1 bg-[#1E6B9B] hover:bg-[#165375]">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Kaydet
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setEditing(true)} className="gap-1 bg-[#1E6B9B] hover:bg-[#165375]"><Edit2 size={14} /> {t("common.edit")}</Button>
                )}
              </div>

              {/* Şifre Değiştirme Formu */}
              {showPwForm && (
                <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                  <p className="text-sm font-medium text-slate-700">Şifre Değiştir</p>
                  <div className="relative">
                    <Input type={showCurrent ? "text" : "password"} placeholder="Mevcut Şifre" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="h-8 text-sm bg-white pr-9" />
                    <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">{showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  </div>
                  <div className="relative">
                    <Input type={showNew ? "text" : "password"} placeholder="Yeni Şifre (min. 6 karakter)" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="h-8 text-sm bg-white pr-9" />
                    <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">{showNew ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  </div>
                  <Input type="password" placeholder="Yeni Şifre (Tekrar)" value={newPw2} onChange={(e) => setNewPw2(e.target.value)} className="h-8 text-sm bg-white" />
                  {pwError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{pwError}</p>}
                  {pwSuccess && <p className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-2 py-1">Şifre başarıyla değiştirildi.</p>}
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => setShowPwForm(false)}>İptal</Button>
                    <Button size="sm" onClick={handleChangePassword} disabled={pwSaving} className="bg-[#1E6B9B] hover:bg-[#165375]">
                      {pwSaving ? <Loader2 size={14} className="animate-spin" /> : "Kaydet"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Field label={t("profile.tc")} field="tcNo" />
                <Field label={t("profile.birth")} field="birthDate" type="date" />
                <Field label={t("profile.home_address")} field="homeAddress" />
                <Field label={t("profile.work_address")} field="workAddress" />
                <Field label={t("profile.gsm")} field="gsm" />
                <Field label="Telefon" field="phone" />
                <Field label="Faks" field="fax" />
                <Field label={t("profile.email")} field="email" type="email" />
                <Field label={t("profile.other_email")} field="otherEmail" type="email" />
                <Field label={t("profile.url")} field="url" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Kolon - İstatistikler */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <Card className="shadow-sm flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-slate-700">{t("profile.stats")}</CardTitle>
                {stats && (
                  <span className="text-2xl font-bold text-[#1E6B9B]">{stats.toplam} <span className="text-xs font-normal text-slate-400">toplam kayıt</span></span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {stats ? (
                <>
                  <StatGroup title="Akademik Çalışmalar" items={stats.akademik} color="text-blue-600" />
                  <StatGroup title="Projeler & Patentler" items={stats.projeler} color="text-emerald-600" />
                  <StatGroup title="Etkinlikler" items={stats.etkinlikler} color="text-purple-600" />
                  <StatGroup title="Araştırmalar" items={stats.arastirmalar} color="text-red-500" />
                  <StatGroup title="Tanınma" items={stats.taninma} color="text-yellow-600" />
                </>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Faaliyet Puan Tablosu */}
      <div className="mt-8">
        <details className="group [&_summary::-webkit-details-marker]:hidden border-t-4 border-t-[#004A8F] rounded-lg shadow-sm bg-white overflow-hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-slate-900 bg-slate-50 hover:bg-slate-100 transition-colors">
            <h2 className="font-semibold text-[#004A8F]">{t("profile.activity_table")}</h2>
            <span className="relative size-5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 size-5 opacity-100 group-open:opacity-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 size-5 opacity-0 group-open:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </summary>
          <div className="border-t border-gray-200 bg-white p-6">
            {stats ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-2 font-semibold text-slate-600 border-b">Faaliyet</th>
                    <th className="text-center px-4 py-2 font-semibold text-slate-600 border-b">Kayıt Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {[...stats.akademik, ...stats.projeler, ...stats.etkinlikler, ...stats.arastirmalar, ...stats.taninma].map((item) => (
                    <tr key={item.label} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-2 text-slate-700">{item.label}</td>
                      <td className="px-4 py-2 text-center font-semibold text-[#1E6B9B]">{item.value}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td className="px-4 py-2 text-slate-800">TOPLAM</td>
                    <td className="px-4 py-2 text-center text-[#1E6B9B] text-base">{stats.toplam}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="text-slate-500 text-sm text-center py-10 border border-dashed border-slate-200 rounded-lg">{t("profile.no_activity")}</p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
