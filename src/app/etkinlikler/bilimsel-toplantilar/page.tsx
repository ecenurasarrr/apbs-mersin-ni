"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.bilimsel_toplantilar")}
      breadcrumbs={[
        { label: t("navbar.etkinlikler") },
        { label: t("menu.bilimsel_toplantilar") },
      ]}
      fields={[
        { key: "title", label: t("fields.meeting_title"), placeholder: t("fields.meeting_title_placeholder") },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/etkinlikler/bilimsel-toplantilar"
      
      columns={[
        { key: "title", label: t("fields.meeting_title") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
