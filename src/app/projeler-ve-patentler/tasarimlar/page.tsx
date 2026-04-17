"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.tasarimlar")}
      breadcrumbs={[
        { label: t("navbar.projeler_patentler") },
        { label: t("menu.tasarimlar") },
      ]}
      fields={[
        { key: "title", label: "Tasarım Adı", placeholder: "Tasarım adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/projeler-ve-patentler/tasarimlar"
      
      columns={[
        { key: "title", label: "Tasarım Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
