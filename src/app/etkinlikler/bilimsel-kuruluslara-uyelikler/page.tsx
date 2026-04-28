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
        { key: "organization", label: t("fields.organization_name"), placeholder: t("fields.organization_name_placeholder") },
        { key: "date", label: t("common.date"), placeholder: t("common.date") },
      ]}
      apiPath="/api/etkinlikler/bilimsel-kuruluslara-uyelikler"
      
      columns={[
        { key: "organization", label: t("fields.organization_name") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
