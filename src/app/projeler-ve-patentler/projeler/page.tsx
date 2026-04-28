"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.projeler")}
      breadcrumbs={[
        { label: t("navbar.projeler_patentler") },
        { label: t("menu.projeler") },
      ]}
      fields={[
        { key: "title", label: t("fields.project_name"), placeholder: t("fields.project_name_placeholder") },
        { key: "status", label: t("common.status"), placeholder: "Durum" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/projeler-ve-patentler/projeler"
      
      columns={[
        { key: "title", label: t("fields.project_name") },
        { key: "status", label: t("common.status") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
