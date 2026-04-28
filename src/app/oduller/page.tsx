"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("navbar.oduller")}
      breadcrumbs={[{ label: t("navbar.oduller") }]}
      apiPath="/api/oduller"
      fields={[
        { key: "name", label: t("fields.award_name"), placeholder: t("fields.award_name_placeholder") },
        { key: "year", label: t("common.year"), placeholder: t("common.year") },
      ]}
      columns={[
        { key: "name", label: t("fields.award_name") },
        { key: "year", label: t("common.year") },
      ]}
    />
  );
}
