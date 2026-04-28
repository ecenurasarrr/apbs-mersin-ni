"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.yonetilen_tezler")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.yonetilen_tezler") },
      ]}
      fields={[
        { key: "title", label: t("fields.thesis_title"), placeholder: t("fields.thesis_title_placeholder") },
        { key: "student", label: t("fields.student"), placeholder: t("fields.student_placeholder") },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/yonetilen-tezler"
      
      columns={[
        { key: "title", label: t("fields.thesis_title") },
        { key: "student", label: t("fields.student") },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
