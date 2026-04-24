"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ChevronRight, Plus, Trash2, Edit, X, Save, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";

interface User {
  id: number;
  tcNo: string;
  fullName: string;
  email: string;
  title: string | null;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ tcNo: "", fullName: "", email: "", title: "", password: "", role: "user" });
  const [editForm, setEditForm] = useState({ fullName: "", title: "", role: "user" });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.status === 403) { setError("Bu sayfaya erişim yetkiniz yok."); return; }
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch { setError("Kullanıcılar yüklenemedi."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    setError("");
    if (!form.tcNo || !form.fullName || !form.email || !form.password) {
      setError("TC No, Ad Soyad, E-posta ve şifre zorunludur."); return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setCreating(false);
      setForm({ tcNo: "", fullName: "", email: "", title: "", password: "", role: "user" });
      fetchUsers();
    } catch { setError("Kullanıcı oluşturulamadı."); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleEditSave = async (id: number) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchUsers();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-foreground flex items-center gap-1"><Home size={14} /> {t("common.home")}</Link></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium flex items-center gap-1"><Shield size={14} /> Admin Paneli</span></li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Shield size={28} className="text-[#1E6B9B]" /> Kullanıcı Yönetimi
        </h1>
        <p className="text-muted-foreground">Sisteme kayıtlı tüm kullanıcıları yönetin.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Kullanıcılar ({users.length})</CardTitle>
            <Button onClick={() => setCreating(v => !v)} className="gap-2">
              {creating ? <X size={16} /> : <Plus size={16} />}
              {creating ? "İptal" : "Yeni Kullanıcı"}
            </Button>
          </div>

          {creating && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="TC Kimlik No" value={form.tcNo} onChange={e => setForm(p => ({...p, tcNo: e.target.value}))} className="bg-white" maxLength={11} />
              <Input placeholder="Ad Soyad" value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))} className="bg-white" />
              <Input placeholder="E-posta" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} className="bg-white" />
              <Input placeholder="Unvan (opsiyonel)" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="bg-white" />
              <Input placeholder="Şifre" type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} className="bg-white" />
              <select value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} className="px-3 py-2 rounded-md border border-input bg-white text-sm">
                <option value="user">Kullanıcı</option>
                <option value="admin">Admin</option>
              </select>
              <Button onClick={handleCreate} className="sm:col-span-2 bg-[#1E6B9B] hover:bg-[#165375]">
                Kaydet
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>TC No</TableHead>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Unvan</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" />
                    </TableCell>
                  </TableRow>
                ) : users.length > 0 ? users.map((u, i) => (
                  <TableRow key={u.id} className="hover:bg-slate-50/50">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-mono text-sm">{u.tcNo}</TableCell>
                    <TableCell>
                      {editingId === u.id ? (
                        <Input value={editForm.fullName} onChange={e => setEditForm(p => ({...p, fullName: e.target.value}))} className="h-7 text-sm bg-white" />
                      ) : <span className="font-medium">{u.fullName}</span>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{u.email}</TableCell>
                    <TableCell>
                      {editingId === u.id ? (
                        <Input value={editForm.title} onChange={e => setEditForm(p => ({...p, title: e.target.value}))} className="h-7 text-sm bg-white" placeholder="Unvan" />
                      ) : u.title || "-"}
                    </TableCell>
                    <TableCell>
                      {editingId === u.id ? (
                        <select value={editForm.role} onChange={e => setEditForm(p => ({...p, role: e.target.value}))} className="px-2 py-1 rounded border border-input bg-white text-xs">
                          <option value="user">Kullanıcı</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                          {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === u.id ? (
                          <>
                            <Button variant="ghost" size="sm" className="h-7 text-green-600" onClick={() => handleEditSave(u.id)}><Save size={14} /></Button>
                            <Button variant="ghost" size="sm" className="h-7 text-slate-500" onClick={() => setEditingId(null)}><X size={14} /></Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-blue-600" onClick={() => { setEditingId(u.id); setEditForm({ fullName: u.fullName, title: u.title || "", role: u.role }); }}>
                              <Edit size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-600" onClick={() => handleDelete(u.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">Kullanıcı bulunamadı.</TableCell>
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
