"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

type Step = "landing" | "login";

export default function GirisPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("landing");

  // TC girişi
  const [tcNo, setTcNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!tcNo.trim() || !password.trim()) { setError("TC Kimlik No ve şifre giriniz."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo: tcNo.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Giriş başarısız."); return; }
      router.push("/");
      router.refresh();
    } catch { setError("Sunucu hatası. Lütfen tekrar deneyin."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3d5166]">
      <div className="bg-[#eef1f5] rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex flex-col items-center pt-10 pb-6 px-8">
          {/* Logo */}
          <div className="mb-5">
            <img
              src="/logo_tr.png"
              alt="Mersin Üniversitesi"
              className="w-[160px] h-[160px] object-contain"
            />
          </div>

          <h3 className="text-center text-[#3d8b8b] font-semibold text-base leading-snug mb-6">
            Mersin Üniversitesi Akademik Personel Bilgi Sistemi
          </h3>

          {step === "landing" ? (
            /* İlk ekran — sadece Oturum Aç butonu */
            <>
              <button
                onClick={() => setStep("login")}
                className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] text-white font-bold uppercase py-3 rounded transition-colors tracking-widest text-sm"
              >
                Oturum Aç
              </button>

              <hr className="w-full border-slate-300 my-4" />

              <a
                href="/giris#login"
                onClick={(e) => { e.preventDefault(); setStep("login"); }}
                className="text-[#3d8b8b] hover:underline text-sm text-center"
              >
                Misafir Öğretim Elemanları için Giriş
              </a>
            </>
          ) : (
            /* Giriş formu */
            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="text"
                placeholder="T.C. Kimlik No"
                value={tcNo}
                onChange={(e) => setTcNo(e.target.value)}
                maxLength={11}
                className="w-full px-4 py-2.5 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] focus:ring-1 focus:ring-[#3d8b8b] transition"
                autoComplete="username"
                autoFocus
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] focus:ring-1 focus:ring-[#3d8b8b] transition pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <p className="text-red-600 text-xs text-center bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] disabled:opacity-60 text-white font-bold uppercase py-3 rounded transition-colors tracking-widest text-sm flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Giriş Yap
              </button>

              <button
                type="button"
                onClick={() => { setStep("landing"); setError(""); }}
                className="w-full text-slate-500 hover:text-slate-700 text-xs py-1"
              >
                ← Geri
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#d8dde3] text-center py-3">
          <a href="http://www.mersin.edu.tr" className="text-slate-500 text-sm hover:text-slate-700">
            2017 © Mersin Üniversitesi
          </a>
        </div>
      </div>
    </div>
  );
}
