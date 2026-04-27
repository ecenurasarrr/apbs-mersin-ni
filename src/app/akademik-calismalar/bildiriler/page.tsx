"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title="Bildiriler"
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: "Bildiriler" },
      ]}
      apiPath="/api/akademik-calismalar/bildiriler"
      fields={[
        { key: "title", label: "Bildiri Adı", placeholder: "Bildiri adını giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      columns={[
        { key: "title", label: "Bildiri Adı" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
