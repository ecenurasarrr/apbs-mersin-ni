import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş - APBS",
};

export default function GirisLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#3d5166" }}>
      {children}
    </div>
  );
}
