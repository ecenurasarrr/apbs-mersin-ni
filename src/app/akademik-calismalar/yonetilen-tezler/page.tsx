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
        { key: "title", label: "Tez Adı", placeholder: "Tez adını giriniz" },
        { key: "student", label: "Öğrenci", placeholder: "Öğrenci adı" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/yonetilen-tezler"
      
      columns={[
        { key: "title", label: "Tez Adı" },
        { key: "student", label: "Öğrenci" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
