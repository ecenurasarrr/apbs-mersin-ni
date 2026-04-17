"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.misafir_arastirma")}
      breadcrumbs={[
        { label: t("navbar.arastirmalar") },
        { label: t("menu.misafir_arastirma") },
      ]}
      fields={[
        { key: "title", label: "Araştırma Adı", placeholder: "Araştırma adını giriniz" },
        { key: "institution", label: "Kurum", placeholder: "Kurum adı" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/arastirmalar/misafir"
      
      columns={[
        { key: "title", label: "Araştırma Adı" },
        { key: "institution", label: "Kurum" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
