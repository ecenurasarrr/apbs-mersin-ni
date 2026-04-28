"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.atiflar")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.atiflar") },
      ]}
      fields={[
        { key: "title", label: t("fields.citation_name"), placeholder: t("fields.citation_name_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/akademik-calismalar/atiflar"
      
      columns={[
        { key: "title", label: t("fields.citation_name") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
