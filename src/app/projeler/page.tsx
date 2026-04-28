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
        { key: "title", label: t("fields.project_name"), placeholder: t("fields.project_name_placeholder") },
        { key: "status", label: t("common.status"), placeholder: t("common.status") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      columns={[
        { key: "title", label: t("fields.project_name") },
        { key: "status", label: t("common.status") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
