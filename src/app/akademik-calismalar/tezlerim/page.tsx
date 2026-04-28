"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.tezlerim")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.tezlerim") },
      ]}
      fields={[
        { key: "department", label: t("fields.department"), placeholder: t("fields.department_placeholder") },
        { key: "advisor", label: t("fields.advisor_name"), placeholder: t("fields.advisor_name_placeholder") },
        { key: "title", label: t("fields.title"), placeholder: t("fields.title_placeholder") },
        { key: "file", label: t("fields.file"), placeholder: t("fields.file_placeholder") },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/tezlerim"
      
      columns={[
        { key: "department", label: t("fields.department") },
        { key: "advisor", label: t("fields.advisor_name") },
        { key: "title", label: t("fields.title") },
        { key: "file", label: t("fields.file") },
      ]}
    />
  );
}
