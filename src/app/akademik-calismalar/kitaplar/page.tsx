"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.kitaplar")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.kitaplar") },
      ]}
      fields={[
        { key: "title", label: t("fields.book_title"), placeholder: t("fields.book_title_placeholder") },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/kitaplar"
      
      columns={[
        { key: "title", label: t("fields.book_title") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
