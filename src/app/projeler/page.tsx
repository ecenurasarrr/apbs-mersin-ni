"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// /projeler → /projeler-ve-patentler/projeler'e yönlendir
export default function ProjelerRedirectPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/projeler-ve-patentler/projeler"); }, [router]);
  return null;
}
