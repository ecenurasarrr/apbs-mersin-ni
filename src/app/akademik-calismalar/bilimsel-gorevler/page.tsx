"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.bilimsel_gorevler")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.bilimsel_gorevler") },
      ]}
      fields={[
        { key: "title", label: t("fields.task_name"), placeholder: t("fields.task_name_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/akademik-calismalar/bilimsel-gorevler"
      
      columns={[
        { key: "title", label: t("fields.task_name") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
