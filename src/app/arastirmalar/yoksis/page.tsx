"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.arastirma_yoksis")}
      breadcrumbs={[
        { label: t("navbar.arastirmalar") },
        { label: t("menu.arastirma_yoksis") },
      ]}
      fields={[
        { key: "title", label: "Araştırma Adı", placeholder: "Araştırma adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/arastirmalar/yoksis"
      
      columns={[
        { key: "title", label: "Araştırma Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
