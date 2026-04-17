"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.doktora_sonrasi_arastirma")}
      breadcrumbs={[
        { label: t("navbar.arastirmalar") },
        { label: t("menu.doktora_sonrasi_arastirma") },
      ]}
      fields={[
        { key: "title", label: "Araştırma Adı", placeholder: "Araştırma adını giriniz" },
        { key: "institution", label: "Kurum", placeholder: "Kurum adı" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/arastirmalar/doktora-sonrasi"
      
      columns={[
        { key: "title", label: "Araştırma Adı" },
        { key: "institution", label: "Kurum" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
