"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.yayinlar")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.yayinlar") },
      ]}
      fields={[
        { key: "title", label: "Yayın Adı", placeholder: "Yayın adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/yayinlar"
      
      columns={[
        { key: "title", label: "Yayın Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
