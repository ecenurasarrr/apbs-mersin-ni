"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.yabanci_dil")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.yabanci_dil") },
      ]}
      fields={[
        { key: "language", label: "Dil", placeholder: "Dil adını giriniz" },
        { key: "level", label: "Seviye", placeholder: "Seviye" },
      ]}
      apiPath="/api/akademik-calismalar/yabanci-dil"
      
      columns={[
        { key: "language", label: "Dil" },
        { key: "level", label: "Seviye" },
      ]}
    />
  );
}
