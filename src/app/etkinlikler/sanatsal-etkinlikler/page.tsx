"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.sanatsal_etkinlikler")}
      breadcrumbs={[
        { label: t("navbar.etkinlikler") },
        { label: t("menu.sanatsal_etkinlikler") },
      ]}
      fields={[
        { key: "title", label: t("fields.event_title"), placeholder: t("fields.event_title_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/etkinlikler/sanatsal-etkinlikler"
      
      columns={[
        { key: "title", label: t("fields.event_title") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
