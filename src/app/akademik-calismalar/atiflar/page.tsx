"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Home, ChevronRight, Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";

interface Citation {
  id: number;
  sourceType?: string;
  sourceTitle?: string;
  sourceYear?: string;
  citationYear?: string;
  ssci?: number;
  alanEndeksleri?: number;
  ulakbim?: number;
  digerUluslararasi?: number;
  uluslararasiKitap?: number;
  ulusalKitap?: number;
  guzelSanatlarUluslararasi?: number;
  guzelSanatlarUlusal?: number;
}

const SOURCE_TYPES = [
  { key: "publication", label: "Yayınlar" },
  { key: "book", label: "Kitaplar" },
  { key: "bildiri", label: "Bildiriler" },
  { key: "sanatsal", label: "Sanatsal Etkinlikler" },
  { key: "proje", label: "Projeler" },
  { key: "patent", label: "Patentler" },
  { key: "tasarim", label: "Tasarımlar" },
  { key: "thesis", label: "Tezler" },
];

const CITATION_COLS = [
  { key: "ssci", label: "SSCI, SCI-Exp, AHCI" },
  { key: "alanEndeksleri", label: "Alan Endeksleri" },
  { key: "ulakbim", label: "ULAKBİM" },
  { key: "digerUluslararasi", label: "Diğer Uluslararası" },
  { key: "uluslararasiKitap", label: "Uluslararası Kitap" },
  { key: "ulusalKitap", label: "Ulusal Kitap" },
  { key: "guzelSanatlarUluslararasi", label: "G.S. Uluslararası" },
  { key: "guzelSanatlarUlusal", label: "G.S. Ulusal" },
];

const EMPTY_FORM = {
  sourceType: "publication",
  sourceTitle: "",
  sourceYear: "",
  citationYear: new Date().getFullYear().toString(),
  ssci: "0", alanEndeksleri: "0", ulakbim: "0", digerUluslararasi: "0",
  uluslararasiKitap: "0", ulusalKitap: "0", guzelSanatlarUluslararasi: "0", guzelSanatlarUlusal: "0",
};

