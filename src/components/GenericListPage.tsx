"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Home, ChevronRight, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";

export interface Field {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "date" | "number" | "email";
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Row {
  id: number;
  [key: string]: string | number;
}

interface GenericListPageProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  fields: Field[];
  columns: { key: string; label: string }[];
  apiPath: string; // e.g. "/api/akademik-calismalar/tezlerim"
}

function getFieldType(field: Field): string {
  if (field.type) return field.type;
  if (field.key === "date" || field.key.toLowerCase().includes("date")) return "date";
  return "text";
}

export default function GenericListPage({
  title,
  breadcrumbs,
  fields,
  columns,
  apiPath,
}: GenericListPageProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(apiPath);
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async () => {
    const hasEmpty = fields.some((f) => !formValues[f.key]?.trim());
    if (hasEmpty) return;
    try {
      await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fields.map((f) => [f.key, formValues[f.key].trim()]))),
      });
      setFormValues({});
      setCreating(false);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kaydı silmek istediğinizden emin misiniz?")) return;
    try {
      await fetch(`${apiPath}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleEditStart = (row: Row) => {
    setEditingId(row.id);
    const vals: Record<string, string> = {};
    fields.forEach((f) => { vals[f.key] = String(row[f.key] ?? ""); });
    setEditValues(vals);
  };

  const handleEditSave = async (id: number) => {
    try {
      await fetch(`${apiPath}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fields.map((f) => [f.key, editValues[f.key]]))),
      });
      setEditingId(null);
      fetchData();
    } catch (e) { console.error(e); }
  };

  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.key] ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-foreground flex items-center gap-1">
              <Home size={14} /> {t("common.home")}
            </Link>
          </li>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center space-x-2">
              <ChevronRight size={14} />
              <li>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-foreground">{crumb.label}</Link>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
              </li>
            </span>
          ))}
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button
              onClick={() => { setCreating((v) => !v); setFormValues({}); }}
              className="gap-2"
              aria-expanded={creating}
            >
              {creating ? <X size={16} /> : <Plus size={16} />}
              {creating ? t("common.cancel") : t("common.create")}
            </Button>
            <div className="relative w-full sm:w-[350px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("common.search")}
                className="pl-9 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {creating && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3 flex-wrap">
              {fields.map((field) => (
                <Input
                  key={field.key}
                  type={getFieldType(field)}
                  placeholder={field.placeholder ?? field.label}
                  value={formValues[field.key] ?? ""}
                  onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="bg-white flex-1 min-w-[160px]"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              ))}
              <Button onClick={handleCreate} className="shrink-0">Kaydet</Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="w-[60px]">#</TableHead>
                  {columns.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                  <TableHead className="text-right">{t("common.options")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2} className="h-32 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" /> Yükleniyor...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {editingId === row.id && fields.find((f) => f.key === col.key) ? (
                            <Input
                              type={getFieldType(fields.find((f) => f.key === col.key)!)}
                              value={editValues[col.key] ?? ""}
                              onChange={(e) => setEditValues((prev) => ({ ...prev, [col.key]: e.target.value }))}
                              className="h-8 bg-white"
                              onKeyDown={(e) => e.key === "Enter" && handleEditSave(row.id)}
                            />
                          ) : (
                            <span className={col.key === columns[0].key ? "font-medium text-primary" : ""}>
                              {String(row[col.key] ?? "")}
                            </span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {editingId === row.id ? (
                            <>
                              <Button variant="ghost" size="sm" className="h-8 text-green-600 hover:text-green-700" onClick={() => handleEditSave(row.id)}>Kaydet</Button>
                              <Button variant="ghost" size="sm" className="h-8 text-slate-500" onClick={() => setEditingId(null)}>İptal</Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => handleEditStart(row)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600" onClick={() => handleDelete(row.id)}>
                                <Trash2 size={16} />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length + 2} className="h-32 text-center text-muted-foreground">
                      {t("common.no_records")}
                    </TableCell>
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
