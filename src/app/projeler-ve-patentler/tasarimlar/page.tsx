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
        { key: "title", label: t("fields.design_name"), placeholder: t("fields.design_name_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/projeler-ve-patentler/tasarimlar"
      
      columns={[
        { key: "title", label: t("fields.design_name") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
