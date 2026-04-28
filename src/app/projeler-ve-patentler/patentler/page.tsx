"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.patentler")}
      breadcrumbs={[
        { label: t("navbar.projeler_patentler") },
        { label: t("menu.patentler") },
      ]}
      fields={[
        { key: "title", label: t("fields.patent_name"), placeholder: t("fields.patent_name_placeholder") },
        { key: "number", label: t("fields.patent_number"), placeholder: t("fields.patent_number_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/projeler-ve-patentler/patentler"
      
      columns={[
        { key: "title", label: t("fields.patent_name") },
        { key: "number", label: t("fields.patent_number") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
