"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, User, Mail } from "lucide-react";

type Tab = "tc" | "kurumsal";

export default function GirisPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("tc");

  // TC girişi
  const [tcNo, setTcNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Kurumsal giriş
  const [username, setUsername] = useState("");
  const [domain, setDomain] = useState("mersin.edu.tr");
  const [kurPassword, setKurPassword] = useState("");
  const [showKurPassword, setShowKurPassword] = useState(false);
  const [kurError, setKurError] = useState("");
  const [kurLoading, setKurLoading] = useState(false);

  // Yeni kayıt formu
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState({
    tckimlikno: "", adi: "", soyadi: "", dogumYili: "",
    gizliSoru: "", gizliCevap: "", cepTelefonu: "", oibs: ""
  });

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

  const handleKurumsal = async (e: React.FormEvent) => {
    e.preventDefault();
    setKurError("");
    if (!username.trim() || !kurPassword.trim()) { setKurError("Kullanıcı adı ve parola giriniz."); return; }
    setKurLoading(true);
    // Kurumsal giriş için TC girişine yönlendir (aynı sistem)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tcNo: username.trim(), password: kurPassword.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setKurError(data.error || "Giriş başarısız."); return; }
      router.push("/");
      router.refresh();
    } catch { setKurError("Sunucu hatası. Lütfen tekrar deneyin."); }
    finally { setKurLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3d5166] py-8">
      <div className="bg-[#eef1f5] rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">

        {/* Logo + Başlık */}
        <div className="flex flex-col items-center pt-8 pb-4 px-8">
          <img src="/logo_tr.png" alt="Mersin Üniversitesi" className="w-[130px] h-[130px] object-contain mb-4" />
          <h3 className="text-center text-[#3d8b8b] font-semibold text-base leading-snug">
            Mersin Üniversitesi<br />
            Akademik Personel Bilgi Sistemi
          </h3>
        </div>

        {/* Tab Seçimi */}
        <div className="flex border-b border-slate-200 mx-6">
          <button
            onClick={() => { setTab("tc"); setError(""); setKurError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors border-b-2 ${tab === "tc" ? "border-[#3d8b8b] text-[#3d8b8b]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <User size={15} /> TC ile Giriş
          </button>
          <button
            onClick={() => { setTab("kurumsal"); setError(""); setKurError(""); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors border-b-2 ${tab === "kurumsal" ? "border-[#3d8b8b] text-[#3d8b8b]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <Mail size={15} /> Kurumsal Giriş
          </button>
        </div>

        <div className="px-8 py-6">

          {/* TC Girişi */}
          {tab === "tc" && (
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="text"
                placeholder="T.C. Kimlik No"
                value={tcNo}
                onChange={(e) => setTcNo(e.target.value)}
                maxLength={11}
                className="w-full px-4 py-2.5 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] focus:ring-1 focus:ring-[#3d8b8b] transition"
                autoComplete="username"
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
              {error && <p className="text-red-600 text-xs text-center bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] disabled:opacity-60 text-white font-bold uppercase py-3 rounded transition-colors tracking-widest text-sm flex items-center justify-center gap-2">
                {loading && <Loader2 size={16} className="animate-spin" />} Oturum Aç
              </button>
            </form>
          )}

          {/* Kurumsal Giriş */}
          {tab === "kurumsal" && (
            <div className="space-y-4">
              {!showRegister ? (
                <form onSubmit={handleKurumsal} className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kullanıcı Adı"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] focus:ring-1 focus:ring-[#3d8b8b] transition"
                    />
                    <span className="flex items-center text-slate-500 text-sm">@</span>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="px-2 py-2.5 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] transition"
                    >
                      <option value="mersin.edu.tr">mersin.edu.tr</option>
                      <option value="ogr.mersin.edu.tr">ogr.mersin.edu.tr</option>
                    </select>
                  </div>
                  <div className="relative">
                    <input
                      type={showKurPassword ? "text" : "password"}
                      placeholder="Parola"
                      value={kurPassword}
                      onChange={(e) => setKurPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b] focus:ring-1 focus:ring-[#3d8b8b] transition pr-10"
                    />
                    <button type="button" onClick={() => setShowKurPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showKurPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <a href="#" className="text-xs text-[#3d8b8b] hover:underline">Parola Değiştirme</a>
                    <button type="button" onClick={() => setShowRegister(true)} className="text-xs text-[#3d8b8b] hover:underline">Yeni Kayıt</button>
                  </div>
                  {kurError && <p className="text-red-600 text-xs text-center bg-red-50 border border-red-200 rounded px-3 py-2">{kurError}</p>}
                  <button type="submit" disabled={kurLoading}
                    className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] disabled:opacity-60 text-white font-bold uppercase py-3 rounded transition-colors tracking-widest text-sm flex items-center justify-center gap-2">
                    {kurLoading && <Loader2 size={16} className="animate-spin" />} Giriş Yap
                  </button>
                </form>
              ) : (
                /* Yeni Kayıt Formu */
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-700 text-sm">Kimlik Bilgileri</h4>
                    <button onClick={() => setShowRegister(false)} className="text-xs text-slate-500 hover:text-slate-700">← Geri</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="TC/Yabancı Kimlik No" value={regForm.tckimlikno} onChange={e => setRegForm(p => ({...p, tckimlikno: e.target.value}))} className="col-span-2 px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                    <input placeholder="Adı" value={regForm.adi} onChange={e => setRegForm(p => ({...p, adi: e.target.value}))} className="px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                    <input placeholder="Soyadı" value={regForm.soyadi} onChange={e => setRegForm(p => ({...p, soyadi: e.target.value}))} className="px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                    <input placeholder="Doğum Yılı (Ör: 1990)" value={regForm.dogumYili} onChange={e => setRegForm(p => ({...p, dogumYili: e.target.value}))} maxLength={4} className="col-span-2 px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                  </div>
                  <h4 className="font-semibold text-slate-700 text-sm pt-1">Hesap Bilgileri</h4>
                  <input placeholder="Şifre Hatırlatma için Gizli Soru" value={regForm.gizliSoru} onChange={e => setRegForm(p => ({...p, gizliSoru: e.target.value}))} className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                  <input placeholder="Gizli Cevap" value={regForm.gizliCevap} onChange={e => setRegForm(p => ({...p, gizliCevap: e.target.value}))} className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                  <input placeholder="Cep Telefonu" value={regForm.cepTelefonu} onChange={e => setRegForm(p => ({...p, cepTelefonu: e.target.value}))} className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                  <input placeholder="Varsa Öğrenci İşleri B.S. Kullanıcı Adı" value={regForm.oibs} onChange={e => setRegForm(p => ({...p, oibs: e.target.value}))} className="w-full px-3 py-2 rounded border border-slate-300 bg-white text-sm outline-none focus:border-[#3d8b8b]" />
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                    Bilgilerinizi nüfus cüzdanınızda yazdığı şekilde eksiksiz giriniz. MERNİS sistemi üzerinden doğrulanacaktır.
                  </p>
                  <button className="w-full bg-[#3d8b8b] hover:bg-[#2e7070] text-white font-bold uppercase py-3 rounded transition-colors tracking-widest text-sm">
                    Kaydet
                  </button>
                </div>
              )}

              {/* Yardım */}
              {!showRegister && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 text-center">ePosta Yardım: <span className="font-medium">34045 - 34043 - 13530</span></p>
                </div>
              )}
            </div>
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
