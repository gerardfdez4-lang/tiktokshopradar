import "./globals.css";
import { Outfit, Inter } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://first100sales.tech"),
  title: "First 100 Sales — Productos ganadores de TikTok Shop",
  description:
    "Descubre los productos que más venden en TikTok Shop por mercado, ordenados por GMV. La herramienta para conseguir tus primeras 100 ventas.",
  openGraph: {
    title: "First 100 Sales",
    description:
      "Encuentra productos ganadores en TikTok Shop y consigue tus primeras 100 ventas.",
    url: "https://first100sales.tech",
    siteName: "First 100 Sales",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0A0912",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
