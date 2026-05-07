"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Trash2, Home, ChevronRight, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";

interface Thesis {
  id: number;
  advisorName: string | null;
  advisorSurname: string | null;
  department: string | null;
  title: string;
  titleEn: string | null;
  status: string | null;
  date: string;
}

const UNIVERSITIES = ["Mersin Üniversitesi", "Ankara Üniversitesi", "İstanbul Üniversitesi", "Ege Üniversitesi", "Diğer"];
const INSTITUTES = ["Fen Bilimleri Enstitüsü", "Sosyal Bilimler Enstitüsü", "Sağlık Bilimleri Enstitüsü", "Eğitim Bilimleri Enstitüsü", "Diğer"];

const emptyForm = {
  advisorCount: "1",
  advisorName: "", advisorMidName: "", advisorSurname: "",
  coAdvisorName: "", coAdvisorMidName: "", coAdvisorSurname: "",
  university: "Mersin Üniversitesi", universityOther: "",
  institute: "Fen Bilimleri Enstitüsü", instituteOther: "",
  department: "", departmentOther: "",
  title: "", titleEn: "",
  abstract: "", abstractEn: "",
  pageCount: "",
  status: "0",
  keywords: "",
  file: "", url: "", city: "", country: "Türkiye",
  date: "",
};

