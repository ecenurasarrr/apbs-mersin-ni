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
        { key: "language", label: t("fields.language"), placeholder: t("fields.language_placeholder") },
        { key: "level", label: t("fields.level"), placeholder: t("fields.level_placeholder") },
      ]}
      apiPath="/api/akademik-calismalar/yabanci-dil"
      
      columns={[
        { key: "language", label: t("fields.language") },
        { key: "level", label: t("fields.level") },
      ]}
    />
  );
}
