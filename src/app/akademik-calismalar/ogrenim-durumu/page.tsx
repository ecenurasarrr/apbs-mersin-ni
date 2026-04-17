"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.ogrenim_durumu")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.ogrenim_durumu") },
      ]}
      fields={[
        { key: "title", label: "Öğrenim Bilgisi", placeholder: "Öğrenim bilgisini giriniz" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/ogrenim-durumu"
      
      columns={[
        { key: "title", label: "Öğrenim Bilgisi" },
        { key: "date", label: t("common.date") },
      ]}
    />
  );
}
