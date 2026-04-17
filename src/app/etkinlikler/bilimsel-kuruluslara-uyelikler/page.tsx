"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.bilimsel_kuruluslara_uyelikler")}
      breadcrumbs={[
        { label: t("navbar.etkinlikler") },
        { label: t("menu.bilimsel_kuruluslara_uyelikler") },
      ]}
      fields={[
        { key: "organization", label: "Kuruluş Adı", placeholder: "Kuruluş adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/etkinlikler/bilimsel-kuruluslara-uyelikler"
      
      columns={[
        { key: "organization", label: "Kuruluş Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
