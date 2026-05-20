"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Home, ChevronRight, X, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/toast";

interface Project { id: number; projectNo?: string; title: string; supportingInstitution?: string; status: string; date: string; }

const EMPTY_FORM = { projectNo: "", title: "", supportingInstitution: "", status: "Devam Ediyor", date: "" };
const API = "/api/projeler-ve-patentler/projeler";

export default function ProjelerPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try { setLoading(true); const res = await fetch(API); const json = await res.json(); if (Array.isArray(json)) setData(json); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    if (!form.title.trim()) { toast(t("common.fill_required"), "error"); return; }
    setSaving(true);
    try { const res = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (!res.ok) throw new Error(); setForm({ ...EMPTY_FORM }); setCreating(false); fetchData(); toast(t("common.saved"), "success"); }
    catch { toast(t("common.error_save"), "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirm_delete"))) return;
    try { const res = await fetch(`${API}/${id}`, { method: "DELETE" }); if (!res.ok) throw new Error(); fetchData(); toast(t("common.deleted"), "success"); }
    catch { toast(t("common.error_delete"), "error"); }
  };

  const handleEditSave = async (id: number) => {
    setSaving(true);
    try { const res = await fetch(`${API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (!res.ok) throw new Error(); setEditingId(null); fetchData(); toast(t("common.saved"), "success"); }
    catch { toast(t("common.error_save"), "error"); }
    finally { setSaving(false); }
  };

  const startEdit = (item: Project) => {
    setEditingId(item.id);
    setForm({ projectNo: item.projectNo || "", title: item.title, supportingInstitution: item.supportingInstitution || "", status: item.status, date: item.date });
    setCreating(true);
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.projectNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.supportingInstitution || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const f = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(prev => ({ ...prev, [key]: e.target.value }));
  const inputCls = "w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#1E6B9B] transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-foreground flex items-center gap-1"><Home size={14} /> {t("common.home")}</Link></li>
          <ChevronRight size={14} /><li><span className="text-foreground font-medium">{t("navbar.projeler_patentler")}</span></li>
          <ChevronRight size={14} /><li><span className="text-foreground font-medium">{t("menu.projeler")}</span></li>
        </ol>
      </nav>
      <div className="mb-6"><h1 className="text-3xl font-bold tracking-tight">{t("menu.projeler")}</h1></div>
      <Card className="shadow-sm border-border">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button onClick={() => { setCreating(v => !v); setEditingId(null); setForm({ ...EMPTY_FORM }); }} className="gap-2">
              {creating ? <X size={16} /> : <Plus size={16} />} {creating ? t("common.cancel") : t("common.create")}
            </Button>
            <div className="relative w-full sm:w-[350px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder={t("common.search")} className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          {creating && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{t("project.project_no") || "Proje No"}</label>
                  <Input value={form.projectNo} onChange={f("projectNo")} placeholder="Proje numarası" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("fields.project_name")} <span className="text-red-500">*</span></label>
                  <Input value={form.title} onChange={f("title")} placeholder={t("fields.project_name_placeholder")} className="bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>{t("project.supporting_institution") || "Destekleyen Kurum"}</label>
                  <Input value={form.supportingInstitution} onChange={f("supportingInstitution")} placeholder="Kurum adı" className="bg-white" />
                </div>
                <div>
                  <label className={labelCls}>{t("common.status")}</label>
                  <select value={form.status} onChange={f("status")} className={inputCls}>
                    <option value="Devam Ediyor">{t("thesis.in_progress") || "Devam Ediyor"}</option>
                    <option value="Tamamlandı">{t("thesis.completed") || "Tamamlandı"}</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t("common.date")}</label>
                  <Input value={form.date} onChange={f("date")} type="date" className="bg-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => { setCreating(false); setEditingId(null); }}>{t("common.cancel")}</Button>
                <Button onClick={() => editingId ? handleEditSave(editingId) : handleCreate()} disabled={saving} className="bg-[#1E6B9B] hover:bg-[#165375]">
                  {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}{t("common.save")}
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
                  <TableHead className="w-[100px]">{t("project.project_no") || "Proje No"}</TableHead>
                  <TableHead>{t("fields.project_name")}</TableHead>
                  <TableHead>{t("project.supporting_institution") || "Destekleyen Kurum"}</TableHead>
                  <TableHead>{t("common.date")}</TableHead>
                  <TableHead>{t("common.status")}</TableHead>
                  <TableHead className="text-right">{t("common.options")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} className="h-32 text-center"><div className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> {t("common.loading")}</div></TableCell></TableRow>
                ) : filteredData.length > 0 ? filteredData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-sm font-mono">{item.projectNo || "-"}</TableCell>
                    <TableCell className="font-medium text-primary">{item.title}</TableCell>
                    <TableCell className="text-sm">{item.supportingInstitution || "-"}</TableCell>
                    <TableCell className="text-sm">{item.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "Tamamlandı" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {item.status}
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
                  <TableRow><TableCell colSpan={7} className="h-32 text-center text-muted-foreground">{t("common.no_records")}</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
