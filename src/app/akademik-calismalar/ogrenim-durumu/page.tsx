"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.ogrenim_durumu")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.ogrenim_durumu") },
      ]}
      fields={[
        { key: "title", label: t("fields.education_info"), placeholder: t("fields.education_info_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/akademik-calismalar/ogrenim-durumu"
      
      columns={[
        { key: "title", label: t("fields.education_info") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
