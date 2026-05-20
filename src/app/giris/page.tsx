"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "giris" | "kayit";

export default function GirisPage() {
  const [tab, setTab] = useState<Tab>("giris");

  // Giriş
  const [tcNo, setTcNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Kayıt
  const [regTcNo, setRegTcNo] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [showRegPw, setShowRegPw] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!tcNo.trim() || !password.trim()) { setLoginError("TC Kimlik No ve parola giriniz."); return; }
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo: tcNo.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || "Giriş başarısız."); return; }
      window.location.href = "/profil";
    } catch { setLoginError("Sunucu hatası. Lütfen tekrar deneyin."); }
    finally { setLoginLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regTcNo.trim() || !regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError("Tüm alanları doldurunuz."); return;
    }
    if (regPassword !== regPassword2) { setRegError("Parolalar eşleşmiyor."); return; }
    if (regPassword.length < 6) { setRegError("Parola en az 6 karakter olmalıdır."); return; }
    setRegLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo: regTcNo.trim(), fullName: regFullName.trim(), email: regEmail.trim(), password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setRegError(data.error || "Kayıt başarısız."); return; }
      setRegSuccess(true);
      setTimeout(() => { setTab("giris"); setRegSuccess(false); setRegTcNo(""); setRegFullName(""); setRegEmail(""); setRegPassword(""); setRegPassword2(""); }, 2000);
    } catch { setRegError("Sunucu hatası. Lütfen tekrar deneyin."); }
    finally { setRegLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 to-slate-100 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px]" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden border border-white relative z-10">
        <div className="flex flex-col pt-10 pb-8 px-8 sm:px-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50" />
              <img src="/logo_tr.png" alt="Mersin Üniversitesi" className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] object-contain relative z-10 drop-shadow-sm" />
            </div>
          </div>

          <h3 className="text-center text-[#1E6B9B] font-bold text-base sm:text-lg leading-tight mb-6">
            Mersin Üniversitesi<br />
            <span className="text-slate-600 font-medium text-sm sm:text-base mt-1 block">
              Akademik Personel Bilgi Sistemi
            </span>
          </h3>

          {/* Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              onClick={() => { setTab("giris"); setLoginError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "giris" ? "bg-white text-[#1E6B9B] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => { setTab("kayit"); setRegError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === "kayit" ? "bg-white text-[#1E6B9B] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* GİRİŞ FORMU */}
          {tab === "giris" && (
            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">TC Kimlik No</label>
                <Input
                  type="text"
                  placeholder="TC Kimlik Numaranız"
                  value={tcNo}
                  onChange={(e) => setTcNo(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B]"
                  autoComplete="username"
                  autoFocus
                  maxLength={11}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Parola</label>
                <div className="relative">
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="Parolanız"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B] pr-10"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium animate-in fade-in">
                  {loginError}
                </div>
              )}

              <Button type="submit" disabled={loginLoading}
                className="w-full h-12 bg-[#1E6B9B] hover:bg-[#165375] text-white font-bold rounded-xl shadow-md transition-all text-base">
                {loginLoading && <Loader2 size={18} className="animate-spin mr-2" />}
                Giriş Yap
              </Button>
            </form>
          )}

          {/* KAYIT FORMU */}
          {tab === "kayit" && (
            <form onSubmit={handleRegister} className="space-y-3 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">TC Kimlik No</label>
                <Input
                  type="text"
                  placeholder="TC Kimlik Numaranız"
                  value={regTcNo}
                  onChange={(e) => setRegTcNo(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B]"
                  maxLength={11}
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Ad Soyad</label>
                <Input
                  type="text"
                  placeholder="Adınız ve soyadınız"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">E-posta</label>
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B]"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Parola</label>
                <div className="relative">
                  <Input
                    type={showRegPw ? "text" : "password"}
                    placeholder="En az 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B] pr-10"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowRegPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showRegPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Parola Tekrar</label>
                <Input
                  type="password"
                  placeholder="Parolanızı tekrar giriniz"
                  value={regPassword2}
                  onChange={(e) => setRegPassword2(e.target.value)}
                  className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B]"
                  autoComplete="new-password"
                />
              </div>

              {regError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium animate-in fade-in">
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-700 text-sm font-medium animate-in fade-in">
                  Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
                </div>
              )}

              <Button type="submit" disabled={regLoading}
                className="w-full h-12 bg-[#1E6B9B] hover:bg-[#165375] text-white font-bold rounded-xl shadow-md transition-all text-base">
                {regLoading && <Loader2 size={18} className="animate-spin mr-2" />}
                Kayıt Ol
              </Button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">v2.0.1</span>
          <a href="http://www.mersin.edu.tr" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1E6B9B] text-xs font-medium transition-colors">
            {new Date().getFullYear()} © Mersin Üniversitesi
          </a>
        </div>
      </div>
    </div>
  );
}
