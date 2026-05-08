"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, ChevronRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

export default function YurtdisiAkademikDeneyimPage() {
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/akademik-calismalar/yurtdisi-akademik-deneyim")
      .then(r => r.json())
      .then(data => { if (data?.content) setContent(data.content); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/akademik-calismalar/yurtdisi-akademik-deneyim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="flex items-center text-sm text-muted-foreground mb-6">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-foreground flex items-center gap-1"><Home size={14} /> {t("common.home")}</Link></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("navbar.akademik_calismalar")}</span></li>
          <ChevronRight size={14} />
          <li><span className="text-foreground font-medium">{t("menu.yurtdisi_akademik_deneyim")}</span></li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t("menu.yurtdisi_akademik_deneyim")}</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-base text-slate-700">{t("menu.yurtdisi_akademik_deneyim")}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={12}
                placeholder="Yurtdışı akademik deneyimlerinizi buraya giriniz..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-[#1E6B9B] focus:ring-1 focus:ring-[#1E6B9B] transition resize-y"
              />
              {saved && (
                <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
                  ✓ Bilgiler başarıyla kaydedildi.
                </p>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => window.history.back()}>{t("common.back")}</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-[#1E6B9B] hover:bg-[#165375] gap-2">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {t("common.save")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
