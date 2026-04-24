"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

type Step = "landing" | "kurumsal" | "misafir";

export default function GirisPage() {
  const [step, setStep] = useState<Step>("landing");

  // Kurumsal giriş
  const [username, setUsername] = useState("");
  const [domain, setDomain] = useState("mersin.edu.tr");
  const [kurPassword, setKurPassword] = useState("");
  const [showKurPw, setShowKurPw] = useState(false);
  const [kurError, setKurError] = useState("");
  const [kurLoading, setKurLoading] = useState(false);

  // Misafir giriş
  const [misafirEmail, setMisafirEmail] = useState("");
  const [misafirPassword, setMisafirPassword] = useState("");
  const [showMisafirPw, setShowMisafirPw] = useState(false);
  const [misafirError, setMisafirError] = useState("");
  const [misafirLoading, setMisafirLoading] = useState(false);

  const handleKurumsal = async (e: React.FormEvent) => {
    e.preventDefault();
    setKurError("");
    if (!username.trim() || !kurPassword.trim()) { setKurError("Kullanıcı adı ve parola giriniz."); return; }
    setKurLoading(true);
    try {
      const tcNo = username.trim().split("@")[0];
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo, password: kurPassword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setKurError(data.error || "Giriş başarısız."); return; }
      window.location.href = "/";
    } catch { setKurError("Sunucu hatası. Lütfen tekrar deneyin."); }
    finally { setKurLoading(false); }
  };

  const handleMisafir = async (e: React.FormEvent) => {
    e.preventDefault();
    setMisafirError("");
    if (!misafirEmail.trim() || !misafirPassword.trim()) { setMisafirError("E-posta ve parola giriniz."); return; }
    setMisafirLoading(true);
    try {
      const tcNo = misafirEmail.trim().split("@")[0];
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo, password: misafirPassword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setMisafirError(data.error || "Giriş başarısız."); return; }
      window.location.href = "/";
    } catch { setMisafirError("Sunucu hatası."); }
    finally { setMisafirLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3d5166] px-4">
      <div className="bg-[#eef1f5] rounded-lg shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-6 px-6 sm:px-8">

          {/* Logo */}
          <div className="mb-4">
            <img src="/logo_tr.png" alt="Mersin Üniversitesi" className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] object-contain" />
          </div>

          {/* LANDING */}
          {step === "landing" && (
            <>
              <h3 className="text-center text-[#3d8b8b] font-semibold text-sm sm:text-base leading-snug mb-6">
                Mersin Üniversitesi<br />Akademik Personel Bilgi Sistemi
              </h3>
              <button
                onClick={() => setStep("kurumsal")}
                className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] active:bg-[#256060] text-white font-bold uppercase py-3 rounded transition-colors tracking-widest text-sm mb-4"
              >
                Oturum Aç
              </button>
              <hr className="w-full border-slate-300 mb-4" />
              <button
                onClick={() => setStep("misafir")}
                className="text-[#3d8b8b] hover:underline text-sm text-center"
              >
                Misafir Öğretim Elemanları için Giriş
              </button>
            </>
          )}

          {/* KURUMSAL GİRİŞ */}
          {step === "kurumsal" && (
            <>
              <p className="text-[#3d8b8b] font-semibold text-sm mb-1 text-center">Lütfen Oturum Açınız</p>
              <form onSubmit={handleKurumsal} className="w-full space-y-3 mt-3">
                <div className="flex gap-1 items-center">
                  <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] transition"
                    autoComplete="new-password"
                    autoFocus
                  />
                  <span className="text-slate-500 text-sm px-1 shrink-0">@</span>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="shrink-0 px-1 py-2 rounded border border-slate-300 bg-white text-xs outline-none focus:border-[#3d8b8b] transition"
                  >
                    <option value="mersin.edu.tr">mersin.edu.tr</option>
                    <option value="ogr.mersin.edu.tr">ogr.mersin.edu.tr</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type={showKurPw ? "text" : "password"}
                    placeholder="Parola"
                    value={kurPassword}
                    onChange={(e) => setKurPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] transition pr-9"
                  />
                  <button type="button" onClick={() => setShowKurPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                    {showKurPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <a href="#" className="block text-xs text-[#3d8b8b] hover:underline">Parola Değiştirme</a>
                {kurError && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-2 py-1">{kurError}</p>}
                <button type="submit" disabled={kurLoading}
                  className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] active:bg-[#256060] disabled:opacity-60 text-white font-bold py-2.5 rounded transition-colors text-sm flex items-center justify-center gap-2">
                  {kurLoading && <Loader2 size={15} className="animate-spin" />} Giriş Yap
                </button>
                <div className="text-xs text-slate-500 text-center pt-1">
                  ePosta Yardım için dahili numaralar : 34045 - 34043 - 13530
                </div>
                <div className="border rounded p-3 text-xs space-y-1">
                  <p className="font-semibold text-slate-600 text-center">Yardım Dokümanları</p>
                  <a href="#" className="block text-[#3d8b8b] hover:underline text-center">ePosta Sistemi Hakkında</a>
                  <a href="#" className="block text-[#3d8b8b] hover:underline text-center">ePosta İstemcisi Yapılandırmaları</a>
                  <a href="#" className="block text-[#3d8b8b] hover:underline text-center">Uzaktan Destek Kılavuzu</a>
                </div>
                <button type="button" onClick={() => { setStep("landing"); setKurError(""); }}
                  className="w-full text-slate-400 hover:text-slate-600 text-xs py-1">← Geri</button>
              </form>
            </>
          )}

          {/* MİSAFİR GİRİŞ */}
          {step === "misafir" && (
            <>
              <h3 className="text-center text-[#3d8b8b] font-semibold text-sm sm:text-base leading-snug mb-4">
                Misafir Öğretim Elemanları<br />için Giriş
              </h3>
              <form onSubmit={handleMisafir} className="w-full space-y-3">
                <input
                  type="text"
                  placeholder="E-posta adresiniz"
                  value={misafirEmail}
                  onChange={(e) => setMisafirEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] transition"
                  autoComplete="new-password"
                  autoFocus
                />
                <div className="relative">
                  <input
                    type={showMisafirPw ? "text" : "password"}
                    placeholder="Parola"
                    value={misafirPassword}
                    onChange={(e) => setMisafirPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] transition pr-9"
                  />
                  <button type="button" onClick={() => setShowMisafirPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                    {showMisafirPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {misafirError && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded px-2 py-1">{misafirError}</p>}
                <button type="submit" disabled={misafirLoading}
                  className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] active:bg-[#256060] disabled:opacity-60 text-white font-bold py-2.5 rounded transition-colors text-sm flex items-center justify-center gap-2">
                  {misafirLoading && <Loader2 size={15} className="animate-spin" />} Oturum Aç
                </button>
                <p className="text-xs text-slate-500 text-center">
                  Not: Kullanıcı adınız mersin.edu.tr uzantılı e-posta adresiniz, parolanız da e-posta adresinizin parolasıdır
                </p>
                <div className="space-y-1 text-center">
                  <a href="#" className="block text-xs text-[#3d8b8b] hover:underline">Misafir Öğretim Elemanları için Başvuru Formu</a>
                  <a href="#" className="block text-xs text-[#3d8b8b] hover:underline">Kullanım Kılavuzu</a>
                  <a href="#" className="block text-xs text-[#3d8b8b] hover:underline">Change Language English</a>
                </div>
                <button type="button" onClick={() => { setStep("landing"); setMisafirError(""); }}
                  className="w-full text-slate-400 hover:text-slate-600 text-xs py-1">← Geri</button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#d8dde3] text-center py-3">
          <a href="http://www.mersin.edu.tr" className="text-slate-500 text-sm hover:text-slate-700">
            {step === "misafir" ? "© Mersin Üniversitesi" : "2017 © Mersin Üniversitesi"}
          </a>
        </div>
      </div>
    </div>
  );
}
