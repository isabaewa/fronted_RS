import type { Metadata } from "next";
import { Unbounded } from "next/font/google";
import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";


const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "Roll & Soul",
  description: "Азиатское кафе — рамен, роллы, десерты и напитки",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${unbounded.variable} font-[Unbounded] antialiased`}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
