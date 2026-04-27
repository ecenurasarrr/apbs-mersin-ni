"use client";
import GenericListPage from "@/components/GenericListPage";
import { useLanguage } from "@/context/LanguageContext";

export default function Page() {
  const { t } = useLanguage();
  return (
    <GenericListPage
      title={t("menu.tezlerim")}
      breadcrumbs={[
        { label: t("navbar.akademik_calismalar") },
        { label: t("menu.tezlerim") },
      ]}
      fields={[
        { key: "department", label: "Bölüm", placeholder: "Bölüm adı" },
        { key: "advisor", label: "Danışman Adı", placeholder: "Danışman adı" },
        { key: "title", label: "Başlık", placeholder: "Tez başlığı" },
        { key: "file", label: "Dosya", placeholder: "Dosya bağlantısı veya adı" },
        { key: "date", label: t("common.date"), placeholder: "Tarih" },
      ]}
      apiPath="/api/akademik-calismalar/tezlerim"
      
      columns={[
        { key: "department", label: "Bölüm" },
        { key: "advisor", label: "Danışman Adı" },
        { key: "title", label: "Başlık" },
        { key: "file", label: "Dosya" },
      ]}
    />
  );
}
