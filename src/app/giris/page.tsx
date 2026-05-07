"use client";

import { useState } from "react";
import { Loader2, Eye, EyeOff, ArrowLeft, Mail, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      window.location.href = "/profil";
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
      window.location.href = "/profil";
    } catch { setMisafirError("Sunucu hatası."); }
    finally { setMisafirLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 to-slate-100 p-4 relative overflow-hidden">
      
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px]" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[440px] overflow-hidden border border-white relative z-10">
        <div className="flex flex-col pt-10 pb-8 px-8 sm:px-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50"></div>
              <img src="/logo_tr.png" alt="Mersin Üniversitesi" className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] object-contain relative z-10 drop-shadow-sm" />
            </div>
          </div>

          <h3 className="text-center text-[#1E6B9B] font-bold text-base sm:text-lg leading-tight mb-8">
            Mersin Üniversitesi<br />
            <span className="text-slate-600 font-medium text-sm sm:text-base mt-1 block">
              Akademik Personel Bilgi Sistemi
            </span>
          </h3>

          <div className="min-h-[280px] flex flex-col justify-center">
            {/* LANDING */}
            {step === "landing" && (
              <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Button
                  onClick={() => setStep("kurumsal")}
                  className="w-full h-14 bg-[#1E6B9B] hover:bg-[#165375] text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  <GraduationCap size={22} className="opacity-90" />
                  Kurumsal Giriş
                </Button>
                
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium tracking-wider">veya</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setStep("misafir")}
                  className="w-full h-14 border-2 border-slate-200 hover:border-[#1E6B9B] hover:bg-blue-50/50 text-slate-600 hover:text-[#1E6B9B] font-medium text-base rounded-xl transition-all flex items-center justify-center gap-3"
                >
                  <Mail size={20} className="opacity-70" />
                  Misafir Öğretim Elemanı
                </Button>
              </div>
            )}

            {/* KURUMSAL GİRİŞ */}
            {step === "kurumsal" && (
              <div className="w-full animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => { setStep("landing"); setKurError(""); }} className="p-1.5 text-slate-400 hover:text-[#1E6B9B] transition-colors rounded-full hover:bg-blue-50">
                    <ArrowLeft size={20} />
                  </button>
                  <h4 className="font-semibold text-slate-800">Kurumsal Oturum Aç</h4>
                </div>
                
                <form onSubmit={handleKurumsal} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">E-posta</label>
                    <div className="flex gap-1 items-stretch">
                      <Input
                        type="text"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex-1 h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B]"
                        autoComplete="username"
                        autoFocus
                      />
                      <div className="flex items-center px-1 text-slate-400 font-medium">@</div>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="h-12 px-2 rounded-md border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-[#1E6B9B] focus:ring-1 focus:ring-[#1E6B9B] transition text-slate-700"
                      >
                        <option value="mersin.edu.tr">mersin.edu.tr</option>
                        <option value="ogr.mersin.edu.tr">ogr.mersin.edu.tr</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs font-bold uppercase text-slate-500">Parola</label>
                      <a href="#" className="text-[11px] text-[#1E6B9B] hover:underline font-medium">Parola Değiştirme</a>
                    </div>
                    <div className="relative">
                      <Input
                        type={showKurPw ? "text" : "password"}
                        placeholder="Parolanız"
                        value={kurPassword}
                        onChange={(e) => setKurPassword(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B] pr-10"
                        autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowKurPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showKurPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {kurError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium animate-in fade-in">
                      {kurError}
                    </div>
                  )}

                  <Button type="submit" disabled={kurLoading}
                    className="w-full h-12 bg-[#1E6B9B] hover:bg-[#165375] text-white font-bold rounded-xl shadow-md transition-all mt-6 text-base">
                    {kurLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : null} 
                    Giriş Yap
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <p className="font-semibold text-slate-700 text-sm mb-3">Yardım Dokümanları</p>
                  <div className="space-y-2">
                    <a href="#" className="flex items-center text-[#1E6B9B] hover:underline text-xs group">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2 group-hover:bg-[#1E6B9B] transition-colors" />
                      ePosta Sistemi Hakkında
                    </a>
                    <a href="#" className="flex items-center text-[#1E6B9B] hover:underline text-xs group">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2 group-hover:bg-[#1E6B9B] transition-colors" />
                      ePosta İstemcisi Yapılandırmaları
                    </a>
                    <a href="#" className="flex items-center text-[#1E6B9B] hover:underline text-xs group">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2 group-hover:bg-[#1E6B9B] transition-colors" />
                      Uzaktan Destek Kılavuzu
                    </a>
                  </div>
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100">
                    <span className="font-semibold text-slate-600 block mb-1">Destek için dahili numaralar:</span>
                    34045 - 34043 - 13530
                  </div>
                </div>
              </div>
            )}

            {/* MİSAFİR GİRİŞ */}
            {step === "misafir" && (
              <div className="w-full animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => { setStep("landing"); setMisafirError(""); }} className="p-1.5 text-slate-400 hover:text-[#1E6B9B] transition-colors rounded-full hover:bg-blue-50">
                    <ArrowLeft size={20} />
                  </button>
                  <h4 className="font-semibold text-slate-800">Misafir Oturum Aç</h4>
                </div>

                <form onSubmit={handleMisafir} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Kurumsal E-posta</label>
                    <Input
                      type="email"
                      placeholder="ad.soyad@mersin.edu.tr"
                      value={misafirEmail}
                      onChange={(e) => setMisafirEmail(e.target.value)}
                      className="w-full h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B]"
                      autoComplete="username"
                      autoFocus
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500 ml-1">Parola</label>
                    <div className="relative">
                      <Input
                        type={showMisafirPw ? "text" : "password"}
                        placeholder="Parolanız"
                        value={misafirPassword}
                        onChange={(e) => setMisafirPassword(e.target.value)}
                        className="w-full h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-[#1E6B9B] pr-10"
                        autoComplete="current-password"
                      />
                      <button type="button" onClick={() => setShowMisafirPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                        {showMisafirPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {misafirError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium animate-in fade-in">
                      {misafirError}
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800 leading-relaxed mt-2">
                    <span className="font-bold">Not:</span> Kullanıcı adınız mersin.edu.tr uzantılı e-posta adresiniz, parolanız da bu adresin parolasıdır.
                  </div>

                  <Button type="submit" disabled={misafirLoading}
                    className="w-full h-12 bg-[#1E6B9B] hover:bg-[#165375] text-white font-bold rounded-xl shadow-md transition-all mt-4 text-base">
                    {misafirLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : null} 
                    Oturum Aç
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                  <a href="#" className="flex items-center justify-center p-2 rounded-lg text-sm text-[#1E6B9B] hover:bg-blue-50 font-medium transition-colors">
                    Misafir Öğretim Elemanları Başvuru Formu
                  </a>
                  <div className="flex items-center justify-center gap-4 text-xs">
                    <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">Kullanım Kılavuzu</a>
                    <span className="text-slate-300">•</span>
                    <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">English Version</a>
                  </div>
                </div>
              </div>
            )}
          </div>

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
