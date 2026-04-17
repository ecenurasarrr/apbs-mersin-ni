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
        { key: "title", label: "Etkinlik Adı", placeholder: "Etkinlik adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/etkinlikler/sanatsal-etkinlikler"
      
      columns={[
        { key: "title", label: "Etkinlik Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
