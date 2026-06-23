import "./globals.css";

export const metadata = {
  title: "TikTok Shop Radar",
  description: "Productos top de TikTok Shop por mercado, ordenados por GMV",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
