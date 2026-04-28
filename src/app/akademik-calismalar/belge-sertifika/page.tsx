"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.belge_sertifika")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.belge_sertifika") },
      ]}
      fields={[
        { key: "title", label: t("fields.certificate"), placeholder: t("fields.certificate_placeholder") },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/belge-sertifika"
      
      columns={[
        { key: "title", label: t("fields.certificate") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
