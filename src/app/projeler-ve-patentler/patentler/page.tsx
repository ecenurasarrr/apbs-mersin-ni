"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.patentler")}
      breadcrumbs={[
        { label: t("navbar.projeler_patentler") },
        { label: t("menu.patentler") },
      ]}
      fields={[
        { key: "title", label: "Patent Adı", placeholder: "Patent adını giriniz" },
        { key: "number", label: "Patent No", placeholder: "Patent numarası" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/projeler-ve-patentler/patentler"
      
      columns={[
        { key: "title", label: "Patent Adı" },
        { key: "number", label: "Patent No" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
