import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiyana's Sukoon | Handmade Art & Arabic Calligraphy",
  description:
    "Art for your peace. Peace for your soul. Premium handmade Islamic art, custom Arabic calligraphy, canvas paintings, and bespoke gift keepsakes in Dhaka, Bangladesh.",
  keywords: [
    "Arabic Calligraphy",
    "Handmade Art Dhaka",
    "Islamic Art Bangladesh",
    "Tiyana's Sukoon",
    "Ayatul Kursi Canvas",
    "Custom Calligraphy Gift",
    "Handmade Canvas Painting",
  ],
  icons: {
    icon: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
  openGraph: {
    title: "Tiyana's Sukoon | Art For Your Peace",
    description: "Where colors meet emotions, and every stroke tells a story.",
    url: "https://www.facebook.com/profile.php?id=61594949745258",
    siteName: "Tiyana's Sukoon",
    images: [
      {
        url: "/brand/logo.jpg",
        width: 720,
        height: 720,
        alt: "Tiyana's Sukoon Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/brand/logo.jpg" type="image/jpeg" />
      </head>
      <body className="min-h-screen bg-[#06110a] text-[#f4f8f5] selection:bg-[#d4af37]/30 selection:text-[#f4dc8a] antialiased">
        {children}
      </body>
    </html>
  );
}
