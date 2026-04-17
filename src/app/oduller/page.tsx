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
        { key: "name", label: "Ödül Adı", placeholder: "Ödül adını giriniz" },
        { key: "year", label: t("common.year"), placeholder: "Yıl" },
      ]}
      columns={[
        { key: "name", label: "Ödül Adı" },
        { key: "year", label: t("common.year") },
      ]}
    />
  );
}
