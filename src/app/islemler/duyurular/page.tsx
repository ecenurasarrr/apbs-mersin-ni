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
        { key: "title", label: "Duyuru Başlığı", placeholder: "Duyuru başlığını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/islemler/duyurular"
      
      columns={[
        { key: "title", label: "Duyuru Başlığı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
