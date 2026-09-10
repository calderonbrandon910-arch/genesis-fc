import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.genesisfc.app"),

  title: {
    default: "Génesis FC | Sitio Oficial",
    template: "%s | Génesis FC",
  },

  description:
    "Sitio oficial de Génesis FC. Noticias, partidos, calendario, resultados, clasificación, plantilla y toda la actualidad de Los Caninos.",

  applicationName: "Génesis FC",

  keywords: [
    "Génesis FC",
    "Genesis FC",
    "Génesis de La Paz",
    "Los Caninos",
    "fútbol Honduras",
    "Liga Nacional de Honduras",
    "La Paz Honduras",
    "fútbol hondureño",
  ],

  authors: [
    {
      name: "Génesis FC",
    },
  ],

  creator: "Génesis FC",
  publisher: "Génesis FC",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "es_HN",
    url: "https://www.genesisfc.app",
    siteName: "Génesis FC",
    title: "Génesis FC | Sitio Oficial",
    description:
      "Noticias, partidos, calendario, resultados, clasificación, plantilla y toda la actualidad de Génesis FC.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Génesis FC - Sitio Oficial",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Génesis FC | Sitio Oficial",
    description:
      "Noticias, partidos, calendario, resultados, clasificación, plantilla y toda la actualidad de Génesis FC.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-HN">
      <body>{children}</body>
    </html>
  );
}