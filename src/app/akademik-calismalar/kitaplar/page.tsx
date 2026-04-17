"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.kitaplar")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.kitaplar") },
      ]}
      fields={[
        { key: "title", label: "Kitap Adı", placeholder: "Kitap adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/kitaplar"
      
      columns={[
        { key: "title", label: "Kitap Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
