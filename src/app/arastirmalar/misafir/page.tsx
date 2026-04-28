"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.misafir_arastirma")}
      breadcrumbs={[
        { label: t("navbar.arastirmalar") },
        { label: t("menu.misafir_arastirma") },
      ]}
      fields={[
        { key: "title", label: t("fields.research_name"), placeholder: t("fields.research_name_placeholder") },
        { key: "institution", label: t("fields.institution"), placeholder: t("fields.institution_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/arastirmalar/misafir"
      
      columns={[
        { key: "title", label: t("fields.research_name") },
        { key: "institution", label: t("fields.institution") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
