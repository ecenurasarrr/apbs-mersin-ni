"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.arastirma_yoksis")}
      breadcrumbs={[
        { label: t("navbar.arastirmalar") },
        { label: t("menu.arastirma_yoksis") },
      ]}
      fields={[
        { key: "title", label: t("fields.research_name"), placeholder: t("fields.research_name_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/arastirmalar/yoksis"
      
      columns={[
        { key: "title", label: t("fields.research_name") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