export default function AtiflarPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/akademik-calismalar/atiflar");
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!form.sourceTitle.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/akademik-calismalar/atiflar", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form)
      });
      setForm({ ...EMPTY_FORM }); setShowForm(false); fetchData();
    } finally { setSaving(false); }
  };

  const handleSaveEdit = async (id: number) => {
    setSaving(true);
    try {
      await fetch(`/api/akademik-calismalar/atiflar/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editValues)
      });
      setEditingId(null); fetchData();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirm_delete"))) return;
    await fetch(`/api/akademik-calismalar/atiflar/${id}`, { method: "DELETE" });
    fetchData();
  };

  const startEdit = (item: Citation) => {
    setEditingId(item.id);
    setEditValues({
      ssci: String(item.ssci || 0), alanEndeksleri: String(item.alanEndeksleri || 0),
      ulakbim: String(item.ulakbim || 0), digerUluslararasi: String(item.digerUluslararasi || 0),
      uluslararasiKitap: String(item.uluslararasiKitap || 0), ulusalKitap: String(item.ulusalKitap || 0),
      guzelSanatlarUluslararasi: String(item.guzelSanatlarUluslararasi || 0),
      guzelSanatlarUlusal: String(item.guzelSanatlarUlusal || 0),
      citationYear: item.citationYear || new Date().getFullYear().toString(),
    });
  };

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const inputCls = "w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#1E6B9B] transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  const citationYear = data.length > 0 ? (data[0].citationYear || new Date().getFullYear().toString()) : new Date().getFullYear().toString();

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-foreground flex items-center gap-1"><Home size={14} /> {t("common.home")}</Link></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("navbar.akademik_calismalar")}</span></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("menu.atiflar")}</span></li>
        </ol>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("menu.atiflar")}</h1>
        <Button onClick={() => setShowForm(v => !v)} className="gap-2">
          <Plus size={16} /> {t("common.create")}
        </Button>
      </div>

      {/* Yeni Atıf Formu */}
      {showForm && (
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base">{t("common.create")} — Atıf Ekle</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Kaynak Türü</label>
                <select value={form.sourceType} onChange={f("sourceType")} className={inputCls}>
                  {SOURCE_TYPES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Başlık / Dergi Adı <span className="text-red-500">*</span></label>
                <Input value={form.sourceTitle} onChange={f("sourceTitle")} placeholder="Kaynak başlığı" className="bg-white" />
              </div>
              <div>
                <label className={labelCls}>Kaynak Yılı</label>
                <Input value={form.sourceYear} onChange={f("sourceYear")} placeholder="Yıl" className="bg-white" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Atıf Yılı</label>
              <Input value={form.citationYear} onChange={f("citationYear")} placeholder="2025" className="bg-white w-32" />
            </div>
            <p className="text-xs text-slate-500 font-medium">{form.citationYear} Yılındaki Atıf Sayıları:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CITATION_COLS.map(col => (
                <div key={col.key}>
                  <label className={labelCls}>{col.label}</label>
                  <Input value={(form as Record<string, string>)[col.key]} onChange={f(col.key as keyof typeof EMPTY_FORM)} type="number" min="0" className="bg-white" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setShowForm(false)}>{t("common.cancel")}</Button>
              <Button onClick={handleCreate} disabled={saving} className="bg-[#1E6B9B] hover:bg-[#165375]">
                {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
                {t("common.save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
      ) : (
        SOURCE_TYPES.map(sourceType => {
          const items = data.filter(d => d.sourceType === sourceType.key);
          if (items.length === 0) return null;
          return (
            <Card key={sourceType.key} className="mb-6 shadow-sm">
              <CardHeader className="pb-2 border-b bg-slate-50/50">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-600">{sourceType.label}</CardTitle>
                <p className="text-xs text-red-500">Atıf Sayılarında Öğretim Üyesi / Elemanın Kendi Atıfları Sayılmamalıdır</p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow>
                        <TableHead className="w-[40px]">#</TableHead>
                        <TableHead>Başlık / Dergi Adı</TableHead>
                        <TableHead className="w-[60px]">Yıl</TableHead>
                        <TableHead className="w-[60px]">Atıf Yılı</TableHead>
                        {CITATION_COLS.map(col => (
                          <TableHead key={col.key} className="text-center text-xs w-[80px]">{col.label}</TableHead>
                        ))}
                        <TableHead className="text-right w-[100px]">{t("common.options")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium text-primary text-sm">{item.sourceTitle || "-"}</TableCell>
                          <TableCell className="text-sm">{item.sourceYear || "-"}</TableCell>
                          <TableCell className="text-sm">{item.citationYear || "-"}</TableCell>
                          {CITATION_COLS.map(col => (
                            <TableCell key={col.key} className="text-center">
                              {editingId === item.id ? (
                                <Input
                                  type="number" min="0"
                                  value={editValues[col.key] || "0"}
                                  onChange={e => setEditValues(prev => ({ ...prev, [col.key]: e.target.value }))}
                                  className="h-7 w-16 text-center bg-white text-xs"
                                />
                              ) : (
                                <span className={`text-sm font-medium ${(item[col.key as keyof Citation] as number) > 0 ? "text-[#1E6B9B]" : "text-slate-300"}`}>
                                  {item[col.key as keyof Citation] as number || 0}
                                </span>
                              )}
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {editingId === item.id ? (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 text-green-600 text-xs" onClick={() => handleSaveEdit(item.id)} disabled={saving}>
                                    {saving ? <Loader2 size={12} className="animate-spin" /> : t("common.save")}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 text-slate-500 text-xs" onClick={() => setEditingId(null)}>{t("common.cancel")}</Button>
                                </>
                              ) : (
                                <>
                                  <Button variant="ghost" size="sm" className="h-7 text-blue-600 text-xs" onClick={() => startEdit(item)}>
                                    {t("common.edit")}
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={14} />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      {!loading && data.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="h-32 flex items-center justify-center text-muted-foreground">
            {t("common.no_records")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
