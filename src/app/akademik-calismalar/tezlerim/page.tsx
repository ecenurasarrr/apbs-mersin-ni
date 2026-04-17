"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.tezlerim")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.tezlerim") },
      ]}
      fields={[
        { key: "title", label: "Tez Adı", placeholder: "Tez adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/tezlerim"
      
      columns={[
        { key: "title", label: "Tez Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
