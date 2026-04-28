"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("navbar.hakemlikler")}
      breadcrumbs={[{ label: t("navbar.hakemlikler") }]}
      fields={[
        { key: "name", label: t("fields.organization_book_journal"), placeholder: t("fields.organization_book_journal_placeholder") },
        { key: "year", label: t("common.year"), placeholder: "Yıl" },
      ]}
      apiPath="/api/hakemlikler"
      
      columns={[
        { key: "name", label: t("fields.organization_book_journal") },
        { key: "year", label: t("common.year") },
      ]}
    />
  );
}
