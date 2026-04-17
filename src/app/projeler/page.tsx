"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.projeler")}
      breadcrumbs={[{ label: t("menu.projeler") }]}
      apiPath="/api/projeler-ve-patentler/projeler"
      fields={[
        { key: "title", label: "Proje Adı", placeholder: "Proje adını giriniz" },
        { key: "status", label: t("common.status"), placeholder: "Durum" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      columns={[
        { key: "title", label: "Proje Adı" },
        { key: "status", label: t("common.status") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
