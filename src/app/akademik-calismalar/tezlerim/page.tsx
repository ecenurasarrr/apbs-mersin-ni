"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Home, ChevronRight, X, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";

interface Thesis {
  id: number;
  advisorName?: string;
  advisorSurname?: string;
  department?: string;
  title: string;
  titleEn?: string;
  abstract?: string;
  abstractEn?: string;
  pageCount?: string;
  status?: string;
  keywords?: string;
  file?: string;
  url?: string;
  city?: string;
  country?: string;
  date: string;
}

const EMPTY_FORM = {
  advisorCount: "1",
  advisorName: "", advisorMidName: "", advisorSurname: "",
  coAdvisorName: "", coAdvisorMidName: "", coAdvisorSurname: "",
  university: "", universityOther: "",
  institute: "", instituteOther: "",
  department: "", departmentOther: "",
  title: "", titleEn: "",
  abstract: "", abstractEn: "",
  pageCount: "", status: "0",
  keywords: "",
  file: "", url: "", city: "", country: "251", date: "",
};

export default function TezlerimPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [showCoAdvisor, setShowCoAdvisor] = useState(false);

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
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/akademik-calismalar/tezlerim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ ...EMPTY_FORM });
      setCreating(false);
      fetchData();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirm_delete"))) return;
    await fetch(`/api/akademik-calismalar/tezlerim/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleEditSave = async (id: number) => {
    setSaving(true);
    try {
      await fetch(`/api/akademik-calismalar/tezlerim/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
      fetchData();
    } finally { setSaving(false); }
  };

  const startEdit = (thesis: Thesis) => {
    setEditingId(thesis.id);
    setForm({
      ...EMPTY_FORM,
      advisorName: thesis.advisorName || "",
      advisorSurname: thesis.advisorSurname || "",
      department: thesis.department || "",
      title: thesis.title,
      titleEn: thesis.titleEn || "",
      abstract: thesis.abstract || "",
      abstractEn: thesis.abstractEn || "",
      pageCount: thesis.pageCount || "",
      status: thesis.status || "0",
      keywords: thesis.keywords || "",
      file: thesis.file || "",
      url: thesis.url || "",
      city: thesis.city || "",
      country: thesis.country || "251",
      date: thesis.date,
    });
    setCreating(true);
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.advisorName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const inputCls = "w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#1E6B9B] transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

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

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("menu.tezlerim")}</h1>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button onClick={() => { setCreating(v => !v); setEditingId(null); setForm({ ...EMPTY_FORM }); setShowCoAdvisor(false); }} className="gap-2">
              {creating ? <X size={16} /> : <Plus size={16} />}
              {creating ? t("common.cancel") : t("common.create")}
            </Button>
            <div className="relative w-full sm:w-[350px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder={t("common.search")} className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>

          {creating && (
            <div className="mt-4 space-y-4 border-t pt-4">
              {/* Danışman */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className={labelCls}>{t("thesis.advisor_count")}</label>
                  <select value={form.advisorCount} onChange={e => { f("advisorCount")(e); setShowCoAdvisor(e.target.value === "2"); }} className={inputCls}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.advisor_name")}</label>
                  <Input value={form.advisorName} onChange={f("advisorName")} placeholder="Ad" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.advisor_mid")}</label>
                  <Input value={form.advisorMidName} onChange={f("advisorMidName")} placeholder="Orta Ad" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.advisor_surname")}</label>
                  <Input value={form.advisorSurname} onChange={f("advisorSurname")} placeholder="Soyad" className="bg-white" />
                </div>
              </div>

              {showCoAdvisor && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>{t("thesis.co_advisor_name")}</label>
                    <Input value={form.coAdvisorName} onChange={f("coAdvisorName")} placeholder="Ad" className="bg-white" />
                  </div>
                  <div>
                    <label className={labelCls}>{t("thesis.co_advisor_mid")}</label>
                    <Input value={form.coAdvisorMidName} onChange={f("coAdvisorMidName")} placeholder="Orta Ad" className="bg-white" />
                  </div>
                  <div>
                    <label className={labelCls}>{t("thesis.co_advisor_surname")}</label>
                    <Input value={form.coAdvisorSurname} onChange={f("coAdvisorSurname")} placeholder="Soyad" className="bg-white" />
                  </div>
                </div>
              )}

              {/* Üniversite & Enstitü */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("thesis.university")}</label>
                  <Input value={form.university} onChange={f("university")} placeholder="Üniversite adı" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.institute")}</label>
                  <Input value={form.institute} onChange={f("institute")} placeholder="Enstitü adı" className="bg-white" />
                </div>
              </div>

              {/* Bölüm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("fields.department")}</label>
                  <Input value={form.department} onChange={f("department")} placeholder={t("fields.department_placeholder")} className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.department_other")}</label>
                  <Input value={form.departmentOther} onChange={f("departmentOther")} placeholder="Diğer" className="bg-white" />
                </div>
              </div>

              {/* Başlık */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("fields.title")} (TR) <span className="text-red-500">*</span></label>
                  <Input value={form.title} onChange={f("title")} placeholder="Başlık" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("fields.title")} (EN)</label>
                  <Input value={form.titleEn} onChange={f("titleEn")} placeholder="Title" className="bg-white" />
                </div>
              </div>

              {/* Özet */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("thesis.abstract")} (TR)</label>
                  <textarea value={form.abstract} onChange={f("abstract")} placeholder="Özet" className={`${inputCls} min-h-[80px] resize-y`} />
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.abstract")} (EN)</label>
                  <textarea value={form.abstractEn} onChange={f("abstractEn")} placeholder="Abstract" className={`${inputCls} min-h-[80px] resize-y`} />
                </div>
              </div>

              {/* Sayfa, Durum, Tarih */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>{t("thesis.page_count")}</label>
                  <Input value={form.pageCount} onChange={f("pageCount")} placeholder="Sayfa sayısı" type="number" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.status")}</label>
                  <select value={form.status} onChange={f("status")} className={inputCls}>
                    <option value="0">{t("thesis.in_progress")}</option>
                    <option value="1">{t("thesis.completed")}</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("common.date")}</label>
                  <Input value={form.date} onChange={f("date")} type="date" className="bg-white" />
                </div>
              </div>

              {/* Anahtar Kelimeler */}
              <div>
                <label className={labelCls}>{t("thesis.keywords")}</label>
                <Input value={form.keywords} onChange={f("keywords")} placeholder="Anahtar kelimeler (virgülle ayırın)" className="bg-white" />
              </div>

              {/* Dosya, URL, Şehir, Ülke */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("fields.file")}</label>
                  <Input value={form.file} onChange={f("file")} placeholder={t("fields.file_placeholder")} className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>URL</label>
                  <Input value={form.url} onChange={f("url")} placeholder="http://..." className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("thesis.city")}</label>
                  <Input value={form.city} onChange={f("city")} placeholder="Şehir" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("fields.country")}</label>
                  <Input value={form.country} onChange={f("country")} placeholder={t("fields.country_placeholder")} className="bg-white" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => { setCreating(false); setEditingId(null); }}>{t("common.cancel")}</Button>
                <Button onClick={() => editingId ? handleEditSave(editingId) : handleCreate()} disabled={saving} className="bg-[#1E6B9B] hover:bg-[#165375]">
                  {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
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
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>{t("fields.department")}</TableHead>
                  <TableHead>{t("thesis.advisor_name")}</TableHead>
                  <TableHead>{t("fields.title")}</TableHead>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead>{t("thesis.status")}</TableHead>
                  <TableHead className="text-right">{t("common.options")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> {t("common.loading")}</div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? filteredData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-sm">{item.department || "-"}</TableCell>
                    <TableCell className="text-sm">{[item.advisorName, item.advisorSurname].filter(Boolean).join(" ") || "-"}</TableCell>
                    <TableCell className="font-medium text-primary max-w-[200px] truncate">{item.title}</TableCell>
                    <TableCell className="text-sm">{item.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "1" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {item.status === "1" ? t("thesis.completed") : t("thesis.in_progress")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => startEdit(item)}><Edit size={16} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">{t("common.no_records")}</TableCell>
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