export default function TezlerimPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/akademik-calismalar/tezlerim");
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.date.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/akademik-calismalar/tezlerim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ ...emptyForm });
      setCreating(false);
      fetchData();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirm_delete"))) return;
    await fetch(`/api/akademik-calismalar/tezlerim/${id}`, { method: "DELETE" });
    fetchData();
  };

  const f = (key: keyof typeof form, value: string) => setForm(p => ({ ...p, [key]: value }));

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.titleEn ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.department ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusLabel = (s: string | null) => s === "1"
    ? <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Tamamlandı</span>
    : <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Devam Ediyor</span>;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-foreground flex items-center gap-1"><Home size={14} /> {t("common.home")}</Link></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("navbar.akademik_calismalar")}</span></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("menu.tezlerim")}</span></li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("menu.tezlerim")}</h1>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button onClick={() => { setCreating(v => !v); setForm({ ...emptyForm }); }} className="gap-2">
              {creating ? <X size={16} /> : <Plus size={16} />}
              {creating ? t("common.cancel") : t("common.create")}
            </Button>
            <div className="relative w-full sm:w-[350px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder={t("common.search")} className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {/* FORM */}
          {creating && (
            <div className="mt-4 space-y-4 border rounded-lg p-4 bg-white">
              {/* Danışman */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Danışman Sayısı</label>
                  <select value={form.advisorCount} onChange={e => f("advisorCount", e.target.value)} className="w-full px-3 py-2 rounded border border-input bg-white text-sm">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Danışman Adı</label>
                  <Input value={form.advisorName} onChange={e => f("advisorName", e.target.value)} placeholder="Adı" className="bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Orta Adı</label>
                  <Input value={form.advisorMidName} onChange={e => f("advisorMidName", e.target.value)} placeholder="Orta Adı" className="bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Soyadı</label>
                  <Input value={form.advisorSurname} onChange={e => f("advisorSurname", e.target.value)} placeholder="Soyadı" className="bg-white" />
                </div>
              </div>

              {form.advisorCount === "2" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Eş Danışman Adı</label>
                    <Input value={form.coAdvisorName} onChange={e => f("coAdvisorName", e.target.value)} placeholder="Adı" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Orta Adı</label>
                    <Input value={form.coAdvisorMidName} onChange={e => f("coAdvisorMidName", e.target.value)} placeholder="Orta Adı" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Soyadı</label>
                    <Input value={form.coAdvisorSurname} onChange={e => f("coAdvisorSurname", e.target.value)} placeholder="Soyadı" className="bg-white" />
                  </div>
                </div>
              )}

              {/* Üniversite & Enstitü */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Üniversite</label>
                  <select value={form.university} onChange={e => f("university", e.target.value)} className="w-full px-3 py-2 rounded border border-input bg-white text-sm">
                    {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  {form.university === "Diğer" && <Input value={form.universityOther} onChange={e => f("universityOther", e.target.value)} placeholder="Üniversite adı" className="bg-white mt-1" />}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Enstitü</label>
                  <select value={form.institute} onChange={e => f("institute", e.target.value)} className="w-full px-3 py-2 rounded border border-input bg-white text-sm">
                    {INSTITUTES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  {form.institute === "Diğer" && <Input value={form.instituteOther} onChange={e => f("instituteOther", e.target.value)} placeholder="Enstitü adı" className="bg-white mt-1" />}
                </div>
              </div>

              {/* Ana Bilim Dalı */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Ana Bilim Dalı</label>
                <Input value={form.department} onChange={e => f("department", e.target.value)} placeholder="Ana Bilim Dalı" className="bg-white" />
              </div>

              {/* Başlık */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Başlık (Türkçe) <span className="text-red-500">*</span></label>
                  <Input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Tez başlığı" className="bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Title (English)</label>
                  <Input value={form.titleEn} onChange={e => f("titleEn", e.target.value)} placeholder="Thesis title" className="bg-white" />
                </div>
              </div>

              {/* Özet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Özet</label>
                  <textarea value={form.abstract} onChange={e => f("abstract", e.target.value)} placeholder="Özet" rows={3} className="w-full px-3 py-2 rounded border border-input bg-white text-sm resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Abstract</label>
                  <textarea value={form.abstractEn} onChange={e => f("abstractEn", e.target.value)} placeholder="Abstract" rows={3} className="w-full px-3 py-2 rounded border border-input bg-white text-sm resize-none" />
                </div>
              </div>

              {/* Sayfa, Durum, Tarih */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Sayfa Sayısı</label>
                  <Input value={form.pageCount} onChange={e => f("pageCount", e.target.value)} placeholder="Sayfa sayısı" type="number" className="bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Tez Durumu</label>
                  <select value={form.status} onChange={e => f("status", e.target.value)} className="w-full px-3 py-2 rounded border border-input bg-white text-sm">
                    <option value="0">Devam Ediyor</option>
                    <option value="1">Tamamlandı</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Tarih <span className="text-red-500">*</span></label>
                  <Input value={form.date} onChange={e => f("date", e.target.value)} type="date" className="bg-white" />
                </div>
              </div>

              {/* Anahtar Kelimeler */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Anahtar Kelimeler (virgülle ayırın)</label>
                <Input value={form.keywords} onChange={e => f("keywords", e.target.value)} placeholder="kelime1, kelime2, ..." className="bg-white" />
              </div>

              {/* Dosya, URL, Şehir, Ülke */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Dosya URL</label>
                  <Input value={form.file} onChange={e => f("file", e.target.value)} placeholder="http://..." className="bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">URL</label>
                  <Input value={form.url} onChange={e => f("url", e.target.value)} placeholder="http://..." className="bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Şehir</label>
                  <Input value={form.city} onChange={e => f("city", e.target.value)} placeholder="Şehir" className="bg-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Ülke</label>
                  <Input value={form.country} onChange={e => f("country", e.target.value)} placeholder="Ülke" className="bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setCreating(false)}>{t("common.cancel")}</Button>
                <Button onClick={handleCreate} disabled={saving || !form.title.trim() || !form.date.trim()} className="bg-[#1E6B9B] hover:bg-[#165375]">
                  {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  {t("common.save")}
                </Button>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Danışman</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">{t("common.options")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> {t("common.loading")}</div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? filteredData.map((item, index) => (
                  <>
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">{item.title}</div>
                        {item.titleEn && <div className="text-xs text-slate-400 italic">{item.titleEn}</div>}
                      </TableCell>
                      <TableCell className="text-sm">{[item.advisorName, item.advisorSurname].filter(Boolean).join(" ") || "-"}</TableCell>
                      <TableCell>{statusLabel(item.status)}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                            {expandedId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedId === item.id && (
                      <TableRow key={`${item.id}-detail`}>
                        <TableCell colSpan={6} className="bg-slate-50/50 px-6 py-4">
                          <ThesisDetail id={item.id} onClose={() => setExpandedId(null)} onSaved={fetchData} t={t} />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">{t("common.no_records")}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ThesisDetail({ id, onClose, onSaved, t }: { id: number; onClose: () => void; onSaved: () => void; t: (k: string) => string }) {
  const [thesis, setThesis] = useState<Record<string, string> | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/akademik-calismalar/tezlerim`)
      .then(r => r.json())
      .then((data: Record<string, string>[]) => {
        const found = data.find((d) => String(d.id) === String(id));
        if (found) { setThesis(found); setForm(found); }
      });
  }, [id]);

  const f = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/akademik-calismalar/tezlerim/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  if (!thesis) return <div className="flex justify-center py-4"><Loader2 className="animate-spin h-5 w-5 text-slate-400" /></div>;

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ["advisorName","Danışman Adı"], ["advisorSurname","Soyadı"],
          ["university","Üniversite"], ["institute","Enstitü"],
          ["department","Ana Bilim Dalı"], ["pageCount","Sayfa Sayısı"],
          ["city","Şehir"], ["country","Ülke"],
          ["url","URL"], ["file","Dosya URL"],
          ["keywords","Anahtar Kelimeler"],
        ].map(([key, label]) => (
          <div key={key} className="space-y-1">
            <label className="text-xs font-medium text-slate-500">{label}</label>
            <Input value={form[key] ?? ""} onChange={e => f(key, e.target.value)} className="h-7 text-xs bg-white" />
          </div>
        ))}
        <div className="space-y-1 col-span-2">
          <label className="text-xs font-medium text-slate-500">Başlık (TR)</label>
          <Input value={form.title ?? ""} onChange={e => f("title", e.target.value)} className="h-7 text-xs bg-white" />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-xs font-medium text-slate-500">Title (EN)</label>
          <Input value={form.titleEn ?? ""} onChange={e => f("titleEn", e.target.value)} className="h-7 text-xs bg-white" />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-xs font-medium text-slate-500">Özet</label>
          <textarea value={form.abstract ?? ""} onChange={e => f("abstract", e.target.value)} rows={2} className="w-full px-2 py-1 rounded border border-input bg-white text-xs resize-none" />
        </div>
        <div className="space-y-1 col-span-2">
          <label className="text-xs font-medium text-slate-500">Abstract</label>
          <textarea value={form.abstractEn ?? ""} onChange={e => f("abstractEn", e.target.value)} rows={2} className="w-full px-2 py-1 rounded border border-input bg-white text-xs resize-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Durum</label>
          <select value={form.status ?? "0"} onChange={e => f("status", e.target.value)} className="w-full px-2 py-1 rounded border border-input bg-white text-xs">
            <option value="0">Devam Ediyor</option>
            <option value="1">Tamamlandı</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-500">Tarih</label>
          <Input type="date" value={form.date ?? ""} onChange={e => f("date", e.target.value)} className="h-7 text-xs bg-white" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button size="sm" variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
        <Button size="sm" onClick={handleSave} disabled={saving} className="bg-[#1E6B9B] hover:bg-[#165375]">
          {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : null}{t("common.save")}
        </Button>
      </div>
    </div>
  );
}
