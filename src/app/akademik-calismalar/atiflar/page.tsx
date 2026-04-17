"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.atiflar")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.atiflar") },
      ]}
      fields={[
        { key: "title", label: "Atıf Adı", placeholder: "Atıf adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/atiflar"
      
      columns={[
        { key: "title", label: "Atıf Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
