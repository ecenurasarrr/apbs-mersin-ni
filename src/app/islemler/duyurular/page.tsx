"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("navbar.duyurular")}
      breadcrumbs={[
        { label: t("navbar.islemler") },
        { label: t("navbar.duyurular") },
      ]}
      fields={[
        { key: "title", label: t("fields.announcement_title"), placeholder: t("fields.announcement_title_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/islemler/duyurular"
      
      columns={[
        { key: "title", label: t("fields.announcement_title") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
