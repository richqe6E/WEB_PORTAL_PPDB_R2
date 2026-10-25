import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | PPDB Online Yayasan Islam",
    default: "PPDB Online Yayasan Islam - Penerimaan Siswa Baru PAUD & TK",
  },
  description:
    "Portal resmi Penerimaan Peserta Didik Baru (PPDB) Online Yayasan Islam untuk jenjang PAUD, TK A, dan TK B. Pendaftaran mudah, verifikasi dokumen cepat, dan pantau hasil seleksi secara transparan.",
  keywords: [
    "PPDB Online",
    "Yayasan Islam",
    "Pendaftaran PAUD",
    "Pendaftaran TK",
    "TK Islam",
    "PAUD Terpadu",
    "SIAKAD Sekolah",
  ],
  authors: [{ name: "Panitia PPDB Yayasan Islam" }],
  openGraph: {
    title: "PPDB Online Yayasan Islam - Jenjang PAUD & TK",
    description:
      "Daftarkan putra-putri Anda secara online dengan mudah, transparan, dan pantau hasil seleksi berkala secara real-time.",
    siteName: "PPDB Online Yayasan Islam",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
