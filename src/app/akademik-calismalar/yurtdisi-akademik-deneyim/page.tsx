"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.yurtdisi_akademik_deneyim")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.yurtdisi_akademik_deneyim") },
      ]}
      fields={[
        { key: "institution", label: t("fields.institution"), placeholder: t("fields.institution_placeholder") },
        { key: "country", label: t("fields.country"), placeholder: t("fields.country_placeholder") },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/yurtdisi-akademik-deneyim"
      
      columns={[
        { key: "institution", label: t("fields.institution") },
        { key: "country", label: t("fields.country") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
