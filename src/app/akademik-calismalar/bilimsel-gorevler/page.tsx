"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.bilimsel_gorevler")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.bilimsel_gorevler") },
      ]}
      fields={[
        { key: "title", label: "Görev Adı", placeholder: "Görev adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/bilimsel-gorevler"
      
      columns={[
        { key: "title", label: "Görev Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
