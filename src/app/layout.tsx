import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Produtos | Gestão de Loja",
  description:
    "Gerencie os produtos da sua loja. Visualize, edite, adicione ou remova produtos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-[#F1F5F9] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
