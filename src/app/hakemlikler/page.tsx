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
        { key: "name", label: "Organizasyon/Kitap/Dergi Adı", placeholder: "Organizasyon/Kitap/Dergi adını giriniz" },
        { key: "year", label: t("common.year"), placeholder: "Yıl" },
      ]}
      apiPath="/api/hakemlikler"
      
      columns={[
        { key: "name", label: "Organizasyon/Kitap/Dergi Adı" },
        { key: "year", label: t("common.year") },
      ]}
    />
  );
}
