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
        { key: "title", label: "Belge/Sertifika Adı", placeholder: "Belge/Sertifika adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/belge-sertifika"
      
      columns={[
        { key: "title", label: "Belge/Sertifika Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
