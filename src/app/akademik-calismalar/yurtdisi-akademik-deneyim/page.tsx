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
        { key: "institution", label: "Kurum", placeholder: "Kurum adını giriniz" },
        { key: "country", label: "Ülke", placeholder: "Ülke" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/yurtdisi-akademik-deneyim"
      
      columns={[
        { key: "institution", label: "Kurum" },
        { key: "country", label: "Ülke" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
